<template>
	<div class="container mt-5 mb-5">
		<h1 class="mb-5">앱 빌드 파일 저장소</h1>
		<b-button @click="goToUpload">업로드 페이지로 이동</b-button>
		<b-button @click="goToDownload">다운로드 페이지로 이동</b-button>
	</div>
</template>

<script>
export default {
	// name: 'IndexPage',

	methods: {
		goToUpload() {
			this.$router.push({ name: 'upload'})
		},

		goToDownload() {
			this.$router.push({ name: 'download'})
		}
	}
}
</script>
