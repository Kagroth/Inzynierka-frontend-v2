import API from '@/api'

const state = {
  users: [],
  groups: []
}

const getters = {

}

const mutations = {
  setUsers (state, users) {
    state.users = users
  },

  setGroups (state, groups) {
    console.log(groups)
    state.groups = groups
  }
}

const actions = {
  async loadAllUsers ({ commit }) {
    console.log('Wyslano request pobrania uzytkownikow')

    let loadUsersResponse = {}

    try {
      loadUsersResponse = await API.loadAllUsers()
      console.log(loadUsersResponse)
      commit('setUsers', loadUsersResponse.data)

      return {
        data: loadUsersResponse,
        message: 'Wszyscy użytkownicy zostali załadowani'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async loadStudents ({ commit }) {
    console.log('Wyslano request pobrania studentow')

    let loadStudentsResponse = {}

    try {
      loadStudentsResponse = await API.loadStudents()
      console.log(loadStudentsResponse)
      commit('setUsers', loadStudentsResponse.data)

      return {
        data: loadStudentsResponse,
        message: 'Wszyscy studenci zostali zaladowani'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async loadGroups ({ commit }, payload) {
    let loadGroupsResponse = {}

    try {
      loadGroupsResponse = await API.loadGroups()
      console.log(loadGroupsResponse)
      commit('setGroups', loadGroupsResponse.data)

      return {
        data: loadGroupsResponse,
        message: 'Pobrano wszystkie grupy'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async createGroup ({ commit }, newGroupData) {
    let createGroupResponse = {}

    try {
      createGroupResponse = await API.createGroup(newGroupData)
      console.log(createGroupResponse)
      return createGroupResponse
    } catch (e) {
      console.log(e)
    }
  },

  async updateGroup ({ commit }, changedGroupData) {
    let updateGroupResponse = {}

    try {
      updateGroupResponse = await API.updateGroup(changedGroupData)
      console.log(updateGroupResponse)

      return {
        data: updateGroupResponse,
        message: 'Grupa zostala zaktualizowana'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async deleteGroup ({ commit }, pk) {
    let deleteGroupResponse = {}
    console.log(pk)
    
    try {
      deleteGroupResponse = await API.deleteGroup(pk)
      console.log(deleteGroupResponse)

      return {
        data: deleteGroupResponse,
        message: 'Grupa zostala usunieta'
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
