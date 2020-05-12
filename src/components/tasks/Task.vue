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
                                <v-icon>mdi-github</v-icon>
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
                          <v-icon>mdi-github</v-icon>
                        </v-btn>
                      </span>

                      <!-- Okno z wynikiem testowania oraz formularzem w którym podajemy adres repozytorium i plik z rozwiązaniem -->
                      <v-dialog v-model="addGitHubRepoDialog" width="600" persistent scrollable>
                        <!-- Wynik testowania -->
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
                        <!-- Formularz do udzielenia odpowiedzi -->
                        <v-stepper v-else v-model="gitHubStepperModel" style="overflow-y: scroll;">
                              <v-stepper-header>
                                <v-stepper-step :complete="gitHubStepperModel > 1" step="1" :rules="firstStepCompleteRules">Podaj adres repozytorium</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :complete="gitHubStepperModel > 2" step="2">Wybierz plik</v-stepper-step>
                              </v-stepper-header>
                              <v-stepper-items>
                                <!-- Krok pierwszy - podanie adresu repozytorium -->
                                <v-stepper-content step="1">
                                  <v-card flat tile>
                                    <v-card-text>                                      
                                      <v-text-field
                                        v-model="ghSolutionRepositoryURL"
                                        placeholder="Np: https://github.com/User/RepositoryName.git"
                                        label="Link do repozytorium"
                                      ></v-text-field>
                                    </v-card-text>
                                  </v-card>
                                  <v-row>
                                    <v-spacer></v-spacer>
                                    <v-col class="text-right">
                                      <v-btn
                                        v-if="!sendSolutionLoading"
                                        color="primary"
                                        text
                                        @click="addGitHubRepoDialog = false"
                                      >Anuluj</v-btn>
                                      <v-btn
                                        color="primary"
                                        :loading="sendSolutionLoading"
                                        @click="nextStep"
                                      >Dalej</v-btn>
                                    </v-col>
                                  </v-row>                             
                                </v-stepper-content>
                                
                                <!-- Krok drugi - wybranie pliku -->
                                <v-stepper-content step="2">
                                  <v-card flat tile>
                                    <v-card-text  v-if="firstStepCompleteRules[0]()">
                                      <v-progress-circular indeterminate v-if="gitHubLoadingFiles"></v-progress-circular>
                                      <div v-else>
                                        <v-breadcrumbs :items="repoContent">
                                          <template v-slot:item="{ item }">
                                            <v-breadcrumbs-item @click="item.name === 'Root' ? getFilesOfRepo() : changeRepoContent($event, item)">
                                              {{ item.name }}
                                            </v-breadcrumbs-item>
                                          </template>
                                        </v-breadcrumbs>
                                        <span v-if="repoDirs.length > 0">
                                          <span v-for="(dir, index) in repoDirs" :key="`repo-dir-${index}`">
                                            <a @click="getFilesOfRepoDirectory($event, dir)">{{ dir.name }}</a>
                                          </span>
                                        </span>
                                        <v-radio-group v-if="repoFiles.length > 0" v-model="selectedRepositoryElem">
                                          <v-radio v-for="(repoElem, index) in repoFiles" :key="`repo-${index}`" :label="repoElem.name" :value="repoElem"></v-radio>
                                        </v-radio-group>
                                        <div v-else>
                                          Brak odpowiednich plików
                                        </div>
                                      </div>
                                    </v-card-text>
                                    <v-card-text v-else>
                                      Nie podano poprawnego adresu repozytorium
                                    </v-card-text>
                                  </v-card>
                                  <v-row>
                                    <v-spacer></v-spacer>
                                    <v-col class="text-right">
                                      <v-btn
                                        v-if="!sendSolutionLoading"
                                        color="primary"
                                        text
                                        @click="gitHubStepperModel = 1"
                                      >Powrót</v-btn>
                                      <v-btn
                                        color="primary"
                                        :loading="sendSolutionLoading"
                                        @click="sendGitHubSolution"
                                      >Wyślij</v-btn>
                                    </v-col>
                                  </v-row>  
                                </v-stepper-content>
                              </v-stepper-items>
                            </v-stepper>                        
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
                  <span>{{ task.assigned_to.name }}</span>
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
                        v-for="(groupMember, index) in task.assigned_to.users"
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
                              disabled
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

      gitHubStepperModel: "1",
      sendSolutionLoading: false,
      testsResultsModal: false,
      testResults: "",
      fileSendDialog: false,
      file: null,
      addGitHubRepoDialog: false,

      ghSolutionRepositoryURL: "",

      selectedRepositoryElem: {},

      gitHubLoadingFiles: false,
      repoContent: [],
      currentContextRepoDir: "",
      solution: null
    };
  },

  created() {},

  methods: {
    nextStep () {
      this.gitHubStepperModel = 2
      console.log(this.firstStepCompleteRules[0]())

      if (this.firstStepCompleteRules[0]()) {
        this.getFilesOfRepo()
      }
    },

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
        this.ghSolutionRepositoryURL === "" ||
        this.ghSolutionRepositoryURL === undefined ||
        this.ghSolutionRepositoryURL === null
      ) {
        alert("Nie wybrano repozytorium")
        return;
      }

      if (
        this.selectedRepositoryElem === "" ||
        this.selectedRepositoryElem === undefined ||
        this.selectedRepositoryElem === null
      ) {
        alert("Nie wybrano pliku")

        return;
      }

      this.sendSolutionLoading = true;
      console.log(this.file);

      let formData = new FormData();

      formData.append('repositoryURL', this.ghSolutionRepositoryURL)
      formData.append('filename', this.selectedRepositoryElem.name)
      formData.append('fileDownloadURL', this.selectedRepositoryElem.download_url)
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
    },

    async getFilesOfRepo() {
      this.selectedRepositoryElem = null
      this.gitHubLoadingFiles = true
      this.repoContent = []

      let arr = this.ghSolutionRepositoryURL.split("/")
      const username = arr[3]
      const repoName = arr[4]
      console.log(arr)

      const githubApiLink = `https://api.github.com/repos/${username}/${repoName}/contents`

      console.log(githubApiLink)

      const response_content = await this.loadContentFromGithubURL(githubApiLink)

      this.currentContextRepoDir = githubApiLink
      
      this.addContent('Root', githubApiLink, null, response_content)
      
      this.gitHubLoadingFiles = false
    },

    async getFilesOfRepoDirectory(event, dir) {
      event.preventDefault();
      this.gitHubLoadingFiles = true
      
      console.log(dir)
      this.selectedRepositoryElem = null
      const urlToFetch = dir.url 

      const response_content = await this.loadContentFromGithubURL(urlToFetch)

      const parent = this.repoContent[this.repoContent.length - 1].github_url

      this.currentContextRepoDir = urlToFetch
      
      const isInContent = this.repoContent.some(repoContentObject => {
        return repoContentObject.github_url === urlToFetch
      })

      if (isInContent) {
        const index = this.repoContent.findIndex(repoContentObject => {
          return repoContentObject.github_url === urlToFetch
        })

        this.repoContent = this.repoContent.slice(0, index)
      }

      console.log(this.repoContent)

      this.addContent(dir.name, urlToFetch, parent, response_content)

      this.gitHubLoadingFiles = false
    },

    async loadContentFromGithubURL(githubApiLink) {
      let response = await fetch(githubApiLink, {
            method: 'GET'
          })

      let data = await response.json()

      console.log(data)

      let response_content = data.filter(repoElem => {
        const type = repoElem.type

        if (type === 'dir') {
          return true
        }

        if (type === 'file') {
          const fileName = repoElem.name

          let extension = fileName.split(".")[1]
          extension = ".".concat(extension)

          return (extension === this.task.exercise.language.allowed_extension)
        }

        return false
      })

      return response_content
    },

    addContent(name, github_url, parent_url, content) {
      this.repoContent.push({
        name: name,
        github_url: github_url,
        parent_url: parent_url,
        content: content
      })
    },

    changeRepoContent(event, dir) {
      this.gitHubLoadingFiles = true
      console.log(dir)
      console.log(dir.github_url)

      this.selectedRepositoryElem = null
      this.currentContextRepoDir = dir.github_url

      const isInContent = this.repoContent.some(repoContentObject => {
        return repoContentObject.github_url === this.currentContextRepoDir
      })

      if (isInContent) {
        const index = this.repoContent.findIndex(repoContentObject => {
          return repoContentObject.github_url === this.currentContextRepoDir
        })

        this.repoContent = this.repoContent.slice(0, index + 1)

        this.currentContextRepoDir = dir.github_url

      }

      this.gitHubLoadingFiles = false
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
    },
    
    firstStepCompleteRules () {
      let rules = []

      const isStepGreaterThanOne = () => this.gitHubStepperModel > 1
    
      const isCorrect = () => {
        const regex = /^([A-Za-z0-9]+@|http(|s):\/\/)([A-Za-z0-9.]+(:\d+)?)(?::|\/)([\d/\w.-]+?)(\.git)?$/i
        const result = regex.test(this.ghSolutionRepositoryURL)

        if (result === false && isStepGreaterThanOne()) {
          return false
        }

        return true
        }

      rules.push(isCorrect)

      return rules
    },

    repoFiles () {
      if (!Array.isArray(this.repoContent)) {
        return []
      }

      if (this.repoContent.length === 0) {
        return []
      }

      const repoContentObjectToRetrieveFilesFrom = this.repoContent.find(repoDirContent => {
        return repoDirContent.github_url === this.currentContextRepoDir
      })

      const filesList = repoContentObjectToRetrieveFilesFrom.content.filter(repoElem => {
        const type = repoElem.type

        if (type === 'file') {
          const fileName = repoElem.name

          let extension = fileName.split(".")[1]
          extension = ".".concat(extension)

          return (extension === this.task.exercise.language.allowed_extension)
        }

        return false
      })

      return filesList
    },

    repoDirs () {
      if (!Array.isArray(this.repoContent)) {
        return []
      }
      
      if (this.repoContent.length === 0) {
        return []
      }

      const repoContentObjectToRetrieveFilesFrom = this.repoContent.find(repoDirContent => {
        return repoDirContent.github_url === this.currentContextRepoDir
      })
      const dirsList = repoContentObjectToRetrieveFilesFrom.content.filter(repoElem => {
        return (repoElem.type === 'dir')
      })

      return dirsList
    }
  }
};
</script>
<style scoped>
</style>
