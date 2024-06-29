<template>
    <b-container>
        <h1 class="mt-5 mb-5">파일 업로드</h1>
        <b-button variant="success" class="mb-3" @click="$router.push({ name: 'index' })">홈</b-button>
        <b-button @click="goToDownload" class="mb-3">다운로드 페이지로 이동</b-button>
        <b-button variant="primary" @click="showModal = true" class="mb-3">프로젝트 추가</b-button>
        <b-button variant="primary" @click="showManageModal = true" class="mb-3">프로젝트 삭제</b-button>
        <b-form-select :options="projects" v-model="project" @change="fetchFileList" class="mb-3"></b-form-select>
        <b-card v-if="fileList.length > 0" class="mb-3">
            <h5>파일</h5>
            <div v-for="file in fileList" :key="file">{{ file }}</div>
        </b-card>
        <b-form-input v-model="version" class="mb-3" placeholder="버전 입력"></b-form-input>
        <b-file type="file" @change="handleFileChange" class="mb-3"></b-file>
        <div class="d-flex justify-content-end">
            <b-button variant="primary" @click="handleUpload">파일 업로드</b-button>
        </div>

        <Modal :show="showModal" @close="showModal = false">
            <template #header>
                <h4>새 프로젝트 추가</h4>
            </template>
            <template #body>
                <b-input v-model="newProject.value" placeholder="값 입력" />
                <b-input v-model="newProject.text" placeholder="텍스트 입력" class="mt-3" />
            </template>
            <template #footer>
                <b-button variant="success" @click="addProject">추가</b-button>
                <b-button variant="danger" @click="showModal = false">취소</b-button>
            </template>
        </Modal>

        <!-- 관리 모달 -->
        <Modal :show="showManageModal" @close="showManageModal = false">
            <template #header>
                <h3 class="text-xl font-semibold">항목 관리</h3>
            </template>
            <template #body>
                <ul class="styled-list">
                    <li v-for="project in projects.filter(p => p.id)" :key="project.id" class="list-item">
                        <div class="project-info">
                            <span class="project-text">{{ project.text }}</span>
                            <span class="project-value">{{ project.value }}</span>
                        </div>
                        <b-button @click="deleteProject(project.id)" class="delete-button">
                            <i class="fas fa-trash-alt"></i>
                        </b-button>
                    </li>
                </ul>
            </template>
            <template #footer>
                <b-button @click="showManageModal = false"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200">닫기</b-button>
            </template>
        </Modal>
    </b-container>
</template>

<script>
import Modal from '~/components/Modal.vue'

export default {
    components: {
        Modal
    },

    computed: {
        projects() {
            return this.$store.state.projects
        }
    },

    mounted() {
        this.$store.dispatch('fetchProject')
    },

    data() {
        return {
            project: '',
            file: null,
            version: '',
            fileList: [],
            showModal: false,
            showManageModal: false,
            newProject: { value: '', text: '' }
        }
    },

    methods: {
        handleFileChange(e) {
            this.file = e.target.files[0]
        },

        async handleUpload() {
            if (!this.project) return alert('프로젝트를 선택하시오!')
            if (!this.file) return alert('파일을 올려야지')
            if (!this.version) return alert('버전도 알려줘')

            const formData = new FormData()
            formData.append('project', this.project)
            formData.append('version', this.version)
            formData.append('file', this.file)

            const res = await this.$axios.$post('/api/file-server/upload', formData)
            if (!res.errorr) {
                this.fileList = res
            }
        },

        async fetchFileList() {
            if (this.project) {
                const res = await this.$axios.$get(`/api/file-server/files/${this.project}`)
                if (res) this.fileList = res
                else this.fileList = []
            }
        },

        goToDownload() {
            this.$router.push({ name: 'download' })
        },

        updateProjects(projects) {
            this.$store.dispatch('updateProjects', { projects })
        },

        addProject() {
            if (this.newProject.text && this.newProject.value) {
                const newProject = {
                    id: Date.now(),
                    value: this.newProject.value,
                    text: this.newProject.text,
                }
                this.$store.dispatch('addNewProject', newProject)
                this.resetNewProject()
                this.showModal = false
            } else {
                alert('텍스트와 값을 모두 입력해주세요.')
            }
        },

        resetNewProject() {
            this.newProject.value = ''
            this.newProject.text = ''
        },

        deleteProject(id) {
            if (confirm('정말 삭제 함?')) {
                this.$store.dispatch('deleteProject', id)
            }
        }

    }
}
</script>

<style scoped>
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
    background-color: #f0f0f0;
    transform: translateY(-2px);
}

.list-item:not(:last-child) {
    margin-bottom: 10px;
}

.project-info {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.project-text {
    font-weight: bold;
    margin-right: 10px;
}

.project-value {
    color: #666;
}

.delete-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
}

.delete-button:hover {
    background-color: #ff1a1a;
}
</style>