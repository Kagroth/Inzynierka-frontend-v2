<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn to="/">Strona główna</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!isLogged">
        <v-btn to="/login">Logowanie</v-btn>
        <v-btn to="/register">Rejestracja</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">            
            <v-btn dark v-on="on"> {{ username }} </v-btn>
          </template>
          <v-btn @click="logout">Wyloguj</v-btn>
        </v-menu>        
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  computed: {
    isLogged () {
      return this.$store.state.auth.isLogged
    },

    username () {
      return this.$store.state.auth.username
    }
  },

  methods: {
    logout () {
      this.$store.commit('auth/logout')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
</style>
