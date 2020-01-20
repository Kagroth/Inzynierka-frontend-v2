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
            placeholder="Podaj nazwe zadania"
          ></v-text-field>
        </v-expandable-x-transition>
      </v-col>
    </v-row>
    <!-- Zadania w toku -->
    <span v-if="userType.name === 'Student'">
      <v-row>        
        <v-col>
          Aktywne zadania:
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(task, index) in activeTasks" :key="`activeTask-${index}`" cols="4">
          <v-card tile>
            <v-card-title @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            <v-card-subtitle>
              Typ: {{ task.taskType.name }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assignedTo[0].name }} <br>
              Rozwiązanie: 
              <span v-if="hasSolution(task)">
                Rozwiazanie zapisane
                <v-icon color="success" small>mdi-check</v-icon>
              </span>
              <span v-else>
                Oczekuje na rozwiązanie
                <v-icon color="info" small>mdi-pencil</v-icon>
              </span>              
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </span>
    <span v-else>      
      <v-row>
        <v-col>
          Zadania w toku:
        </v-col>
      </v-row>
       <v-row>
        <v-col v-for="(task, index) in activeTasks" :key="`activeTask-${index}`" cols="4">
          <v-card tile>
            <v-card-title @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            <v-card-subtitle>
              Typ: {{ task.taskType.name }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assignedTo[0].name }} <br>
              Rozwiazania: 
              <v-rating v-model="task.solution.length" :length="task.assignedTo[0].users.length">
                <template v-slot:item="props">
                  <v-icon small :color="props.isFilled ? 'primary': 'error'">mdi-account</v-icon>
                </template>
              </v-rating>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </span>
    
    <!-- Zadania do oceny -->
    <v-row>
      <v-col>
        Zadania do oceny:
      </v-col>
    </v-row>
    <span v-if="userType.name === 'Student'">
      <v-row>
      <v-col v-for="(task, index) in inactiveTasks" :key="`inactiveTask-${index}`" cols="4">
        <v-card tile>
            <v-card-title @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            <v-card-subtitle>
              Typ: {{ task.taskType.name }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assignedTo[0].name }} <br>
              Rozwiązanie: 
              <span v-if="hasSolution(task)">
                Rozwiazanie zapisane
                <v-icon color="success" small>mdi-check</v-icon>
              </span>
              <span v-else>
                Nie udzielono odpowiedzi
                <v-icon color="warning" small>mdi-exclamation</v-icon>
              </span> 
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>           
    </span>
    <v-row v-else>
      <v-col v-for="(task, index) in inactiveTasks" :key="`inactiveTask-${index}`" cols="4">
        <v-card tile>
            <v-card-title @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            <v-card-subtitle>
              Typ: {{ task.taskType.name }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assignedTo[0].name }} <br>
              Rozwiazania: 
              <v-rating v-model="task.solution.length" :length="task.assignedTo[0].users.length">
                <template v-slot:item="props">
                  <v-icon small :color="props.isFilled ? 'primary': 'error'">mdi-account</v-icon>
                </template>
              </v-rating>
            </v-card-text>
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
    }
  },

  created() {
    this.$store.dispatch("tasks/getAllTasks");
  },

  methods: {
    filterTasksByName(taskArray) {
      if (this.searchForName === "") {
        return taskArray
      }

      return taskArray.filter(task => {
        return task.title.includes(this.searchForName) || task.assignedTo[0].name.includes(this.searchForName)
      })
    },

    showTaskDetails(task) {
      this.$router.push({ name: "TaskDetails", params: { pk: task.pk } });
    },

    hasSolution(taskToCheck) {
      let sol = taskToCheck.solution.find(solution => {
        return solution.user.username === this.$store.state.auth.username;
      });

      return sol !== undefined;
    }
  },

  computed: {
    activeTasks() {
      let activeTasksTemp = this.$store.state.tasks.tasks.filter(task => {
        return task.isActive
      });

      return this.filterTasksByName(activeTasksTemp)
    },

    inactiveTasks() {
      let inactiveTasksTemp = this.$store.state.tasks.tasks.filter(task => {
        let hasSomeUnratedSolutions = function (elem, index, array) {
          return elem.rate === null
        }

        return !task.isActive && task.solution.every(hasSomeUnratedSolutions)
      })

      return this.filterTasksByName(inactiveTasksTemp)
    },

    endedTasks() {
      let inactiveTasksTemp = this.$store.state.tasks.tasks.filter(task => {
        return !task.isActive
      })

      let ratedTasksTemp = inactiveTasksTemp.filter(task => {
        return task.solution.length > 0 && task.solution.every(solution => {
          return !!solution.rate
        })
      })

      return this.filterTasksByName(ratedTasksTemp)
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    },
  }
};
</script>

<style scoped>
</style>
