import api from "@/api/http";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
export const useCategoryStore = defineStore('category' , () =>{
    let categories = ref([]);
    let isloading = ref(false);
    let pagination = reactive({
            "currentPage": 0,
            "itemPerPage": 0,
            "totalItems": 0,
            "totalPages": 0,
            "hasPreviousPage": true,
            "hasNextPage": true
        });

    //action
    async function fecthCategory(page=1, per_page=10){
        isloading.value = true
        let res = await api.get(`/categories?_page=${page}&_per_page=${per_page}`);

        categories.value = res.data.data.items;
        pagination.totalItems =  res.data.data.meta.totalItems;
        pagination.totalPages = res.data.data.meta.totalPages;
        pagination.currentPage = res.data.data.meta.currentPage;
        isloading.value = false
    }

    //return
    return {categories , fecthCategory , pagination , isloading}
})