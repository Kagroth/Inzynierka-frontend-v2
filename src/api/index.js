import axios from 'axios'

const APIInstance = axios.create({
  baseURL: 'http://13.53.79.179:8000/'
})

let token = ''
let refreshToken = ''

export default {
  APIInstance,
  token,
  refreshToken,

  setAuthToken (token, refreshToken = null) {
    this.token = token

    if (refreshToken !== null) {
      this.refreshToken = refreshToken
      console.log(refreshToken)
    }

    this.APIInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  sendRequest (url, method, data = null) {
    let config = {}
  
    if (data === null) {
      config = {
        url: url,
        method: method
      }
    } else {
      config = {
        url: url,
        method: method,
        data: data
      }
    }

    return this.APIInstance.request(config)
      .then(response => {
        return response
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.log('Brak autoryzacji')
          console.log(this.refreshToken)

          return this.APIInstance.request({
            url: 'token/refresh/',
            method: 'POST',
            data: {
              refresh: localStorage.getItem('refresh')
            }
          })
            .then(success => {
              console.log(success)
              localStorage.setItem('token', success.data.access)
              this.setAuthToken(success.data.access)

              return this.APIInstance.request(config)
            })
            .catch(error => {
              console.log(error)
              console.log(error.response)
              return error
            })
        }
        return error
      })
  },

  loginUser (loginData) {
    return this.sendRequest('token/', 'post', loginData)
  },

  createUser (registerData) {
    return this.sendRequest('users/', 'post', registerData)
  },

  loadUserData (username) {
    return this.sendRequest(`profile/${username}`, 'get')
  },

  loadAllUsers () {
    return this.sendRequest('users/', 'get')
  },

  loadStudents () {
    return this.sendRequest('students/', 'get')
  },

  loadGroups () {
    return this.sendRequest('groups/', 'get')
  },

  createGroup (newGroupData) {
    return this.sendRequest('groups/', 'post', newGroupData)
  },

  updateGroup (changedGroupData) {
    return this.sendRequest('groups/' + changedGroupData.pk + '/', 'put', changedGroupData)
  },

  deleteGroup (primaryKey) {
    return this.sendRequest('groups/' + primaryKey + '/', 'delete')
  },

  loadAllExercises () {
    return this.sendRequest('exercises/', 'get')
  },

  loadAllTests () {
    return this.sendRequest('tests/', 'get')
  },

  loadAllTasks () {
    return this.sendRequest('tasks/', 'get')
  },

  createExercise (newExerciseData) {
    return this.sendRequest('exercises/', 'post', newExerciseData)
  },

  deleteExercise (exerciseToDeletePk) {
    return this.sendRequest('exercises/' + exerciseToDeletePk, 'delete')
  },

  createTest (newTestData) {
    return this.sendRequest('tests/', 'post', newTestData)
  },

  deleteTest (testToDeletePk) {
    return this.sendRequest('tests/' + testToDeletePk, 'delete')
  },

  createTask (newTaskData) {
    return this.sendRequest('tasks/', 'post', newTaskData)
  },

  loadLanguagesAll () {
    return this.sendRequest('languages/', 'get')
  },

  loadLevelsAll () {
    return this.sendRequest('levels/', 'get')
  },

  createSolution (solutionData) {
    let config = {
      url: 'solutions/',
      method: 'post',
      data: solutionData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    return this.APIInstance.request(config)
  },

  getAllSolutions () {
    return this.sendRequest('solutions/', 'get')
  },

  getSolution (pk) {
    return this.sendRequest('solutions/' + pk, 'get')
  },

  getSolutionTypes () {
    return this.sendRequest('solution_types/', 'get')
  },

  closeTask (updateData) {
    return this.sendRequest('tasks/' + updateData.pk + '/', 'put', updateData)
  },

  rateSolution (updateData) {
    return this.sendRequest('solutions/' + updateData.pk + '/', 'put', updateData)
  },

  getUserData (pk) {
    return this.sendRequest('users/' + pk + '/', 'get')
  },

  getTeachersStudents () {
    return this.sendRequest('my_students/', 'get')
  },

  obtainResetPasswordLink(formWithEmail) {
    return this.sendRequest('reset_password/', 'post', formWithEmail)
  },

  verifyResetPasswordHash(hash_string) {
    return this.sendRequest('reset_password/' + hash_string, 'get')
  },

  setNewPassword(updateData) {
    return this.sendRequest('reset_password/' + updateData.hash_string, 'put', updateData)
  },

  testRegistrationHashView (data) {
    return this.sendRequest('reset_password/', 'get')
  }
}
