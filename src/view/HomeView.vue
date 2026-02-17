<template>
    <!-- Top Navbar -->
    <Navbar></Navbar>
    <div class="d-flex">
      <!-- Sidebar -->
      <Sidebar></Sidebar>
      <!-- Main Content -->
      <div class="flex-grow-1 content">
        <!-- Page Title -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold">Article List</h3>
          <select class="form-select w-auto" v-model="sortDir">
              <option value="asc">Asending</option>
              <option value="desc">Desending</option>
          </select>
          <div>
            <input v-model="search" type="text" class="form-control" placeholder="Search articles...">
          </div>
        </div>

        <!-- Stats -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card p-3">
              <h6>Total Articles</h6>
              <h3 class="fw-bold">120</h3>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">
              <h6>Published</h6>
              <h3 class="fw-bold text-success">85</h3>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">
              <h6>Draft</h6>
              <h3 class="fw-bold text-warning">35</h3>
            </div>
          </div>
        </div>

        <!-- Article Cards -->
        <div class="row g-4">
          <BaseCard :articles="ArticleStore.articles"></BaseCard>
        </div>
      </div>
    </div>

</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import { useArticleStore } from '@/stores/article';
import { onMounted, ref, watch } from 'vue';

let ArticleStore = useArticleStore()
let search = ref('')
let sortDir = ref('');



watch([search , sortDir], async ([value , s]) => {
  await ArticleStore.fecthArticles({
    search : value,
    sortDir : sortDir.value
  })
})

onMounted (async () =>{
  await ArticleStore.fecthArticles();
})

</script>

<style lang="scss" scoped></style>