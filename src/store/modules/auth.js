import API from '@/api'

const state = {
  token: '',
  refreshToken: '',
  isLogged: '',
  username: '',
  profile: {}
}

const getters = {

}

const mutations = {
  init (state) {
    state.token = localStorage.getItem('token') || ''
    state.refreshToken = localStorage.getItem('refresh') || ''
    state.isLogged = (localStorage.getItem('token') !== null &&
                      localStorage.getItem('token') !== undefined)
    state.username = localStorage.getItem('username') || ''
    state.profile = JSON.parse(localStorage.getItem('profile')) || {}
  },

  setToken (state, payload) {
    console.log('Token: ' + JSON.stringify(payload))
    console.log(`Ustawiam token!`)

    localStorage.setItem('token', payload.token)
    localStorage.setItem('refresh', payload.refresh)
    localStorage.setItem('username', payload.username)

    state.token = localStorage.getItem('token')
    state.refreshToken = localStorage.getItem('refresh')
    state.isLogged = (localStorage.getItem('token') != null)
    state.username = payload.username

    API.setAuthToken(payload.token, payload.refresh)
    console.log(state.username)
  },

  setProfile (state, profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
    state.profile = profile
  },

  logout (state) {
    localStorage.clear()

    for (const stateProp of Object.getOwnPropertyNames(state)) {
      state[stateProp] = null
    }
    
    state.isLogged = false
  }
}

const actions = {
  async createUser (context, registerForm) {
    console.log('Wysylam request rejestracji')

    let registerResponse = {}

    try {
      registerResponse = await API.createUser(registerForm)

      // jest blad, bledny rzut wyjatku po stronie API lub axios
      if (registerResponse.response) {
        return registerResponse.response
      }
      
      return registerResponse      
    } catch (e) {
      console.log(e)
      return {
        message: "Nie udalo sie zarejestrować"
      }
    }
  },

  async loginUser ({ commit, dispatch, state }, loginForm) {
    console.log('Wysylam request logowania')
    let loginResponse = {}
    let userDataResponse = {}

    try {
      loginResponse = await API.loginUser(loginForm)
      console.log(loginResponse)
      commit('setToken', {
        token: loginResponse.data.access,
        refresh: loginResponse.data.refresh,
        username: loginForm.username
      })

      userDataResponse = await API.loadUserData(state.username)

      commit('setProfile', userDataResponse.data)

      return {
        data: loginResponse,
        message: 'Zalogowano'
      }

    } catch (e) {
      return {
        message: 'Niepoprawne dane logowania'
      }
    }
  },

  async obtainResetPasswordLink (context, formWithEmail) {
    let obtainResponse = {}

    try {
      obtainResponse = await API.obtainResetPasswordLink(formWithEmail)
      
      if (obtainResponse.response) {
        return obtainResponse.response
      }

      return obtainResponse
    } catch (e) {
      return {
        message: 'Uzyskanie linku zostalo zakonczone niepowodzeniem'
      }
    }
  },

  async verifyResetPasswordHash(context, hash_string) {
    let verifyHashResponse = {}

    try {
      verifyHashResponse = await API.verifyResetPasswordHash(hash_string)

      if (verifyHashResponse.response) {
        return verifyHashResponse.response
      }

      return verifyHashResponse
    } catch (e) {
      return {
        message: 'Brak mozliwosci zmiany hasla'
      }
    }
  },

  async setNewPassword(context, updateData) {
    let setNewPasswordResponse = {}

    try {
      setNewPasswordResponse = await API.setNewPassword(updateData)

      if (setNewPasswordResponse.response) {
        return setNewPasswordResponse.response
      }

      return setNewPasswordResponse
    } catch (e) {
      return {
        message: "Nastapil blad podczas proby zmiany hasla"
      }
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
