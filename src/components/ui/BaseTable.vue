<template>
  <table class="table table-bordered table-hover">
    <thead class="table-light">
      <tr>
        <td v-for="col in columns" :key="col.label">{{ col.label }}</td>
        <td>Action</td>
      </tr>
    </thead>
    <tbody v-if="loading">
      <tr v-for="n in 5" :key="n">
        <td :colspan="columns.length + 1">
          <div class="placeholder-glow">
            <span class="placeholder bg-secondary col-12"></span>
          </div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="row in rows" :key="row.id">
        <td v-for="col in columns" :key="col.key">
          <slot :name="`col-${col.key}`" :row="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>

        </td>
        <td class="text-end">
          <slot name="action" :row="row">
            <button class="btn btn-primary me-2" @click="$emit('edit', row.id)">Edit</button>
            <button class="btn btn-danger" @click="$emit('delete', row.id)">Delete</button>
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
let props = defineProps({
  columns: Array,
  rows: Array,
  loading : Boolean
});

defineEmits(['delete', 'edit']);
</script>

<style scoped></style>
