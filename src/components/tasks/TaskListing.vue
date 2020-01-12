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
            <v-progress-circular
              color="primary"
              size="48"
              :value="task.solution.length / task.assignedTo[0].users.length * 100"
            >
              {{ task.solution.length }} / {{ task.assignedTo[0].users.length }}
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Zadania do oceny -->
    <v-row>
      <v-col>
        Zadania do oceny:
      </v-col>
    </v-row>
    <v-row>

    </v-row>
    <!-- Zadania ocenione -->
    <v-row>
      <v-col>
        Ocenione:
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
        return !task.isActive
      })

      return this.filterTasksByName(inactiveTasksTemp)
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>

<style scoped>
</style>
