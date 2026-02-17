import router from "@/router";
import { toast } from "vue3-toastify";

export const notify = {
  success(text , location) {
    return toast.success(text, {
      position: "bottom-right",
      autoClose: "1000",
      onClose: () => {
        router.push(location);
      },
    });
  },

  error(text){
    return toast.error(text ,{
      position: 'bottom-right',
      autoClose : '2000'
    })
  }

};
