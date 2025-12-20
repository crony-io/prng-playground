import type { DslOperand, DslOperation, DslOperationType } from '@/types/dsl';
import { generateOperationId } from '@/types/dsl';

export type WorkshopDslCodeErrorCode =
  | 'invalid_statement'
  | 'invalid_target'
  | 'invalid_expression'
  | 'invalid_operand'
  | 'invalid_number'
  | 'amount_must_be_number'
  | 'amount_out_of_range'
  | 'unsupported_operator'
  | 'unsupported_function';

export interface WorkshopDslCodeParseError {
  code: WorkshopDslCodeErrorCode;
  line: number;
  column: number;
  rawLine: string;
  details?: Record<string, string | number>;
}

export interface WorkshopDslCodeParseResult {
  operations: DslOperation[];
  errors: WorkshopDslCodeParseError[];
}

const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const NUMBER_RE = /^[-+]?(?:0x[0-9a-fA-F]+|\d+)$/;

const ASSIGNMENT_RE = /^([A-Za-z_][A-Za-z0-9_]*)\s*(>>>=|<<=|>>=|\+=|-=|\*=|\^=|&=|\|=|=)\s*(.+)$/;

const OPERAND_PATTERN = '(?:[A-Za-z_][A-Za-z0-9_]*|[-+]?(?:0x[0-9a-fA-F]+|\\d+))';
const BINARY_RE = new RegExp(
  `^(${OPERAND_PATTERN})\\s*(>>>|<<|>>|\\+|-|\\*|\\^|&|\\|)\\s*(${OPERAND_PATTERN})$`,
);
const UNARY_NOT_RE = new RegExp(`^~\\s*(${OPERAND_PATTERN})$`);
const ROTATE_RE = new RegExp(
  `^(rotl|rotr)\\s*\\(\\s*(${OPERAND_PATTERN})\\s*,\\s*(${OPERAND_PATTERN})\\s*\\)$`,
);

function stripInlineComment(rawLine: string): string {
  const commentStart = rawLine.indexOf('//');
  if (commentStart !== -1) {
    return rawLine.slice(0, commentStart);
  }
  return rawLine;
}

function stripTrailingSemicolon(line: string): string {
  return line.trimEnd().endsWith(';') ? line.trimEnd().slice(0, -1) : line;
}

function createError(
  code: WorkshopDslCodeErrorCode,
  line: number,
  column: number,
  rawLine: string,
  details?: Record<string, string | number>,
): WorkshopDslCodeParseError {
  return { code, line, column, rawLine, details };
}

function parseNumberLiteral(token: string): number | null {
  if (!NUMBER_RE.test(token)) {
    return null;
  }

  const sign = token.startsWith('-') ? -1 : 1;
  const unsigned = token.startsWith('-') || token.startsWith('+') ? token.slice(1) : token;

  if (/^0x/i.test(unsigned)) {
    const hex = unsigned.slice(2);
    if (!hex) {
      return null;
    }
    const parsed = parseInt(hex, 16);
    return Number.isFinite(parsed) ? parsed * sign : null;
  }

  const parsed = parseInt(unsigned, 10);
  return Number.isFinite(parsed) ? parsed * sign : null;
}

function parseOperandToken(
  token: string,
  line: number,
  rawLine: string,
  column: number,
): { operand?: DslOperand; error?: WorkshopDslCodeParseError } {
  if (IDENTIFIER_RE.test(token)) {
    return { operand: { type: 'state', value: token } };
  }

  const num = parseNumberLiteral(token);
  if (num !== null) {
    return { operand: { type: 'const', value: num } };
  }

  if (NUMBER_RE.test(token)) {
    return { error: createError('invalid_number', line, column, rawLine, { token }) };
  }

  return { error: createError('invalid_operand', line, column, rawLine, { token }) };
}

function mapBinaryOperator(op: string): DslOperationType | null {
  switch (op) {
    case '+':
      return 'add';
    case '-':
      return 'sub';
    case '*':
      return 'mul';
    case '^':
      return 'xor';
    case '&':
      return 'and';
    case '|':
      return 'or';
    case '<<':
      return 'shl';
    case '>>':
      return 'shr';
    case '>>>':
      return 'ushr';
    default:
      return null;
  }
}

function mapCompoundAssignmentOperator(op: string): DslOperationType | null {
  switch (op) {
    case '+=':
      return 'add';
    case '-=':
      return 'sub';
    case '*=':
      return 'mul';
    case '^=':
      return 'xor';
    case '&=':
      return 'and';
    case '|=':
      return 'or';
    case '<<=':
      return 'shl';
    case '>>=':
      return 'shr';
    case '>>>=':
      return 'ushr';
    default:
      return null;
  }
}

