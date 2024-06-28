<template>
    <b-container>
        <h1 class="mt-5 mb-5">파일 업로드</h1>
        <b-button variant="success" class="mb-3" @click="$router.push({ name: 'index' })">홈</b-button>
        <b-button @click="goToDownload" class="mb-3">다운로드 페이지로 이동</b-button>
        <b-button variant="primary" @click="showModal = true" class="mb-3">프로젝트 추가</b-button>
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
            this.$router.push({ name: 'download'})
        },

        updateProjects(projects) {
            this.$store.dispatch('updateProjects', { projects })
        },

        addProject() {
            if (this.newProject.text && this.newProject.value) {
                const newProject = {
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
        }

    }
}
</script>