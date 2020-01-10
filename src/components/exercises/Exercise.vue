<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="6">
                {{ exercise.title }}
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="3" class="text-right"  v-if="userType.name === 'Teacher'">                
                <v-btn small color="success" icon large disabled>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>                                
                <v-btn small color="error" @click="deleteExercise" icon large>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>           
          </v-card-title>
          <v-card-text>
            <v-divider class="mb-3"></v-divider>
            <v-row>
              <v-col cols="12">
                Technologia: 
                <v-icon>mdi-language-{{ exercise.language.name.toLowerCase() }}</v-icon>
                {{ exercise.language.name }}
              </v-col>
              <v-col cols="12">
                Poziom zaawansowania: 
                {{ exercise.level.name }}
              </v-col>
              <v-col class="text--primary">
                <v-divider class="mb-5"></v-divider>
                Tresc: <br>
                {{ exercise.content }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ["pk"],

  created () {
    this.$store.dispatch('tasks/getAllExercises')
  },

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
    },

    userType () {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>
<style scoped>
</style>
