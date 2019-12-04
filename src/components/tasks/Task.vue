<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h3>{{ task.title }}</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>Przypisane do:</v-col>
      </v-row>
      <v-row v-for="(group, index) in task.assignedTo" :key="index">
        <v-col>{{ group.name }}</v-col>
      </v-row>
      <v-row v-if="task.taskType.name == 'Exercise'">
        <v-col>
          <exercise :pk="task.exercise.pk"></exercise>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-expansion-panels multiple="true">
            <v-expansion-panel v-for="(exercise, index) in task.test.exercises" :key="index">
              <v-expansion-panel-header>{{ exercise.title }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                {{ exercise.content }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Exercise from "@/components/exercises/Exercise";

export default {
  components: {
    exercise: Exercise
  },

  computed: {
    task() {
      let contextTask = this.$store.state.tasks.tasks.filter(
        task => task.pk === this.$route.params.pk
      );
      // filter zwraca tablicę, dlatego trzeba zwrócić pierwszy obiekt explicit
      return contextTask[0];
    }
  }
};
</script>
<style scoped>
</style>