function parseShiftAmountFromOperand(
  operand: DslOperand,
  lineNumber: number,
  column: number,
  rawLine: string,
): { amount?: number; error?: WorkshopDslCodeParseError } {
  if (operand.type !== 'const') {
    return {
      error: createError('amount_must_be_number', lineNumber, column, rawLine, {
        token: String(operand.value),
      }),
    };
  }

  const amount = operand.value as number;
  if (amount < 0 || amount > 31) {
    return {
      error: createError('amount_out_of_range', lineNumber, column, rawLine, { amount }),
    };
  }

  return { amount };
}

function parseLine(
  rawLine: string,
  lineNumber: number,
): { operation?: DslOperation; errors: WorkshopDslCodeParseError[] } {
  const errors: WorkshopDslCodeParseError[] = [];

  const noComment = stripInlineComment(rawLine);
  const trimmed = stripTrailingSemicolon(noComment).trim();

  if (!trimmed) {
    return { errors };
  }

  if (trimmed.startsWith('#')) {
    return { errors };
  }

  const assignmentMatch = trimmed.match(ASSIGNMENT_RE);
  if (!assignmentMatch) {
    return {
      errors: [createError('invalid_statement', lineNumber, 1, rawLine)],
    };
  }

  const target = assignmentMatch[1]?.trim() ?? '';
  const assignOp = assignmentMatch[2]?.trim() ?? '';
  const rhs = assignmentMatch[3]?.trim() ?? '';

  if (!IDENTIFIER_RE.test(target)) {
    return {
      errors: [createError('invalid_target', lineNumber, 1, rawLine, { target })],
    };
  }

  if (!rhs) {
    return {
      errors: [
        createError('invalid_expression', lineNumber, trimmed.indexOf(assignOp) + 1, rawLine),
      ],
    };
  }

  const compoundOp = assignOp !== '=' ? mapCompoundAssignmentOperator(assignOp) : null;
  if (assignOp !== '=' && !compoundOp) {
    return {
      errors: [
        createError('unsupported_operator', lineNumber, trimmed.indexOf(assignOp) + 1, rawLine, {
          operator: assignOp,
        }),
      ],
    };
  }

  if (compoundOp) {
    const rhsParsed = parseOperandToken(rhs, lineNumber, rawLine, trimmed.indexOf(rhs) + 1);
    if (rhsParsed.error) {
      return { errors: [rhsParsed.error] };
    }

    const base: DslOperation = {
      id: generateOperationId(),
      op: compoundOp,
      target,
      left: { type: 'state', value: target },
    };

    if (compoundOp === 'shl' || compoundOp === 'shr' || compoundOp === 'ushr') {
      const amountResult = parseShiftAmountFromOperand(
        rhsParsed.operand as DslOperand,
        lineNumber,
        trimmed.indexOf(rhs) + 1,
        rawLine,
      );
      if (amountResult.error) {
        return { errors: [amountResult.error] };
      }
      base.amount = amountResult.amount;
      return { operation: base, errors };
    }

    base.right = rhsParsed.operand;
    return { operation: base, errors };
  }

  const rotateMatch = rhs.match(ROTATE_RE);
  if (rotateMatch) {
    const fn = rotateMatch[1] as 'rotl' | 'rotr';

    const leftToken = rotateMatch[2] ?? '';
    const amountToken = rotateMatch[3] ?? '';

    const leftParsed = parseOperandToken(
      leftToken,
      lineNumber,
      rawLine,
      rhs.indexOf(leftToken) + 1,
    );
    if (leftParsed.error) {
      return { errors: [leftParsed.error] };
    }

    const amountParsed = parseOperandToken(
      amountToken,
      lineNumber,
      rawLine,
      rhs.indexOf(amountToken) + 1,
    );
    if (amountParsed.error) {
      return { errors: [amountParsed.error] };
    }

    const op: DslOperation = {
      id: generateOperationId(),
      op: fn,
      target,
      left: leftParsed.operand,
    };

    const rhsOffset = trimmed.indexOf(rhs);
    const amountResult = parseShiftAmountFromOperand(
      amountParsed.operand as DslOperand,
      lineNumber,
      rhsOffset + rhs.indexOf(amountToken) + 1,
      rawLine,
    );
    if (amountResult.error) {
      return { errors: [amountResult.error] };
    }
    op.amount = amountResult.amount;

    return { operation: op, errors };
  }

  const unaryMatch = rhs.match(UNARY_NOT_RE);
  if (unaryMatch) {
    const token = unaryMatch[1] ?? '';
    const parsed = parseOperandToken(token, lineNumber, rawLine, rhs.indexOf(token) + 1);
    if (parsed.error) {
      return { errors: [parsed.error] };
    }

    return {
      operation: {
        id: generateOperationId(),
        op: 'not',
        target,
        left: parsed.operand,
      },
      errors,
    };
  }

  const binaryMatch = rhs.match(BINARY_RE);
  if (binaryMatch) {
    const leftToken = binaryMatch[1] ?? '';
    const operatorToken = binaryMatch[2] ?? '';
    const rightToken = binaryMatch[3] ?? '';

    const opType = mapBinaryOperator(operatorToken);
    if (!opType) {
      return {
        errors: [
          createError('unsupported_operator', lineNumber, rhs.indexOf(operatorToken) + 1, rawLine, {
            operator: operatorToken,
          }),
        ],
      };
    }

    const leftParsed = parseOperandToken(
      leftToken,
      lineNumber,
      rawLine,
      rhs.indexOf(leftToken) + 1,
    );
    if (leftParsed.error) {
      return { errors: [leftParsed.error] };
    }

    const rightParsed = parseOperandToken(
      rightToken,
      lineNumber,
      rawLine,
      rhs.indexOf(rightToken) + 1,
    );
    if (rightParsed.error) {
      return { errors: [rightParsed.error] };
    }

    const op: DslOperation = {
      id: generateOperationId(),
      op: opType,
      target,
      left: leftParsed.operand,
    };

    if (opType === 'shl' || opType === 'shr' || opType === 'ushr') {
      const rhsOffset = trimmed.indexOf(rhs);
      const amountResult = parseShiftAmountFromOperand(
        rightParsed.operand as DslOperand,
        lineNumber,
        rhsOffset + rhs.indexOf(rightToken) + 1,
        rawLine,
      );
      if (amountResult.error) {
        return { errors: [amountResult.error] };
      }
      op.amount = amountResult.amount;
      return { operation: op, errors };
    }

    op.right = rightParsed.operand;
    return { operation: op, errors };
  }

  const rhsToken = rhs.trim();
  const rhsParsed = parseOperandToken(rhsToken, lineNumber, rawLine, trimmed.indexOf(rhsToken) + 1);
  if (rhsParsed.error) {
    return { errors: [rhsParsed.error] };
  }

  return {
    operation: {
      id: generateOperationId(),
      op: 'assign',
      target,
      left: rhsParsed.operand,
    },
    errors,
  };
}

