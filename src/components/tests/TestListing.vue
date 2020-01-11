<template>
  <div>
    <v-row v-for="(test, index) in tests" :key="index">
      <v-col>
        <h3>{{ test.title }}</h3>
      </v-col>
      <v-col>
        <v-btn @click="showTestDetails(test)" color="primary" small>Szczegóły</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("tasks/getAllTests");
  },

  methods: {
    showTestDetails(test) {
      this.$router.push({
        name: "TestDetails",
        params: { pk: test.pk }
      });
    }
  },

  computed: {
    tests() {
      return this.$store.state.tasks.tests;
    }
  }
};
</script>

<style scoped>
</style>
