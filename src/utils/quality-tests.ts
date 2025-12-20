/**
 * Basic quality tests for PRNG output.
 * These are educational tests to help students understand PRNG quality.
 */

export interface QualityTestResult {
  name: string;
  value: number;
  expected: number;
  tolerance: number;
  status: 'pass' | 'warn' | 'fail';
}

export interface QualityTestResults {
  mean: QualityTestResult;
  variance: QualityTestResult;
  chiSquare: QualityTestResult;
  bitBias: QualityTestResult[];
}

export function runQualityTests(samples: number[]): QualityTestResults | null {
  if (samples.length < 1000) {
    return null;
  }

  const n = samples.length;

  const mean = samples.reduce((sum, v) => sum + v, 0) / n;
  const meanExpected = 0.5;
  const meanTolerance = 0.01;
  const meanStatus = getStatus(mean, meanExpected, meanTolerance, meanTolerance * 2);

  const variance = samples.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n;
  const varianceExpected = 1 / 12;
  const varianceTolerance = 0.005;
  const varianceStatus = getStatus(
    variance,
    varianceExpected,
    varianceTolerance,
    varianceTolerance * 2,
  );

  const chiSquare = computeChiSquare(samples, 20);
  const chiSquareExpected = 19;
  const chiSquareTolerance = 10;
  const chiSquareStatus = getStatus(
    chiSquare,
    chiSquareExpected,
    chiSquareTolerance,
    chiSquareTolerance * 2,
  );

  const bitBias = computeBitBias(samples);

  return {
    mean: {
      name: 'mean',
      value: mean,
      expected: meanExpected,
      tolerance: meanTolerance,
      status: meanStatus,
    },
    variance: {
      name: 'variance',
      value: variance,
      expected: varianceExpected,
      tolerance: varianceTolerance,
      status: varianceStatus,
    },
    chiSquare: {
      name: 'chiSquare',
      value: chiSquare,
      expected: chiSquareExpected,
      tolerance: chiSquareTolerance,
      status: chiSquareStatus,
    },
    bitBias,
  };
}

function getStatus(
  value: number,
  expected: number,
  warnTolerance: number,
  failTolerance: number,
): 'pass' | 'warn' | 'fail' {
  const diff = Math.abs(value - expected);
  if (diff <= warnTolerance) {
    return 'pass';
  }
  if (diff <= failTolerance) {
    return 'warn';
  }
  return 'fail';
}

function computeChiSquare(samples: number[], bins: number): number {
  const n = samples.length;
  const expected = n / bins;
  const counts: number[] = Array.from({ length: bins }, () => 0);

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i]!;
    const bin = Math.min(Math.floor(sample * bins), bins - 1);
    counts[bin] = counts[bin]! + 1;
  }

  let chiSq = 0;
  for (const count of counts) {
    chiSq += (count - expected) ** 2 / expected;
  }

  return chiSq;
}

function computeBitBias(samples: number[]): QualityTestResult[] {
  const n = samples.length;
  const bitCounts = new Array(32).fill(0) as number[];

  for (const sample of samples) {
    const uint32 = (sample * 4294967296) >>> 0;
    for (let bit = 0; bit < 32; bit++) {
      if ((uint32 >>> bit) & 1) {
        bitCounts[bit] = (bitCounts[bit] ?? 0) + 1;
      }
    }
  }

  const results: QualityTestResult[] = [];
  const checkBits = [0, 1, 7, 15, 23, 31];

  for (const bit of checkBits) {
    const ratio = (bitCounts[bit] ?? 0) / n;
    const expected = 0.5;
    const tolerance = 0.02;
    results.push({
      name: `bit${bit}`,
      value: ratio,
      expected,
      tolerance,
      status: getStatus(ratio, expected, tolerance, tolerance * 2),
    });
  }

  return results;
}
