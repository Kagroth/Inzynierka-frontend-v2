<template>
  <div>
    <v-toolbar>
      <v-toolbar-items>
        <v-btn to="/">Strona główna</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!isLogged">
        <v-btn to="/login">Logowanie</v-btn>
        <v-btn to="/register">Rejestracja</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-btn to="/tasks">Zarządzanie zadaniami</v-btn>
        <v-btn to="/groups/groups">Grupy</v-btn>
        <v-btn @click="logout">Wyloguj</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  computed: {
    isLogged () {
      return this.$store.state.auth.isLogged
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
