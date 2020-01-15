<template>
  <div>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
    </v-snackbar>
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-card>
            <v-card-title>
              <v-row>
                <v-col cols="8">{{ task.title }}</v-col>
                <v-spacer></v-spacer>
                <v-col cols="2" v-if="userType.name === 'Student'">
                  <div v-if="task.taskType.name === 'Exercise'">
                    <div v-if="task.solutionType.name === 'File'">
                      <!--
                        <span v-if="hasSolution">
                          <v-btn color="primary" @click="showSolution">Podglad odpowiedzi</v-btn>
                        </span>
                      -->
                      <span>
                        <v-dialog v-model="fileSendDialog" width="600">
                          <template v-slot:activator="{ on }">
                            <v-btn color="success" v-on="on" rounded>
                              <v-icon>mdi-file</v-icon>
                            </v-btn>
                          </template>
                          <v-card v-if="testsResultsModal">
                            <v-card-title>Twoje rozwiązanie zostało przetestowane i zapisane</v-card-title>

                            <v-card-text>
                              <h3>Wyniki testów:</h3>
                              <v-list>
                                <v-list-item
                                  v-for="(singleResult, index) in this.testResults"
                                  :key="index"
                                >
                                  <v-list-item-content>{{ singleResult }}</v-list-item-content>
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
                            <v-card-title
                              class="headline grey lighten-2"
                              primary-title
                            >Przesyłanie odpowiedzi</v-card-title>

                            <v-card-text>
                              <v-file-input
                                v-model="file"
                                :accept="task.exercise.language.allowed_extension"
                                label="Wybierz plik"
                                @click="onFileChange"
                              ></v-file-input>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                v-if="!sendSolutionLoading"
                                color="primary"
                                text
                                @click="fileSendDialog=false"
                              >Anuluj</v-btn>
                              <v-btn
                                color="primary"
                                :loading="sendSolutionLoading"
                                text
                                @click="sendFileSolution"
                              >Wyślij</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </span>
                    </div>
                    <div v-else-if="task.solutionType.name === 'Editor'">
                      <v-btn
                        rounded
                        color="orange"
                        class="white--text"
                        :to="{name: 'Editor', params: {task: this.task}}"
                      >
                        <v-icon>mdi-play</v-icon>
                      </v-btn>
                    </div>
                    <div v-else>
                      <span>
                        <v-dialog v-model="addGitHubRepoDialog" width="600">
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on" rounded>
                              <v-icon>mdi-github-circle</v-icon>
                            </v-btn>
                          </template>
                          <v-card v-if="testsResultsModal">
                            <v-card-title>Twoje rozwiązanie zostało przetestowane i zapisane</v-card-title>

                            <v-card-text>
                              <h3>Wyniki testów:</h3>
                              <v-list>
                                <v-list-item
                                  v-for="(singleResult, index) in this.testResults"
                                  :key="index"
                                >
                                  <v-list-item-content>{{ singleResult }}</v-list-item-content>
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
                            <v-card-title
                              class="headline grey lighten-2"
                              primary-title
                            >Przesyłanie odpowiedzi</v-card-title>

                            <v-card-text class="mt-4">
                              <v-text-field
                                v-model="gitHubRepo"
                                outlined
                                placeholder="Np: https://github.com/User/RepositoryName.git"
                                label="Link do repozytorium GitHub"
                              ></v-text-field>
                            </v-card-text>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                v-if="!sendSolutionLoading"
                                color="primary"
                                text
                                @click="addGitHubRepoDialog=false"
                              >Anuluj</v-btn>
                              <v-btn
                                color="primary"
                                :loading="sendSolutionLoading"
                                text
                                @click="sendGitHubSolution"
                              >Wyślij</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </span>
                    </div>
                  </div>
                  <div v-else>
                    <v-btn
                      color="orange"
                      class="white--text"
                      :to="{name: 'Editor', params: {task: this.task}}"
                    >
                      <v-icon left>mdi-play-circle</v-icon>Rozwiąż kolokwium
                    </v-btn>
                  </div>
                </v-col>
                <v-col v-else>
                  <v-btn v-if="task.isActive" color="warning" @click="closeTask" :loading="loading">Zakończ zadanie
                    <v-icon right>mdi-lock</v-icon>
                  </v-btn>
                  <div v-else>
                    Zadanie zamkniete
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-subtitle>
              <v-row>
                <v-col>
                  Przypisane do:
                  <span
                    v-for="(group, index) in task.assignedTo"
                    :key="index"
                  >{{ group.name }},</span>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-card-text class="text--primary">
              <div v-if="task.taskType.name == 'Exercise'">
                <h3 class="mb-3">Cwiczenie:</h3>
                <exercise :pk="task.exercise.pk"></exercise>
              </div>
              <div v-else>
                <h3 class="mb-3">Cwiczenia:</h3>
                <v-expansion-panels multiple="true" flat>
                    <v-expansion-panel
                      v-for="(exercise, index) in task.test.exercises"
                      :key="index"
                    >
                      <v-expansion-panel-header>{{ index + 1 }} {{ exercise.title }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <exercise :pk="exercise.pk"></exercise>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
              </div>
              <v-divider class="mt-5 mb-5"></v-divider>
              <div v-if="userType.name === 'Teacher'">
                <h3>Rozwiązania:</h3>
                <span>
                  <v-row>
                    <v-col cols="4" v-for="(groupMember, index) in task.assignedTo[0].users" :key="index">                      
                      <span v-if="task.solution.length > 0">
                        {{ groupMember.first_name }} {{groupMember.last_name }}                        
                        <span v-for="(solution, idx) in task.solution" :key="idx">                        
                          <v-btn v-if="solution.user.username === groupMember.username" color="primary" icon small @click="showSolutionAsTeacher(solution.pk)">
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                          <v-btn v-else icon small color="error" @click="showSolutionAsTeacher(solution.pk)">
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </span>                        
                      </span>
                      <span v-else>
                          {{ groupMember.first_name }} {{groupMember.last_name }}                          
                          <v-btn icon small color="error" @click="showSolutionAsTeacher(solution.pk)">
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </span>
                    </v-col>                  
                  </v-row>
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
      loading: false,
      snackbar: {
        show: false,
        color: "",
        message: ""
      },

      sendSolutionLoading: false,
      testsResultsModal: false,
      testResults: "",
      fileSendDialog: false,
      file: null,
      addGitHubRepoDialog: false,
      gitHubRepo: "",
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
        return;
      }

      this.sendSolutionLoading = true;

      console.log(this.file);

      let formData = new FormData();

      formData.append("file", this.file);
      formData.append("taskPk", this.task.pk);
      formData.append("solutionType", this.task.solutionType.name);

      this.$store.dispatch("tasks/sendSolution", formData).then(response => {
        this.sendSolutionLoading = false;
        this.testsResultsModal = true;
        this.testResults = response.data.test_results;

        this.$store.dispatch("tasks/getAllTasks");
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

    showSolutionAsTeacher(pk = null) {
      this.$router.push({
        name: "Solution",
        params: { pk: pk }
      });
    },

    hideResultDialog() {
      this.fileSendDialog = false;
      this.addGitHubRepoDialog = false;
      this.testsResultsModal = false;
    },

    sendGitHubSolution() {
      if (
        this.gitHubRepo === "" ||
        this.gitHubRepo === undefined ||
        this.gitHubRepo === null
      ) {
        return;
      }

      this.sendSolutionLoading = true;
      console.log(this.file);

      let formData = new FormData();

      formData.append("repository", this.gitHubRepo);
      formData.append("taskPk", this.task.pk);
      formData.append("solutionType", this.task.solutionType.name);

      this.$store.dispatch("tasks/sendSolution", formData).then(response => {
        this.sendSolutionLoading = false;
        this.testsResultsModal = true;
        this.testResults = response.data.test_results;

        this.$store.dispatch("tasks/getAllTasks");
      });
    },

    closeTask() {
      this.loading = true

      let closeTaskData = {}
      
      closeTaskData.pk = this.task.pk
      closeTaskData.mode = "CLOSE"

      this.$store.dispatch('tasks/closeTask', closeTaskData).then(response => {
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

        console.log(response)

        this.$store.dispatch('tasks/getAllTasks')
      })
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
