<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 5,
  },
);

const { t } = useI18n();

const selectedCell = ref<{ row: number; col: number } | null>(null);

const grid = computed(() => {
  const rows = [];
  for (let row = 1; row <= props.size; row++) {
    const cells = [];
    for (let col = 1; col <= props.size; col++) {
      cells.push({
        row,
        col,
        value: row * col,
        isSelected: selectedCell.value?.row === row && selectedCell.value?.col === col,
      });
    }
    rows.push(cells);
  }
  return rows;
});

const selectedResult = computed(() => {
  if (!selectedCell.value) {
    return null;
  }
  return {
    row: selectedCell.value.row,
    col: selectedCell.value.col,
    value: selectedCell.value.row * selectedCell.value.col,
  };
});

function selectCell(row: number, col: number) {
  selectedCell.value = { row, col };
}

function clearSelection() {
  selectedCell.value = null;
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6 glass rounded-xl">
    <div class="text-lg font-semibold text-body">{{ t('learn.multiplication.title') }}</div>

    <!-- Grid -->
    <div class="flex flex-col gap-0.5">
      <div class="flex gap-0.5">
        <div
          class="w-10 h-10 flex items-center justify-center font-semibold text-muted bg-page dark:bg-page"
        >
          ×
        </div>
        <div
          v-for="col in props.size"
          :key="`h-${col}`"
          class="w-10 h-10 flex items-center justify-center font-semibold text-primary bg-primary/10 dark:bg-primary/20 rounded"
        >
          {{ col }}
        </div>
      </div>

      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="flex gap-0.5">
        <div
          class="w-10 h-10 flex items-center justify-center font-semibold text-primary bg-primary/10 dark:bg-primary/20 rounded"
        >
          {{ rowIndex + 1 }}
        </div>
        <button
          v-for="cell in row"
          :key="`${cell.row}-${cell.col}`"
          class="w-10 h-10 flex items-center justify-center text-sm font-medium border rounded transition-all duration-200"
          :class="
            cell.isSelected
              ? 'bg-primary text-page border-primary'
              : 'bg-page dark:bg-page text-body border-border hover:border-primary'
          "
          @click="selectCell(cell.row, cell.col)"
        >
          {{ cell.value }}
        </button>
      </div>
    </div>

    <!-- Result -->
    <div
      v-if="selectedResult"
      class="flex flex-col items-center gap-4 p-4 bg-page dark:bg-page rounded-lg"
    >
      <div class="flex flex-col gap-1">
        <div v-for="i in selectedResult.row" :key="i" class="flex gap-1">
          <span v-for="j in selectedResult.col" :key="j" class="text-xs text-primary">●</span>
        </div>
      </div>
      <div class="text-xl font-bold text-body">
        {{ selectedResult.row }} × {{ selectedResult.col }} = {{ selectedResult.value }}
      </div>
      <div class="text-sm text-muted text-center">
        {{
          t('learn.multiplication.explanation', {
            rows: selectedResult.row,
            cols: selectedResult.col,
            result: selectedResult.value,
          })
        }}
      </div>
    </div>

    <button v-if="selectedCell" class="btn-outline text-sm" @click="clearSelection">
      {{ t('learn.multiplication.clear') }}
    </button>
  </div>
</template>
