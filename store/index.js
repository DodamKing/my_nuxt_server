export const state = () => ({
    projects: null
})

export const mutations = {
    setProject(state, data) {
        state.projects = data
    },

}

export const actions = {
    async fetchProject({ commit }) {
        const data = await fetch('/projects.json').then(res => res.json())
        commit('setProject', data)
    },

    async addNewProject({ commit }, newProject) {
        try {
            const { resultCode, projects } = await this.$axios.$post('/api/file-server/add-project', newProject)
            if (resultCode) commit('setProject', projects)
            else alert('실패')
        } catch (err) {
            console.error(err)
        }
    },

    async deleteProject({ commit }, id) {
        try {
            const { projects } = await this.$axios.$delete('/api/file-server/project/' + id)
            commit('setProject', projects)
        } catch (err) {
            console.error(err)
        }
    }
}