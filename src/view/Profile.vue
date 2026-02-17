<template>
    <Navbar></Navbar>
    <div class="d-flex">
        <Sidebar></Sidebar>
        <div class="content flex-grow-1">
            <div class="profile-container">
                <!-- Profile Header Card -->
                <div class="profile-header-card">
                    <div class="profile-cover"></div>
                    <div class="profile-info-section">
                        <div class="profile-avatar">
                            <img :src="profileStore.user?.avatar" alt="Profile Avatar" />
                            <span class="status-indicator"></span>
                        </div>
                        <div class="profile-name-section">
                            <h2 class="profile-name">{{ profileStore.user?.firstName }} {{ profileStore.user?.lastName }}</h2>
                            <p class="profile-username">@{{ profileStore.user?.firstName }} {{ profileStore.user?.lastName }}</p>
                        </div>
                    </div>
                    <div class="edit-avatar ms-4 mb-3">
                        <input type="file" id="avatarInput" @change="handleAvatarChange" style="display: none;">
                        <label for="avatarInput" class="btn btn-outline-secondary mt-2">
                            <i class="fas fa-camera me-2"></i>Change Avatar
                        </label>
                    </div>
                    
                </div>

                <!-- Profile Details Card -->
                <div class="profile-details-card">
                    <div class="card-header-section">
                        <h3><i class="fas fa-user-circle me-2"></i>Profile Information</h3>
                    </div>
                    <div class="details-grid">
                        <!-- Profile ID -->
                        <div class="detail-item">
                            <div class="detail-icon bg-primary-light">
                                <i class="fas fa-id-card"></i>
                            </div>
                            <div class="detail-content">
                                <span class="detail-label">Profile ID</span>
                                <span class="detail-value">{{ profileStore.user?.id }}</span>
                            </div>
                        </div>

                        <!-- Username -->
                        <div class="detail-item">
                            <div class="detail-icon bg-info-light">
                                <i class="fas fa-at"></i>
                            </div>
                            <div class="detail-content">
                                <span class="detail-label">Username</span>
                                <span class="detail-value">{{ profileStore.user?.firstName }} {{ profileStore.user?.lastName }}</span>
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="detail-item">
                            <div class="detail-icon bg-warning-light">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="detail-content">
                                <span class="detail-label">Email Address</span>
                                <span class="detail-value">{{ profileStore.user?.email }}</span>
                            </div>
                        </div>

                        <!-- First Name -->
                        <div class="detail-item">
                            <div class="detail-icon bg-success-light">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="detail-content">
                                <span class="detail-label">First Name</span>
                                <span class="detail-value">{{ profileStore.user?.firstName }}</span>
                            </div>
                        </div>

                        <!-- Last Name -->
                        <div class="detail-item">
                            <div class="detail-icon bg-purple-light">
                                <i class="fas fa-user-tag"></i>
                            </div>
                            <div class="detail-content">
                                <span class="detail-label">Last Name</span>
                                <span class="detail-value">{{ profileStore.user?.lastName }}</span>
                            </div>
                        </div>

                        <!-- Registered At -->
                        <div class="detail-item">
                            <div class="detail-icon bg-danger-light">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="detail-content">
                                <span class="detail-label">Registered At</span>
                                <span class="detail-value">{{ formatDate(profileStore.user?.registeredAt) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons d-flex justify-content-end">
                    <button class="btn btn-edit" @click="openEditModal()">
                        <i class="fas fa-edit me-2"></i>Edit Profile
                    </button>
                </div>
            </div>
            <!-- Modal -->
             <BaseModal :showModal="modalEdit">
                <template #body>
                    <h3 class="mb-5">Edit Profile</h3>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="firstName" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="firstName" v-model="formData.firstName">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="lastName" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="lastName" v-model="formData.lastName">
                        </div>
                        <div class="col-md-12 mb-3">
                            <label for="email" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="email" v-model="formData.email">
                        </div>
                         <!-- <div class="col-md-12 mb-3">
                           <label for="avatar" class="form-label">Avatar</label>
                            <input type="file" class="form-control" id="avatar" @change="handleAvatarChange">
                        </div> -->
                    </div>
                </template>
                <template #footer>
                    <button type="button" class="btn btn-secondary" @click="modalEdit = false">Close</button>
                    <button type="button" class="btn btn-outline-success" @click="handleSaveChange">Save changes</button>
                </template>
            </BaseModal>

        </div>
    </div>
</template>

<script setup>
import api from "@/api/http";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { useProfileStore } from "@/stores/profile";
import { onMounted, reactive, ref } from "vue";

let profileStore = useProfileStore();
let modalEdit = ref(false);
let formData = reactive({
    firstName: '',
    lastName: '',
    email: ''
});



onMounted(() =>{
    profileStore.fecthProfile();
})

// format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function openEditModal() {
    modalEdit.value = true;
    formData.firstName = profileStore.user?.firstName;
    formData.lastName = profileStore.user?.lastName;
    formData.email = profileStore.user?.email;
}

const handleSaveChange = async () =>{
    try{
        let res = await api.put('/profile' , formData);
        modalEdit.value = false;
        profileStore.fecthProfile();
    }
    catch(err){
        console.log(err);

    }
}  

const handleAvatarChange = async (event) => {
    const form = new FormData();
    const file = event.target.files[0];
    if (file) {
        formData.avatar = file;
    }
    try{
        form.append('avatar' , formData.avatar);
        let res = await api.post('/profile/avatar' , form);
        modalEdit.value = false;
        profileStore.fecthProfile();
    }
    catch(err){
        console.log(err);
    }
}





</script>

<style lang="scss" scoped>
.profile-container {
    max-width: 900px;
    margin: 0 auto;
}

.profile-header-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
}

