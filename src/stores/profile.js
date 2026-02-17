import api from "@/api/http";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useProfileStore = defineStore('profile' ,() => {

    const user = ref(null);

    async function fecthProfile(){
        let res = await api.get('/auth/profile');
        user.value = res.data.data;
        console.log(user.value);
    }
    
    return {user , fecthProfile};

})