<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h3>{{ task.title }}</h3>
        </v-col>
        <v-col v-if="userType.name === 'Student' && task.taskType.name === 'Exercise'">
          <!--
          <span v-if="hasSolution">
            <v-btn color="primary" @click="showSolution">Podglad odpowiedzi</v-btn>
          </span>-->
          <span>
            <v-dialog v-model="fileSendDialog" width="600">
              <template v-slot:activator="{ on }">
                <v-btn color="success" dark v-on="on">Przeslij odpowiedz</v-btn>
              </template>
              <v-card v-if="testsResultsModal">
                <v-card-title>
                  Twoje rozwiązanie zostało przetestowane i zapisane
                </v-card-title>
              
                <v-card-text>
                  <h3> Wyniki testów: </h3>
                  <v-list>
                    <v-list-item v-for="(singleResult, index) in this.testResults" :key="index">
                      <v-list-item-content>
                        {{ singleResult }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="hideResultDialog">Ok</v-btn>
                </v-card-actions>
              </v-card>
              <v-card v-else>
                <v-card-title class="headline grey lighten-2" primary-title>Przesyłanie odpowiedzi</v-card-title>

                <v-card-text>
                  <v-file-input v-model="file" :accept="task.exercise.language.allowed_extension" label="Wybierz plik" @click="onFileChange"></v-file-input>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :loading="sendSolutionLoading" text @click="sendFileSolution">Wyślij</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>Przypisane do:</v-col>
      </v-row>
      <v-row v-for="(group, index) in task.assignedTo" :key="index">
        <v-col>{{ group.name }}</v-col>
      </v-row>
      <v-row v-if="task.taskType.name == 'Exercise'">
        <v-col>
          <exercise :pk="task.exercise.pk"></exercise>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-expansion-panels multiple="true">
            <v-expansion-panel v-for="(exercise, index) in task.test.exercises" :key="index">
              <v-expansion-panel-header>{{ exercise.title }}</v-expansion-panel-header>
              <v-expansion-panel-content>{{ exercise.content }}</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      
      <span v-if="userType.name === 'Teacher'">
        <v-row>
          <v-col>
            Rozwiązania nadeslali:
          </v-col>
        </v-row>
        <v-row v-for="(solution, index) in task.solution" :key="index">
          <v-col>
             {{ solution.user.username }}
          </v-col>         
          <v-col>
            <v-btn color="primary" small @click="showSolutionAsTeacher(solution.pk)">Podglad</v-btn>
          </v-col>
        </v-row>
      </span>
    </v-container>
  </div>
</template>
<script>
import Exercise from "@/components/exercises/Exercise";

export default {
  components: {
    exercise: Exercise
  },

  data() {
    return {
      sendSolutionLoading: false,
      testsResultsModal: false,
      testResults: "",
      fileSendDialog: false,
      file: null,
      solution: null
    };
  },

  created() {},

  methods: {
    onFileChange(event) {
      console.log(this.file);
    },

    sendFileSolution(event) {
      if (this.file === undefined || this.file === null) {
        // komunikat o nie wybraniu pliku
        return 
      }

      this.sendSolutionLoading = true

      console.log(this.file);

      let formData = new FormData();

      formData.append("file", this.file);
      formData.append("taskPk", this.task.pk);
      formData.append("solutionType", this.task.solutionType.name)

      this.$store.dispatch("tasks/sendSolution", formData).then(response => {
        this.sendSolutionLoading = false
        this.testsResultsModal = true
        this.testResults = response.data.test_results

        this.$store.dispatch("tasks/getAllTasks")

      });
    },

    showSolution() {
      if (this.solution !== undefined) {
        let pks = this.task.solution.find(solution => {
          console.log(solution.user.username);
          console.log(this.$store.state.auth.username);
          return solution.user.username === this.$store.state.auth.username;
        }).pk;

        this.$router.push({
          name: "Solution",
          params: { pk: this.task.pk, pks: pks }
        });
      }
    },

    showSolutionAsTeacher (pk) {
      this.$router.push({
          name: "Solution",
          params: { pk: this.task.pk, pks: pk }
        });
    },

    hideResultDialog () {
      this.fileSendDialog = false
      this.testsResultsModal = false
    }
  },

  computed: {
    task() {
      let contextTask = this.$store.state.tasks.tasks.filter(
        task => task.pk === this.$route.params.pk
      );
      // filter zwraca tablicę, dlatego trzeba zwrócić pierwszy obiekt explicit
      return contextTask[0];
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    },

    hasSolution() {
      console.log(this.task);
      console.log(this.task.solution);
      let sol = this.task.solution.find(solution => {
        console.log(solution.user.username);
        console.log(this.$store.state.auth.username);
        return solution.user.username === this.$store.state.auth.username;
      });
      console.log(sol);
      return sol !== undefined;
    }
  }
};
</script>
<style scoped>
</style>