.profile-cover {
    height: 140px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
}

.profile-info-section {
    display: flex;
    align-items: flex-end;
    padding: 0 32px 24px;
    margin-top: -50px;
    flex-wrap: wrap;
    gap: 20px;
}

.profile-avatar {
    position: relative;

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 5px solid #fff;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }

    .status-indicator {
        position: absolute;
        bottom: 12px;
        right: 12px;
        width: 20px;
        height: 20px;
        background: #10b981;
        border: 3px solid #fff;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }

    50% {
        box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
}

.profile-name-section {
    padding-top: 60px;

    .profile-name {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: #1f2937;
    }

    .profile-username {
        margin: 4px 0 0;
        color: #6b7280;
        font-size: 1rem;
    }
}

.profile-details-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.card-header-section {
    padding: 20px 28px;
    border-bottom: 1px solid #f0f0f0;

    h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
    }
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    padding: 28px;
}

.detail-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    background: #fafbfc;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
        background: #f0f4ff;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1);
    }
}

.detail-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
        font-size: 1.25rem;
    }

    &.bg-primary-light {
        background: #eef2ff;
        color: #6366f1;
    }

    &.bg-info-light {
        background: #e0f2fe;
        color: #0ea5e9;
    }

    &.bg-warning-light {
        background: #fef3c7;
        color: #f59e0b;
    }

    &.bg-success-light {
        background: #d1fae5;
        color: #10b981;
    }

    &.bg-purple-light {
        background: #ede9fe;
        color: #8b5cf6;
    }

    &.bg-danger-light {
        background: #fee2e2;
        color: #ef4444;
    }
}

.detail-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

.detail-value {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;
}

.action-buttons {
    display: flex;
    gap: 16px;
    margin-top: 28px;
    flex-wrap: wrap;

    .btn {
        padding: 12px 28px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
    }

    .btn-edit {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: #fff;
        border: none;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
        }
    }

    .btn-change-password {
        background: #fff;
        color: #4b5563;
        border: 2px solid #e5e7eb;

        &:hover {
            border-color: #6366f1;
            color: #6366f1;
            background: #fafbfc;
        }
    }
}

// Responsive Design
@media (max-width: 768px) {
    .profile-info-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0 20px 20px;
    }

    .profile-name-section {
        padding-top: 16px;
    }

    .details-grid {
        grid-template-columns: 1fr;
        padding: 20px;
    }

    .action-buttons {
        justify-content: center;
    }
}
</style>
