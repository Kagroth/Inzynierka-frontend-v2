
<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row v-if="currentRoute.name === 'TaskListing'">
          <v-col>Moje zadania</v-col>
          <v-spacer></v-spacer>
          <v-col v-if="userType.name === 'Teacher'">
            <v-btn color="success" :to="{name: 'TaskCreator'}">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <router-view></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      solutions: []
    }
  },

  created() {
    this.$store.dispatch('tasks/getAllTasks');
    this.$store.dispatch('tasks/getAllExercises');
    this.$store.dispatch('tasks/getAllSolutions').then(response => {
      this.solutions = response.data
    });

    if (this.$route.name === 'MyTasks') {
      this.$router.push({ name: "TaskListing" });
    }
  },

  watch: {
    $route(to, from) {
      if (to.name === "MyTasks") {
        this.$router.push({ name: "TaskListing" });
      }
    }
  },

  computed: {
    currentRoute() {
      return this.$route;
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>

<style scoped>
</style>
