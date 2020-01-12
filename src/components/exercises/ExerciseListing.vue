<template>
  <div>
    <v-row>
      <v-col>
        <v-btn icon @click="showSearchField = !showSearchField" class="d-inline">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-expandable-x-transition>
          <v-text-field
            v-if="showSearchField"
            v-model="searchForName"
            style="width: 20%; position: absolute; "
            class="d-inline-flex ma-0 pa-0"
            placeholder="Podaj nazwe cwiczenia lub jezyk programowani"
          ></v-text-field>
        </v-expandable-x-transition>
      </v-col>
    </v-row>
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
  data() {
    return {
      showSearchField: false,
      searchForName: ""
    };
  },

  created() {
    this.$store.dispatch("tasks/getAllExercises");
  },

  methods: {
    filterExercises(exerciseArray) {
      if (this.searchForName === "") {
        return exerciseArray;
      }

      return exerciseArray.filter(exercise => {
        return (
          exercise.title.includes(this.searchForName) ||
          exercise.language.name.includes(this.searchForName)
        );
      });
    },

    showExerciseDetails(exercise) {
      this.$router.push({
        name: "ExerciseDetails",
        params: { pk: exercise.pk }
      });
    }
  },

  computed: {
    exercises() {
      return this.filterExercises(this.$store.state.tasks.exercises);
    }
  }
};
</script>

<style scoped>
</style>
