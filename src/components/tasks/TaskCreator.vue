<template>
  <div>
    <v-content>
      <v-row>
        <v-col>
          <v-text-field type="text" v-model="form.title" label="Tytul" required></v-text-field>
        </v-col>        
      </v-row>
      <v-row>
        <v-col>
          <v-select :items="taskTypes" v-model="form.taskType" label="Typ">

          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select :items="allowed_solution_types" v-model="form.solutionType" label="Sposób rozwiązania zadania">
            <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
              <v-icon>home</v-icon> {{ data.item.name }}
            </template>
            <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
              {{ data.item.name }}
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
           <v-select :items="exercises" v-model="form.exercise" label="Zadanie">
            <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
              {{ data.item.title }}
            </template>
            <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
              {{ data.item.title }}
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select :items="groups" v-model="form.group" label="Przypisz do">
            <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
              {{ data.item.name }}
            </template>
            <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
              {{ data.item.name }}
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" @click="createTask">Utwórz zadanie</v-btn>
        </v-col>
      </v-row>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
          alert('Nie podano wszystkich danych')
          return
        }
      }

      console.log(this.form)

      this.$store.dispatch('tasks/createTask', this.form).then(responseData => {
        alert(responseData.message)
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
