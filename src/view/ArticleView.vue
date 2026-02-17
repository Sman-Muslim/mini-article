<template>
  <!-- Top Navbar -->
  <Navbar></Navbar>
  <div class="d-flex">
    <!-- Sidebar -->
    <Sidebar></Sidebar>
    <!-- Main Content -->
    <div class="flex-grow-1 content">
      <h3>Article Page</h3>
      <div class="text-end">
        <button class="btn btn-primary mb-3" @click="router.push('/createArticle')">Add Article</button>
      </div>
      <BaseTable :columns="columns" :rows="articleStore.ownArticle" @delete="handleDelete"
        @edit="handleEdit">
        <template #col-thumbnail="{ value }">
          <img :src="value" alt="" width="120px" height="120px" class="object-fit-cover">
        </template>
        <template #col-category="{ value }">
          {{ value?.name }}
        </template>
      </BaseTable>
      <BasePagination :total-page="articleStore.pagination.totalPages" :current-page="articleStore.pagination.currentPage"
      @update:current-page="handleNextPage"></BasePagination>
    </div>
  </div>
</template>
<script setup>
import api from '@/api/http'
import { onMounted, ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import { useArticleStore } from '@/stores/article';
import BaseTable from '@/components/ui/BaseTable.vue';
import router from '@/router';
import BasePagination from '@/components/ui/BasePagination.vue';

let articleStore = useArticleStore();
let perPage = ref(3)
onMounted(async () => {
  await articleStore.fecthOwnArticle(1,perPage.value);
})
let columns = [
  { label: "Id", key: "id" },
  { label: "Title", key: "title" },
  { label: "Content", key: "content" },
  { label: "Thumbnail", key: "thumbnail" },
  { label: "Category", key: "category" },
]

async function handleDelete(id) {
  await api.delete(`/articles/${id}`);
  await articleStore.fecthOwnArticle(1,perPage.value);
}

async function handleEdit(id) {
  router.push(`/editArticle/${id}`);
}

function handleNextPage(page){
  articleStore.fecthOwnArticle(page,perPage.value);
}



</script>