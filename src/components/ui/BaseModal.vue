<template>
    <div v-if="showModal">
        <div class="modal d-block show" tabindex="-1">
            <div class="modal-dialog-centered modal-dialog">
                <div class="modal-content">
                    <!-- <div class="modal-header">
                       
                    </div> -->
                    <div class="modal-body">
                        <slot name = "body"></slot>
                    </div>
                    <div class="modal-footer">
                        <slot name= "footer">                        </slot>
                        <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="handleClose()">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
let props = defineProps({
    showModal : Boolean
})
</script>

<style scoped></style>