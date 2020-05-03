import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import users from './modules/users'
import tasks from './modules/tasks'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    users,
    tasks
  },

  actions: {
    async loadTasksWithExercisesAndTests ({dispatch}) {

      try {
        let [exercisesResponse, testsResponse, tasksResponse] = await Promise.all([dispatch('tasks/getAllExercises'), dispatch('tasks/getAllTests'), dispatch('tasks/getAllTasks')])
        console.log(exercisesResponse)
        console.log(testsResponse)
        console.log(tasksResponse)

      }
      catch (e) {
        console.log(e)
        return e
      }
    }
  }
})
