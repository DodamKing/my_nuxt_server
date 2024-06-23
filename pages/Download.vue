<template>
    <div class="container mt-5">
        <h1 class="mt-5 mb-5">파일 다운로드</h1>
        <b-button variant="success" class="mb-3" @click="$router.push({ name: 'index' })">홈</b-button>
        <b-button @click="goToUpload" class="mb-3">업로드 페이지로 이동</b-button>
        <b-select v-model="project" :options="projects" @change="fetchFileList" class="mb-3"></b-select>
        <b-card v-if="fileList.length > 0">
            <h5>파일 리스트</h5>
            <ul class="styled-list">
                <li v-for="file in fileList" :key="file" class="list-item">
                    <a :href="`/api/file-server/download/${project}/${file}`">{{ file }}</a>
                    <b-button class="delete-button" @click="showConfirmModal(file)">
                        <i class="fas fa-trash-alt"></i>
                    </b-button>
                </li>
            </ul>
        </b-card>

        <ConfirmModal ref="confirmModal" @confirm="removeItem()"></ConfirmModal>
    </div>
</template>

<script>
import ConfirmModal from '~/components/DeleteConfirmModal.vue'

export default {
    components: {
        ConfirmModal
    },

    data() {
        return {
            project: '',
            fileList: [],
            projects: [
                { value: '', text: '프로젝트 선택' },
                { value: 'stock-master', text: '자산관리' },
                { value: 'customer', text: '고객관리' },
            ],
            fileToDelete: null,
        }
    },

    methods: {
        async fetchFileList () {
            if (this.project) {
                const res = await this.$axios.$get(`/api/file-server/files/${this.project}`)
                this.fileList = res
            }
        },

        goToUpload () {
            this.$router.push({ name: 'upload' })
        },

        showConfirmModal(file) {
            this.fileToDelete = file
            this.$refs.confirmModal.show()
        },

        async removeItem () {
            const res = await this.$axios.$delete(`/api/file-server/file/${this.project}/${this.fileToDelete}`)
            this.fileList = res
            this.fileToDelete = null
        },
    }
}
</script>

<style scoped>
.list-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.styled-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.styled-list li {
    padding: 10px 15px;
    margin: 5px 0;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: background-color 0.3s, transform 0.3s;
}

.styled-list li:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
}

.styled-list li:not(:last-child) {
    margin-bottom: 10px;
}

.styled-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin: 5px 0;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: background-color 0.3s, transform 0.3s;
}

.list-item:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
}

.list-item:not(:last-child) {
    margin-bottom: 10px;
}

.delete-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.delete-button:hover {
    background-color: #ff1a1a;
}
</style>