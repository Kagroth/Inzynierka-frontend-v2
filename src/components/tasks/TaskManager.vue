
<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-btn to="/tasks/tasks">Zadania</v-btn>
        </v-col>
        <v-col cols="2" v-if="userType.name === 'Teacher'">
          <v-btn to="/tasks/exercises">Ćwiczenia</v-btn>
        </v-col>
        <v-col cols v-if="userType.name === 'Teacher'">
          <v-btn to="/tasks/tests">Kolokwia</v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-col cols="12">
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>

<style scoped>
</style>
