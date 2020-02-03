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
                <v-col cols="2" v-if="userType.name === 'Student' && task.isActive">
                  <div v-if="task.taskType.name === 'Exercise'">
                    <div v-if="task.solutionType.name === 'File'">
                      <span v-if="hasSolution">
                        <v-menu offset-y>
                          <template v-slot:activator="{ on }">
                            <v-btn rounded v-on="on" color="primary">
                              <v-icon>mdi-menu</v-icon>
                            </v-btn>
                          </template>
                          <v-list nav>
                            <v-list-item @click="showSolution">
                              <v-list-item-icon>
                                <v-icon>mdi-magnify</v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title>Podgląd</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="fileSendDialog = true">
                              <v-list-item-icon>
                                <v-icon>mdi-file</v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title>Przeslij ponownie</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </span>
                      <span v-else>
                        <v-btn color="success" v-on="on" @click="fileSendDialog = true" rounded>
                          <v-icon>mdi-file</v-icon>
                        </v-btn>
                      </span>
                      <v-dialog v-model="fileSendDialog" width="600">
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
                    </div>
                    <div v-else-if="task.solutionType.name === 'Editor'">
                      <v-btn v-if="hasSolution" rounded color="primary" @click="showSolution">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        rounded
                        color="orange"
                        class="white--text"
                        :to="{name: 'Editor', params: {task: this.task}}"
                      >
                        <v-icon>mdi-play</v-icon>
                      </v-btn>
                    </div>
                    <div v-else>
                      <span v-if="hasSolution">
                        <v-menu offset-y>
                          <template v-slot:activator="{ on }">
                            <v-btn rounded v-on="on" color="primary">
                              <v-icon>mdi-menu</v-icon>
                            </v-btn>
                          </template>
                          <v-list nav>
                            <v-list-item @click="showSolution()">
                              <v-list-item-icon>
                                <v-icon>mdi-magnify</v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title>Podgląd</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="addGitHubRepoDialog = true">
                              <v-list-item-icon>
                                <v-icon>mdi-github-circle</v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title>Przeslij ponownie</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </span>
                      <span v-else>
                        <v-btn color="primary" rounded @click="addGitHubRepoDialog = true">
                          <v-icon>mdi-github-circle</v-icon>
                        </v-btn>
                      </span>
                      <v-dialog v-model="addGitHubRepoDialog" width="600">
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
                              @click="addGitHubRepoDialog = false"
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
                    </div>
                  </div>
                  <div v-else>
                    <v-btn v-if="hasSolution" rounded color="primary" @click="showSolution">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      rounded
                      color="orange"
                      class="white--text"
                      :to="{name: 'Editor', params: {task: this.task}}"
                    >
                      <v-icon>mdi-play</v-icon>
                    </v-btn>
                  </div>
                </v-col>
                <v-col
                  cols="4"
                  v-else-if="userType.name === 'Student' && !task.isActive"
                >Zadanie zamkniete</v-col>
                <v-col v-else>
                  <v-btn
                    v-if="task.isActive"
                    color="warning"
                    @click="changeTaskState(`LOCK`)"
                    :loading="loading"
                  >
                    Zakończ zadanie
                    <v-icon right>mdi-lock</v-icon>
                  </v-btn>
                  <div v-else-if="task.isRated">Zadanie zamkniete</div>
                  <div v-else>
                    <v-btn
                      color="success"
                      @click="changeTaskState(`CLOSE`)"
                      :loading="loading"
                    >Zapisz oceny i zamknij zadanie</v-btn>
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
                <v-expansion-panels :multiple="true" flat>
                  <v-expansion-panel v-for="(exercise, index) in task.test.exercises" :key="index">
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
                <v-row>
                  <v-col>
                    <v-list>
                      <v-list-item
                        v-for="(groupMember, index) in task.assignedTo[0].users"
                        :key="`index-${index}`"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-row>
                              <v-col>{{ groupMember.first_name }} {{groupMember.last_name }}</v-col>
                              <v-col v-if="isUserHasSolution(groupMember.username)">
                                <span v-for="(solution, idx) in task.solution" :key="idx">
                                    <span v-if="solution.user.username === groupMember.username">
                                      <span v-if="solution.rate">
                                        {{ solution.rate }}
                                      </span>
                                      <span v-else>
                                        Brak oceny
                                      </span>
                                    </span>
                                </span>
                              </v-col>
                              <v-col v-else>Oczekuje na rozwiazanie</v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <span v-if="isUserHasSolution(groupMember.username)">
                            <span v-for="(solution, idx) in task.solution" :key="idx">
                              <v-btn
                                v-if="solution.user.username === groupMember.username"
                                color="primary"
                                icon
                                small
                                @click="showSolutionAsTeacher(solution.pk, groupMember)"
                              >
                                <v-icon>mdi-magnify</v-icon>
                              </v-btn>
                            </span>
                          </span>
                          <span v-else>
                            <v-btn
                              icon
                              small
                              color="error"
                              @click="showSolutionAsTeacher(null, groupMember)"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </span>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
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
      }).catch(error => {
        this.sendSolutionLoading = false;
        console.log(error);
      });
    },

    showSolution() {
      if (this.solution !== undefined) {
        let pk = this.task.solution.find(solution => {
          console.log(solution.user.username);
          console.log(this.$store.state.auth.username);
          return solution.user.username === this.$store.state.auth.username;
        }).pk;

        this.$router.push({
          name: "Solution",
          params: { pk: pk }
        });
      }
    },

    showSolutionAsTeacher(pk = null, contextUser = null) {
      this.$router.push({
        name: "Solution",
        params: { pk: pk, contextUser: contextUser }
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

    changeTaskState(stateToSet) {
      console.log(stateToSet);
      if (!["LOCK", "CLOSE"].includes(stateToSet)) {
        console.log("Niepoprawny parametr" + stateToSet);
        return;
      }

      this.loading = true;

      let closeTaskData = {};

      closeTaskData.pk = this.task.pk;
      closeTaskData.mode = stateToSet;

      this.$store.dispatch("tasks/closeTask", closeTaskData).then(response => {
        this.loading = false;
        let color = "";

        if (response.status === 200) {
          color = "success";
        } else {
          color = "error";
        }

        this.snackbar.message = response.data.message;
        this.snackbar.color = color;
        this.snackbar.show = true;

        console.log(response);

        this.$store.dispatch("tasks/getAllTasks");
      });
    },

    isUserHasSolution(username) {
      let usernamesWithSolutions = this.task.solution.map(sol => {
        return sol.user.username;
      });

      return usernamesWithSolutions.includes(username);
    }
  },

  computed: {
    task() {
      return this.$store.state.tasks.tasks.find(
        task => task.pk === this.$route.params.pk
      );
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
