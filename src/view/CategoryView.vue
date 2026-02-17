<template>
    <Navbar></Navbar>
    <div class="d-flex">
        <Sidebar></Sidebar>
        <div class="flex-grow-1 content">
            <h1>Category</h1>
            <div class="text-end">
                <button class="btn btn-primary mb-3" @click="show()">Create New Category</button>
            </div>

            <!-- Base Table -->
            <BaseTable :columns="columns" :rows="category.categories">
                <template #action="{ row }">
                    <button class="btn btn-outline-primary me-2" @click="editCategory(row.id)">Edit</button>
                    <button class="btn btn-outline-danger" @click="categorydelete(row.id)">Delete</button>
                </template>
            </BaseTable>
            <!-- Pagination -->
            <BasePagination :totalPage="category.pagination.totalPages" :currentPage="category.pagination.currentPage" @update:currentPage="handleNextPage"></BasePagination>
            <!-- Base Modal -->
             <!-- For Create -->
            <BaseModal :showModal="showModal">
                <template #body>
                    <label for="name" class="form-label">Name</label>
                    <input v-model="name" type="text" class="form-control" id="name" placeholder="Enter category name">
                </template>
                <template #footer>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        @click="handleclose()">Close</button>
                    <button type="button" class="btn btn-primary" @click="createNewCategory">Create New</button>
                </template>
            </BaseModal>

            <!-- For Edit -->
            <BaseModal :showModal="editcategory">
                <template #body>
                    <label for="name" class="form-label">Name</label>
                    <input v-model="name" type="text" class="form-control" id="name" placeholder="Enter category name">
                </template>
                <template #footer>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="handleclose()">Close</button>
                    <button type="button" class="btn btn-primary" @click="updateCategory()">Update Category</button>
                </template>
            </BaseModal>

            <!-- For Delete -->
            <BaseModal :showModal="deletecategory">
                <template #body>
                    <p>Are you sure you want to delete this category?</p>
                </template>
                <template #footer>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="handleclose()">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="handledelete()">Delete</button>
                </template>
            </BaseModal>
        </div>
    </div>
</template>

<script setup>
import api from '@/api/http';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import BaseTable from '@/components/ui/BaseTable.vue';
import { useCategoryStore } from '@/stores/category';
import { onMounted, ref, TrackOpTypes } from 'vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import BasePagination from '@/components/ui/BasePagination.vue';

let category = useCategoryStore();
let showModal = ref(false);
let editcategory = ref(false);
let deletecategory = ref(false);
let name = ref('');
let categoryId = ref(null);
let per_page = ref(6);

onMounted(async () => {
    await category.fecthCategory(1,per_page.value);
    // console.log(category.categories);
    // console.log(category.pagination);
})
let columns = [
    { label: "Name", key: "name" },
]

function handleNextPage(page){
    category.fecthCategory(page,per_page.value)
    // console.log(page);
    
}

function show() {
    showModal.value = true;
}
function handleclose() {
    showModal.value = false;
    editcategory.value = false;
    deletecategory.value = false;
    name.value = '';
}

const createNewCategory = async () => {
    try {
        await api.post('/categories', {
            name: name.value
        })
        name.value = '';
        await category.fecthCategory(category.pagination.currentPage,per_page.value);
        handleclose()

    } catch (error) {
        console.log(error);
    }
}

const editCategory = async (id) =>{
    categoryId.value = id;
    const categoryData = category.categories.find(data => data.id === id);
    if(categoryData){
        name.value = categoryData.name;
    }
    editcategory.value = true;
    
}
const updateCategory = async (id) => {
    try {
        await api.put(`/categories/${categoryId.value}`, {
            name: name.value
        })
        name.value = '';
         handleclose();
        await category.fecthCategory(category.pagination.currentPage,per_page.value);
    } catch (error) {
        console.log(error);
    }
}

const categorydelete = async (id) => {
    categoryId.value = id;
    deletecategory.value = true;
}

const handledelete = async () => {
    try{
        await api.delete(`/categories/${categoryId.value}`);
        await category.fecthCategory(category.pagination.currentPage,per_page.value);
        handleclose();
    }
    catch(error){
        console.log(error);
    }
}




</script>

<style scoped></style>