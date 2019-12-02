<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <h3>{{ exercise.title }}</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1">
        <v-btn small color="error" @click="deleteExercise">Usun</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Technologia - {{ exercise.language.name }}</v-col>
    </v-row>
    <v-row>
      <v-col>Poziom zaawansowania - {{ exercise.level.name }}</v-col>
    </v-row>
    <v-row>
      <v-col> Treść: {{ exercise.content }}</v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ["pk"],

  methods: {
    deleteExercise() {
      let confirmation = confirm('Czy na pewno chcesz usunąć ćwiczenie?')

      if (confirmation) {
         this.$store.dispatch("tasks/deleteExercise", this.exercise.pk).then(() => {
          this.$router.push('/tasks/exercises')
        })
      }    
    }
  },

  computed: {
    exercise() {
      /*
        jeżeli prop 'pk' jest zbindowany, wtedy wyszukaj exercise o zbindowanym pk
        w przeciwnym przypadku wyszukaj exercise po parametrze pk z URL
      */
      let filterParam;

      if (this.pk === null || this.pk === undefined) {
        filterParam = this.$route.params.pk;
      } else {
        filterParam = this.pk;
      }

      let contextExercise = this.$store.state.tasks.exercises.find(
        exercise => exercise.pk === filterParam
      );

      return contextExercise;
    }
  }
};
</script>
<style scoped>
</style>
