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
            <v-hover v-slot:default="{ hover }">
              <v-card-title :class="hover ? 'title-link' : ''" @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            </v-hover>
            <v-card-subtitle>
              Typ: {{ polishTaskTypesNames[task.taskType.name] }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assigned_to.name }} <br>
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
            <v-hover v-slot:default="{ hover }">
              <v-card-title :class="hover ? 'title-link' : ''" @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            </v-hover>
            <v-card-subtitle>
              Typ: {{ polishTaskTypesNames[task.taskType.name] }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assigned_to.name }} <br>
              Rozwiazania: 
              {{ task.solution.length }} / {{ task.assigned_to.users.length }}  <v-icon small color="primary">mdi-account</v-icon>
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
            <v-hover v-slot:default="{ hover }">
              <v-card-title :class="hover ? 'title-link' : ''" @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            </v-hover>
            <v-card-subtitle>
              Typ: {{ polishTaskTypesNames[task.taskType.name] }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assigned_to.name }} <br>
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
            <v-hover v-slot:default="{ hover }">
              <v-card-title :class="hover ? 'title-link' : ''" @click="showTaskDetails(task)" link> {{ task.title }}</v-card-title>
            </v-hover>
            <v-card-subtitle>
              Typ: {{ polishTaskTypesNames[task.taskType.name] }} <br>
              Rozwiązanie: {{ task.solutionType.name }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              Przypisane do: {{ task.assigned_to.name }} <br>
              Rozwiazania: 
              {{ task.solution.length }} / {{ task.assigned_to.users.length }}  <v-icon small color="primary">mdi-account</v-icon>
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
      polishTaskTypesNames: {},
      showSearchField: false,
      searchForName: ""
    }
  },

  created() {
    this.$store.dispatch("tasks/getAllTasks");
    this.polishTaskTypesNames['Exercise'] = 'Ćwiczenie';
    this.polishTaskTypesNames['Test'] = 'Kolokwium';
  },

  methods: {
    filterTasksByName(taskArray) {
      if (this.searchForName === "") {
        return taskArray
      }

      return taskArray.filter(task => {
        return task.title.includes(this.searchForName) || task.assigned_to.name.includes(this.searchForName)
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
        return !task.isActive && !task.isRated
      })

      return this.filterTasksByName(inactiveTasksTemp)
    },

    endedTasks() {
      let inactiveTasksTemp = this.$store.state.tasks.tasks.filter(task => {
        return !task.isActive && task.isRated
      })

      return this.filterTasksByName(inactiveTasksTemp)
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    },
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
