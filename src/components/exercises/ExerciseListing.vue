<template>
  <div>
    <v-row>
      <v-col>
        <v-btn icon @click="showSearchField = !showSearchField" class="d-inline">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
          <v-text-field
            v-if="showSearchField"
            v-model="searchForName"
            style="width: 30%; position: absolute; "
            class="d-inline-flex ma-0 pa-0"
            placeholder="Podaj nazwe cwiczenia lub jezyk programowania"
          ></v-text-field>
      </v-col>
    </v-row>
    <v-row  mt-4>
      <v-col v-for="(exercise, index) in exercises" :key="index" cols="4">
        <v-card>
          <v-hover v-slot:default="{ hover }">
            <v-card-title :class="hover ? 'title-link' : ''" @click="showExerciseDetails(exercise)">
              {{ exercise.title }}
            </v-card-title>
          </v-hover>
          <v-card-subtitle>
            Technologia:
            <v-icon>mdi-language-{{ exercise.language.name.toLowerCase() }}</v-icon>
            {{ exercise.language.name }}
            
            <br>

            Poziom zaawansowania:
            {{ exercise.level.name }}
          </v-card-subtitle>
        </v-card>
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
.v-card {
  cursor: default;
}

.title-link {
  cursor: pointer;
  color: lightblue;
}
</style>
