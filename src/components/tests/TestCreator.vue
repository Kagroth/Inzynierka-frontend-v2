<template>
  <div>
    <v-content>
      <v-row>
        <v-col>
          <v-text-field type="text" v-model="form.name" label="Nazwa kolokwium" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select :items="exercises" v-model="selectedExercise" label="Cwiczenia" required>
              <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                    {{ data.item.title }}
                </template>
                <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                    {{ data.item.title }}
                </template>
            </v-select>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="addExerciseToTest">Dodaj</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
           <v-btn color="primary" @click="createTest">Utwórz</v-btn>
        </v-col>
      </v-row>
      <v-row v-for="(exercise, index) in form.exercises" :key="index">
        <v-col>
          {{ exercise.title }}
        </v-col>
      </v-row>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
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

    createTest (event) {
      event.preventDefault()

      if (this.form.title === '') {
        alert('Nie podano nazwy kolokwium')
        return
      }

      if (this.form.exercises.length === 0) {
        alert('Nie wybrano zadnych cwiczen')
        return
      }

      console.log(this.form)

      this.$store.dispatch('tasks/createTest', this.form).then(responseData => {
        alert(responseData.message)
      })
    }
  },

  created () {

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
