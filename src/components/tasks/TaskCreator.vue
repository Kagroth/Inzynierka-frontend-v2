<template>
  <div>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
    </v-snackbar>
    <v-form>
      <v-container>
        <v-row justify="center">
          <v-col cols="6">
            <v-card>
              <v-card-title>
                Tworzenie zadania
              </v-card-title>
              <v-card-text>
                <v-text-field outlined type="text" v-model="form.title" label="Tytul" required></v-text-field>
                <v-divider class="mb-5"></v-divider>
                <v-row>
                  <v-col>                    
                    <v-select outlined :items="taskTypes" v-model="form.taskType" label="Typ">
                      
                    </v-select>                    
                  </v-col>
                  <v-col>
                    <v-select outlined :items="allowed_solution_types" v-model="form.solutionType" label="Sposób rozwiązania zadania">
                      <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                        {{ data.item.name }}
                      </template>
                      <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                        {{ data.item.name }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select outlined :items="exercises" v-model="form.exercise" label="Zadanie">
                      <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                        {{ data.item.title }}
                      </template>
                      <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                        {{ data.item.title }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select outlined :items="groups" v-model="form.group" label="Przypisz do">
                      <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                        {{ data.item.name }}
                      </template>
                      <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                        {{ data.item.name }}
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" class="mr-2" :loading="loading" @click="createTask">Utwórz</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
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

      taskTypes: ['Exercise', 'Test'],
      solutionTypes: [],
      selectedGroup: '',
      form: {
        title: '',
        taskType: '',
        solutionType: {},
        exercise: '',
        group: {}
      }
    }
  },

  methods: {
    createTask (event) {
      event.preventDefault()

      for (let field in this.form) {
        if (this.form[field] === '') {
            this.snackbar.message = "Nie podano wszystkich danych"
            this.snackbar.color ="warning"
            this.snackbar.show = true
            return
        }
      }
      
      this.loading = true

      console.log(this.form)

      this.$store.dispatch('tasks/createTask', this.form).then(response => {
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
            this.form = {
              title: '',
              taskType: '',
              solutionType: {},
              exercise: '',
              group: {}
            }
          }
      })
    }
  },

  computed: {
    exercises () {
      if (this.form.taskType === 'Exercise') return this.$store.state.tasks.exercises
      else return this.$store.state.tasks.tests
    },

    groups () {
      return this.$store.state.users.groups
    },

    allowed_solution_types () {
      if (this.form.taskType === 'Test') {
        return this.solutionTypes.filter(solType => solType.name === 'Editor')
      }

      return this.solutionTypes
    }
  },

  created () {
    this.$store
      .dispatch('users/loadStudents')
      .then(() => {
        console.log('Pobrano userow')
      })
      .catch(() => {
        console.log('Nie udalo sie pobrac userow')
      })

    this.$store
      .dispatch('users/loadGroups')
      .then(() => {
        console.log('Pobrano grupy')
      })
      .catch(() => {
        console.log('Nie udalo sie pobrac grup')
      })

    this.$store
      .dispatch('tasks/getAllExercises')
      .then(() => {
        console.log('Pobrano cwiczenia')
      })
      .catch(() => {
        console.log('Nie udalo sie pobrac cwiczen')
      })
    
    this.$store
      .dispatch('tasks/getSolutionTypesAll')
      .then(data => {
        console.log(data)
        this.solutionTypes = data
      })
      .catch(() => {
        console.log("Nie udalo sie pobrac rodzajow rozwiazan")
      })
  }
}
</script>

<style scoped>
