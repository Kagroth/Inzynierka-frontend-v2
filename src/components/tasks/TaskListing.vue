<template>
  <div>
      <v-row v-for="(task, index) in tasks" :key="index">
        <v-col>
          <h3>{{ task.title }}</h3>
        </v-col>
        <v-col>
          <v-btn @click="showTaskDetails(task)" color="primary" small>Szczegóły</v-btn>
        </v-col>
      </v-row>
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
