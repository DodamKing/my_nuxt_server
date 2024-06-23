<template>
    <b-container>
        <h1 class="mt-5 mb-5">파일 업로드</h1>
        <b-button variant="success" class="mb-3" @click="$router.push({ name: 'index' })">홈</b-button>
        <b-button @click="goToDownload" class="mb-3">다운로드 페이지로 이동</b-button>
        <b-form-select :options="projects" v-model="project" @change="fetchFileList" class="mb-3"></b-form-select>
        <b-card v-if="fileList.length > 0" class="mb-3">
            <h6>파일</h6>
            <div v-for="file in fileList" :key="file">{{ file }}</div>
        </b-card>
        <b-form-input v-model="version" class="mb-3" placeholder="버전 입력"></b-form-input>
        <b-file type="file" @change="handleFileChange" class="mb-3"></b-file>
        <div class="d-flex justify-content-end">
            <b-button variant="primary" @click="handleUpload">파일 업로드</b-button>
        </div>
    </b-container>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            project: '',
            file: null,
            projects: [
                { value: '', text: '프로젝트 선택' },
                { value: 'stock-master', text: '자산관리' },
                { value: 'customer', text: '고객관리' },
            ],
            version: '',
            fileList: [],
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
        
            const res = await axios.post('/api/file-server/upload', formData)
            const data = res.data
            if (!data.errorr) {
                this.fileList = data
            }
        },

        async fetchFileList() {
            if (this.project) {
                const res = await this.$axios.$get(`/api/file-server/files/${this.project}`)
                this.fileList = res
            }
        },

        goToDownload() {
            this.$router.push({ name: 'download'})
        }
    }
}
</script>