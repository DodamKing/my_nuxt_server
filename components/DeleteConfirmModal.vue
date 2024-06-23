<template>
    <b-modal id="confirm-modal" ref="modal" hide-footer title="확인">
        <div class="d-block text-center">정말 삭제하시겠습니까?</div>
        <div class="d-flex justify-content-end">
            <b-button class="mt-3" variant="danger" @click="confirm">확인</b-button>
            <b-button class="mt-3 ml-2" @click="cancel">취소</b-button>
        </div>
    </b-modal>
</template>

<script>
    export default {
        methods: {
            show() {
                this.$refs.modal.show()
            },

            confirm() {
                this.$emit('confirm')
                this.$refs.modal.hide()
            },

            cancel() {
                this.$refs.modal.hide()
            }
        }
    }
</script>