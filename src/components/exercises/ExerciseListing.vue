<template>
  <div>
      <v-row v-for="(exercise, index) in exercises" :key="index" mt-4>
        <v-col cols="6">
          <h3>{{ exercise.title }}</h3>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-btn @click="showExerciseDetails(exercise)" color="primary" small>Szczegóły</v-btn>
        </v-col>
      </v-row>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('tasks/getAllExercises')
  },

  methods: {
    showExerciseDetails (exercise) {
      this.$router.push({
        name: 'ExerciseDetails',
        params: { pk: exercise.pk }
      })
    }
  },

  computed: {
    exercises () {
      return this.$store.state.tasks.exercises
    }
  }
}
</script>

<style scoped>
</style>
