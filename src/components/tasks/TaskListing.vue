<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2>Moje zadania</h2>
        </v-col>
        <v-col v-if="userType.name === 'Teacher'">
          <v-btn to="/tasks/newTask" color="success" small>Utwórz zadanie</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row v-for="(task, index) in tasks" :key="index">
        <v-col>
          <h3>{{ task.title }}</h3>
        </v-col>
        <v-col>
          <v-btn @click="showTaskDetails(task)" color="primary" small>Szczegóły</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("tasks/getAllTasks");
  },

  methods: {
    showTaskDetails(task) {
      this.$router.push({ name: "TaskDetails", params: { pk: task.pk } });
    }
  },

  computed: {
    tasks() {
      return this.$store.state.tasks.tasks;
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>

<style scoped>
</style>
