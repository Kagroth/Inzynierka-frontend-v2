<template>
    <div>
      <v-container>
        <v-row justify="center">
          <v-col cols="6">
            <v-card>
              <v-card-title>
                <v-row>
                  <v-col cols="6">
                     {{ test.title }}
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col col="2" class="text-right">
                    <!--
                    <v-btn color="success" icon large disabled>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    -->
                    <v-btn color="error" @click="deleteTest" icon large>
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <h4>Cwiczenia:</h4>
                <v-list>
                  <v-list-item v-for="(exercise, index) in test.exercises" :key="index">
                    <v-list-item-icon>
                          <v-icon>mdi-language-{{ exercise.language.name.toLowerCase() }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title> {{ exercise.title }} </v-list-item-title>
                          <v-list-item-subtitle>Poziom - {{ exercise.level.name }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>                            
                              <v-btn icon small color="primary" @click="showExercise(exercise.pk)">
                                <v-icon>mdi-magnify</v-icon>
                              </v-btn>
                        </v-list-item-action>
                        <v-dialog v-model="showExerciseModal" width="600">
                            <exercise :pk="exercisePkToShow"></exercise>
                            <v-card tile>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="showExerciseModal=false">Zamknij</v-btn>                            
                              </v-card-actions>
                            </v-card>
                        </v-dialog>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>
<script>

import Exercise from '@/components/exercises/Exercise'

export default {
  components: {
     'exercise': Exercise
  },

  props: ['pk'],

  data() {
    return {
      showExerciseModal: false,
      exercisePkToShow: 0,
    }
  },

  created() {
  },

  methods: {
    deleteTest () {
      let confirmation = confirm('Czy na pewno chcesz usunąć kolokwium?')

      if (confirmation) {
        this.$store.dispatch('tasks/deleteTest', this.test.pk).then(() => {
          this.$router.push('/tasks/exercises')
        })
      } 
    },

    showExercise(pk) {
      this.showExerciseModal = true
      this.exercisePkToShow = pk
    }
  }, 

  computed: {
    test () {
      /*
        jeżeli prop 'pk' jest zbindowany, wtedy wyszukaj test o zbindowanym pk
        w przeciwnym przypadku wyszukaj test po parametrze pk z URL
      */
      let filterParam

      if (this.pk === null || this.pk === undefined) {
        filterParam = this.$route.params.pk
      } else {
        filterParam = this.pk
      }

      let contentTest = this.$store.state.tasks.tests.find(test => test.pk === filterParam)

      return contentTest
    }
  }
}
</script>
<style scoped>

</style>
