<template>
  <div>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
    </v-snackbar>
    <v-form>
      <v-content>
        <v-row justify="center">
          <v-col cols="8">
            <v-card>
              <v-card-title>Tworzenie kolokwium</v-card-title>
              <v-card-text>
                <v-text-field outlined type="text" v-model="form.title" label="Nazwa kolokwium" required></v-text-field>
                <v-divid></v-divid>
                <v-row>
                  <v-col cols="4">
                    <v-select outlined :items="exercises" v-model="selectedExercise" label="Wybierz cwiczenie" required>
                      <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                            {{ data.item.title }}
                        </template>
                        <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                            {{ data.item.title }}
                        </template>
                    </v-select>
                  </v-col>
                  <v-col cols="1" class="text-center">
                     <v-btn color="primary" @click="addExerciseToTest" icon large>
                       <v-icon>mdi-plus-circle</v-icon>
                     </v-btn>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <h4 class="text-center">Wybrane cwiczenia:</h4>
                    <v-list>
                      <v-list-item v-for="(exercise, index) in form.exercises" :key="index">
                        <v-list-item-icon>
                          <v-icon>mdi-language-{{ exercise.language.name.toLowerCase() }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title> {{ exercise.title }} </v-list-item-title>
                          <v-list-item-subtitle>Poziom - {{ exercise.level.name }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon small color="error" @click="removeExerciseFromTest(index)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="mt-5">
                <v-spacer></v-spacer>
                <v-btn color="success" class="mr-2" @click="createTest" :loading="loading">Utwórz</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-content>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      snackbar: {
        show: false,
        color: "",
        message: ""
      },

      selectedExercise: {},
      form: {
        title: '',
        exercises: []
      }
    }
  },

  methods: {
    addExerciseToTest () {
      if (this.selectedExercise === null) {
        return
      }

      if (this.form.exercises.includes(this.selectedExercise)) {
        return
      }

      this.form.exercises.push(this.selectedExercise)
    },

    removeExerciseFromTest (index) {
      this.form.exercises = this.form.exercises.filter(exercise => {
        return exercise !== this.form.exercises[index]
      })
    },

    createTest (event) {
      event.preventDefault()

      if (this.form.title === '') {
        this.snackbar.message = "Nie podano nazwy kolokwium"
        this.snackbar.color ="warning"
        this.snackbar.show = true
        return
      }

      if (this.form.exercises.length === 0) {
        this.snackbar.message = "Nie wybrano zadnych cwiczen"
        this.snackbar.color ="warning"
        this.snackbar.show = true
        return
      }

      this.loading = true
      
      console.log(this.form)

      this.$store.dispatch('tasks/createTest', this.form).then(response => {
        this.loading = false

        let color = ""

        if (response.status === 200) {
          color = "success"
        }
        else {
          color = "error"
        }

        this.snackbar.message = response.data.message
        this.snackbar.color = color
        this.snackbar.show = true
          
        if (response.status === 200) {
          this.selectedExercise = ""
          this.form.title = ""
          this.form.exercises = []
        }
      })
    }
  },

  created () {
    this.$store.dispatch("tasks/getAllExercises");
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
