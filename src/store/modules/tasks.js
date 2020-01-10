// import axios from 'axios'
import API from '@/api'

const state = {
  exercises: [],
  tests: [],
  tasks: []
}

const getters = {

}

const mutations = {
  setExercises (state, exercises) {
    console.log(exercises)
    state.exercises = exercises
  },

  setTests (state, tests) {
    console.log(tests)
    state.tests = tests
  },

  setTasks (state, tasks) {
    console.log(tasks)
    state.tasks = tasks
  }
}

const actions = {
  async getLanguagesAll () {
    console.log('Pobieram jezyki')

    let getLanguagesAllResponse = {}

    try {
      getLanguagesAllResponse = await API.loadLanguagesAll()
      console.log(getLanguagesAllResponse.data)
      return getLanguagesAllResponse.data
    } catch (e) {
      console.log(e)
    }
  },

  async getLevelsAll () {
    console.log('Pobieram poziomy zaawansowania')

    let getLevelsAllResponse = {}

    try {
      getLevelsAllResponse = await API.loadLevelsAll()
      console.log(getLevelsAllResponse.data)
      
      return getLevelsAllResponse.data
    } catch (e) {
      console.log(e)
    }
  },

  async getSolutionTypesAll () {
    let getSolutionTypesAllResponse = {}

    try {
      getSolutionTypesAllResponse = await API.getSolutionTypes()
      console.log(getSolutionTypesAllResponse)

      return getSolutionTypesAllResponse.data
    } catch (e) {
      console.log(e)
    }
  },

  async getAllExercises ({ commit }) {
    console.log('Wysylam zadanie pobrania wszystkich ćwiczeń')

    let getAllExercisesResponse = {}

    try {
      getAllExercisesResponse = await API.loadAllExercises()
      console.log(getAllExercisesResponse)
      commit('setExercises', getAllExercisesResponse.data)

      return {
        data: getAllExercisesResponse,
        message: 'Pobrano wszystkie cwiczenia'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async getAllTests ({ commit }) {
    console.log('Wysylam zadanie pobrania wszystkich kolokwiow')

    let getAllTestsResponse = {}

    try {
      getAllTestsResponse = await API.loadAllTests()
      console.log(getAllTestsResponse)
      commit('setTests', getAllTestsResponse.data)

      return {
        data: getAllTestsResponse,
        message: 'Pobrano wszystkie kolokwia'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async getAllTasks ({ commit }) {
    console.log('Wysylam zadanie pobrania wszystkich zadan')

    let getAllTasksResponse = {}

    try {
      getAllTasksResponse = await API.loadAllTasks()
      console.log(getAllTasksResponse)
      commit('setTasks', getAllTasksResponse.data)

      return {
        data: getAllTasksResponse,
        message: 'Pobrano wszystkie zadania'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async createExercise ({ commit }, newExerciseData) {
    console.log('Wysylam zadanie utworzenia nowego cwiczenia')

    let createExerciseResponse = {}

    try {
      createExerciseResponse = await API.createExercise(newExerciseData)
      console.log(createExerciseResponse)

      if (createExerciseResponse.response) {
        return createExerciseResponse.response
      }
      
      return createExerciseResponse
    
    } catch (e) {
      console.log(e)
      return {
        message: "Nie udalo sie utworzyc cwiczenia"
      }
    }
  },

  async deleteExercise ({ commit }, exerciseToDeletePk) {
    console.log('Wysylam request usuniecia cwiczenia')

    let deleteExerciseResponse = {}

    try {
      deleteExerciseResponse = await API.deleteExercise(exerciseToDeletePk)
      console.log(deleteExerciseResponse)

      return {
        data: deleteExerciseResponse,
        message: 'Usunieto cwiczenie'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async createTest ({ commit }, newTestData) {
    console.log('Wysylam zadanie utworzenia kolokwium')

    let createTestResponse = {}

    try {
      createTestResponse = await API.createTest(newTestData)
      console.log(createTestResponse)

      if (createTestResponse.response) {
        return createTestResponse.response
      }
      
      return createTestResponse
      
    } catch (e) {
      console.log(e)

      return {
        message: 'Nie udalo sie utworzyc testu'
      }
    }
  },

  async deleteTest ({ commit }, testToDeletePk) {
    console.log('Wysylam request usuniecia kolokwium')

    let deleteTestResponse = {}

    try {
      deleteTestResponse = await API.deleteTest(testToDeletePk)
      console.log(deleteTestResponse)

      return {
        data: deleteTestResponse,
        message: "Usunieto kolokwium"
      }
    } catch (e) {
      console.log(e)
    }
  },

  async createTask ({ commit }, newTaskData) {
    console.log('Wysylam zadanie utworzenia nowego zadania')

    let createTaskResponse = {}

    try {
      createTaskResponse = await API.createTask(newTaskData)
      console.log(createTaskResponse)

      return {
        data: createTaskResponse,
        message: "Zadanie zostalo utworzone"
      }
    } catch (e) {
      console.log(e)
    }
  },

  async sendSolution({ commit }, solutionData) {
    let sendSolutionResponse = {}

    try {
      sendSolutionResponse = await API.createSolution(solutionData)
      console.log(sendSolutionResponse)
      
      return sendSolutionResponse
    } catch (e) {
      console.log(e)
    }
  },

  async getAllSolutions({ commit }) {
    let getAllSolutionResponse = {}

    try {
      getAllSolutionResponse = await API.getAllSolutions()
      console.log(getAllSolutionResponse)

      return {
        data: getAllSolutionResponse,
        message: 'Pobrano wszystkie rozwiazania'
      }
    } catch (e) {
      console.log(e)
    }
  },

  async getSolution({commit}, pk) {
    let getSolutionResponse = {}

    try {
      getSolutionResponse = await API.getSolution(pk)
      console.log(getSolutionResponse)

      return {
        data: getSolutionResponse,
        message: 'Pobrano roziwazanie'
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
