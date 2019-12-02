<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field type="text" v-model="form.username" label="Nazwa użytkownika" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field type="password" v-model="form.password" label="Hasło" requried></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" @click="loginUser">Zaloguj</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },

  validations: {
    form: {
      username: {
        required
      },

      password: {
        required
      }
    }
  },

  methods: {
    loginUser (event) {
      event.preventDefault()

      if (this.$v.$invalid) {
        alert('Nie podano wszystkich danych logowania')
        return
      }

      this.$store
        .dispatch('auth/loginUser', this.form)
        .then(responseData => {
          console.log(responseData.message)
          alert(responseData.message)

          if (responseData.data !== undefined && responseData.data.status === 200) {
            this.$router.push('/')
          }
        })
    }
  }
}
</script>

<style scoped>
</style>
