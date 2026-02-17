<template>
    <div>
        <!-- Navbar -->
        <Navbar></Navbar>
        <div class="d-flex">
            <!-- Sidebar -->
            <Sidebar></Sidebar>
            <div class="flex-grow-1 content">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-10 col-lg-6">
                        <div class="card p-4">
                            <h5 class="fw-bold mb-3">Create New Article</h5>
                            <form @submit.prevent="handleCreate()">
                                <!-- Title -->
                                <div class="mb-3">
                                    <label class="form-label">Article Title</label>
                                    <input type="text" class="form-control" placeholder="Enter article title"
                                        v-model="form.title" />
                                    <p v-if="error.title" class="text-danger small mt-1">{{ error.title }}</p>
                                </div>

                                <!-- Category -->
                                <div class="mb-3">
                                    <!-- {{ categoryStore.categories }} -->
                                    <label class="form-label">Category</label>
                                    <select class="form-select" v-model="form.categoryId">
                                        <option selected disabled>Choose category</option>
                                        <option v-for="item in categoryStore.categories" :key="item.id"
                                            :value="item.id">{{ item.name }}</option>
                                    </select>
                                    <p v-if="error.categoryId" class="text-danger small mt-1">{{ error.categoryId }}</p>
                                </div>

                                <!-- Status -->
                                <!-- <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select">
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div> -->

                                <!-- Thumbnail -->
                                <div class="mb-3">
                                    <label class="form-label">Thumbnail Image</label>
                                    <input type="file" @change="handlefile" class="form-control" />
                                    <p v-if="error.thumbnail" class="text-danger small mt-1">{{ error.thumbnail }}</p>
                                </div>

                                <!-- Content -->
                                <div class="mb-3">
                                    <label class="form-label">Content</label>
                                    <textarea class="form-control" rows="5" placeholder="Write your article content..."
                                        v-model="form.content"></textarea>
                                    <p v-if="error.content" class="text-danger small mt-1">{{ error.content }}</p>
                                </div>

                                <!-- Actions -->
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="reset" class="btn btn-outline-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" :disabled="isCreate" class="btn btn-primary">
                                        <div v-if="isCreate" class="spinner-border text-light" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <div v-else>Publish Article</div>
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '@/api/http';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import router from '@/router';
import { useCategoryStore } from '@/stores/category';
import { notify } from '@/utils/toast';
import { minlength, required, validation } from '@/utils/validation';
import { onMounted, reactive, ref } from 'vue';
let categoryStore = useCategoryStore();
let isCreate = ref(false);
let form = ref({
    title: "",
    content: "",
    categoryId: ""
})

let error = reactive({
    title: "",
    content: "",
    categoryId: ""
})

let file = ref(null);
onMounted(async () => {
    await categoryStore.fecthCategory();
})

function validateCreate() {
    error.content = validation(form.value.content, [
        (v) => required(v, "Content is required"),
        (v) => minlength(v, 10, "Content must be at least 10 characters")
    ])
    error.title = required(form.value.title, "Title is required");
    error.categoryId = required(form.value.categoryId, "Category is required");
    error.thumbnail = required(file.value, "Thumbnail is required");
    return !error.title && !error.content && !error.categoryId && !error.thumbnail;
}

const handleCreate = async () => {
    if (!validateCreate()) {
        isCreate.value = false;
        return
    };
    isCreate.value = true;
    let articleID = ref(null);
    try {
        let res = await api.post('/articles', form.value);
        articleID = res.data.data.id;
        if (file.value) {
            let fData = new FormData();
            fData.append('thumbnail', file.value)
            let res = await api.post(`/articles/${articleID}/thumbnail`, fData);
        }
        router.push('/articles');
    }
    catch (error) {
        if(articleID){
            try{
                await api.delete(`/articles/${articleID}`);
            }
            catch(err){
                console.error('Failed to delete article after thumbnail upload failure', err);
            }
        }
        const msg = error?.response?.data?.message || error?.message || 'Create article failed';
        notify.error(msg);
        form.value = {
            title: "",
            content: "",
            categoryId: ""
        }
        isCreate.value = false;
        // console.error(error);
    }

}

const handlefile = (event) => {
    let selectFile = event.target.files[0];
    console.log(selectFile);
    if (selectFile) {
        file.value = selectFile;
    }
}


</script>

<style scoped></style>