export function parseWorkshopOperationsCode(code: string): WorkshopDslCodeParseResult {
  const operations: DslOperation[] = [];
  const errors: WorkshopDslCodeParseError[] = [];

  const lines = code.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] ?? '';
    const lineNumber = i + 1;

    const result = parseLine(rawLine, lineNumber);
    if (result.errors.length > 0) {
      errors.push(...result.errors);
      continue;
    }

    if (result.operation) {
      operations.push(result.operation);
    }
  }

  return { operations, errors };
}

function formatConst(value: number): string {
  if (value < 0) {
    return String(value);
  }

  if (value <= 1000) {
    return String(value);
  }

  return `0x${value.toString(16)}`;
}

function formatOperand(operand: DslOperand | undefined): string {
  if (!operand) {
    return '0';
  }
  if (operand.type === 'const') {
    return formatConst(operand.value as number);
  }
  return String(operand.value);
}

export function formatWorkshopOperationsCode(operations: readonly DslOperation[]): string {
  return operations.map((op) => formatOperation(op)).join('\n');
}

function formatOperation(op: DslOperation): string {
  const left = formatOperand(op.left);

  switch (op.op) {
    case 'add':
      return `${op.target} = ${left} + ${formatOperand(op.right)}`;
    case 'sub':
      return `${op.target} = ${left} - ${formatOperand(op.right)}`;
    case 'mul':
      return `${op.target} = ${left} * ${formatOperand(op.right)}`;
    case 'xor':
      return `${op.target} = ${left} ^ ${formatOperand(op.right)}`;
    case 'and':
      return `${op.target} = ${left} & ${formatOperand(op.right)}`;
    case 'or':
      return `${op.target} = ${left} | ${formatOperand(op.right)}`;
    case 'not':
      return `${op.target} = ~${left}`;
    case 'shl': {
      const amount =
        typeof op.amount === 'number'
          ? formatConst(op.amount)
          : op.right
            ? formatOperand(op.right)
            : '0';
      return `${op.target} = ${left} << ${amount}`;
    }
    case 'shr': {
      const amount =
        typeof op.amount === 'number'
          ? formatConst(op.amount)
          : op.right
            ? formatOperand(op.right)
            : '0';
      return `${op.target} = ${left} >> ${amount}`;
    }
    case 'ushr': {
      const amount =
        typeof op.amount === 'number'
          ? formatConst(op.amount)
          : op.right
            ? formatOperand(op.right)
            : '0';
      return `${op.target} = ${left} >>> ${amount}`;
    }
    case 'rotl': {
      const amount =
        typeof op.amount === 'number'
          ? formatConst(op.amount)
          : op.right
            ? formatOperand(op.right)
            : '0';
      return `${op.target} = rotl(${left}, ${amount})`;
    }
    case 'rotr': {
      const amount =
        typeof op.amount === 'number'
          ? formatConst(op.amount)
          : op.right
            ? formatOperand(op.right)
            : '0';
      return `${op.target} = rotr(${left}, ${amount})`;
    }
    case 'assign':
    case 'const':
    case 'state':
      return `${op.target} = ${left}`;
    default:
      return `${op.target} = ${left}`;
  }
}
