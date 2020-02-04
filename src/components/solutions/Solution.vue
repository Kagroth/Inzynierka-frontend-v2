<template>
  <div
    v-if="noSolution"
  >Użytkownik {{ solutionAuthor.first_name }} {{ solutionAuthor.last_name }} nie przyslal rozwiazania</div>
  <div v-else>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
    </v-snackbar>
    <!-- Widok dla Nauczyciela -->
    <div v-if="userType.name === 'Teacher'">
      <div v-if="task.taskType.name === 'Exercise'">
        <v-card tile>
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text class="text--primary" style="white-space: pre-wrap;">
            <v-row>
              <v-col>{{ task.exercise.content }}</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <h4>Rozwiazanie:</h4>
                {{ solution.solution_exercise[0].solution_value }}
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <v-expansion-panels tile style="white-space: pre-wrap">
                  <v-expansion-panel>
                    <v-expansion-panel-header>Wyniki testów</v-expansion-panel-header>
                    <v-expansion-panel-content>{{ solution.solution_exercise[0].test_results }}</v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-row class="pa-0 ma-0" align="baseline">
              <v-spacer></v-spacer>
              <v-col cols="2" class="pa-0 ma-0">
                <v-select
                  outlined
                  rounded
                  label="Ocena"
                  :items="[2, 3, 3.5, 4, 4.5, 5]"
                  v-model="solutionRates[0].rate"
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-btn
                  large
                  rounded
                  color="primary"
                  @click="rateSolution"
                  :loading="loading"
                  :disabled="disabled"
                >Oceń</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </div>
      <div v-else>
        <v-row>
          <v-col>
            <h3>{{ task.title }}</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Rozwiązanie użytkownika: {{ solutionAuthor.first_name }} {{ solutionAuthor.last_name }}</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-for="(sol_exercise, index) in solution.solution_test.solution_exercises" :key="index">
            <v-card class="mb-4" style="white-space: pre-wrap;">
              <v-card-title>{{ sol_exercise.exercise.title }}</v-card-title>
              <v-card-text class="text--primary">
                <v-row>
                  <v-col>{{ sol_exercise.exercise.content }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col>
                    <h4>Rozwiazanie:</h4>
                    {{ sol_exercise.solution_value }}
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
              <v-col>
                <v-expansion-panels tile style="white-space: pre-wrap">
                  <v-expansion-panel>
                    <v-expansion-panel-header>Wyniki testów</v-expansion-panel-header>
                    <v-expansion-panel-content>{{ sol_exercise.test_results }}</v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
              </v-card-text>
              <v-card-actions>
                <v-row class="pa-0 ma-0" align="baseline">
                  <v-spacer></v-spacer>
                  <v-col cols="2" class="pa-0 ma-0">
                    <v-select
                      outlined
                      rounded
                      label="Ocena"
                      :items="[2, 3, 3.5, 4, 4.5, 5]"
                      v-model="solutionRates[index].rate"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="1">
            <v-btn
              large
              rounded
              color="primary"
              @click="rateSolution"
              :loading="loading"
              :disabled="disabled"
            >Oceń</v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- Widok dla Ucznia -->
    <div v-else>
      <div v-if="task.taskType.name === 'Exercise'">
        <v-card tile>
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text class="text--primary" style="white-space: pre-wrap;">
            <v-row>
              <v-col>{{ task.exercise.content }}</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <h4>Rozwiazanie:</h4>
                {{ solution.solution_exercise[0].solution_value }}
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <v-expansion-panels tile style="white-space: pre-wrap">
                  <v-expansion-panel>
                    <v-expansion-panel-header>Wyniki testów</v-expansion-panel-header>
                    <v-expansion-panel-content>{{ solution.solution_exercise[0].test_results }}</v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-row class="pa-0 ma-0" align="baseline">
              <v-spacer></v-spacer>
              <v-col
                v-if="solution.solution_exercise[0].rate"
                cols="2"
              >Ocena: {{ solution.solution_exercise[0].rate }}</v-col>
              <v-col v-else cols="3">Oczekuje na ocene</v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </div>
      <div v-else>
        <v-row>
          <v-col>
            <h3>{{ task.title }}</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            v-for="(sol_exercise, index) in solution.solution_test.solution_exercises"
            :key="index"
          >
            <v-card class="mb-4" style="white-space: pre-wrap;">
              <v-card-title>{{ sol_exercise.exercise.title }}</v-card-title>
              <v-card-text class="text--primary">
                <v-row>
                  <v-col>{{ sol_exercise.exercise.content }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col>
                    <h4>Rozwiazanie:</h4>
                    {{ sol_exercise.solution_value }}
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col>
                    <v-expansion-panels tile style="white-space: pre-wrap">
                      <v-expansion-panel>
                        <v-expansion-panel-header>Wyniki testów</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ sol_exercise.test_results }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-row class="pa-0 ma-0" align="baseline">
                  <v-spacer></v-spacer>
                  <v-col v-if="sol_exercise.rate" cols="2">Ocena: {{ sol_exercise.rate }}</v-col>
                  <v-col v-else cols="3">Oczekuje na ocene</v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col v-if="solution.rate" cols="3">
            Ocena końcowa:
            {{ solution.rate }}
          </v-col>
          <v-col v-else cols="4">Kolokwium oczekuje na ocene</v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      disabled: false,
      snackbar: {
        show: false,
        color: "",
        message: ""
      },

      noSolution: false,
      solution: {},
      solutionAuthor: {},
      task: {},

      solutionRates: {}
    };
  },

  created() {
    if (this.$route.params.pk === null) {
      this.noSolution = true;
      this.solutionAuthor = this.$route.params.contextUser;

      return;
    }

    this.$store
      .dispatch("tasks/getSolution", this.$route.params.pk)
      .then(response => {
        console.log(response);

        this.solution = response.data;
        this.solutionAuthor = response.data.user;
        this.task = response.data.task;

        if (response.status === 400) {
          this.noSolution = true;
          return;
        }

        this.solutionRates = this.solution.solution_exercise.map(
          solExercise => {
            return {
              pk: solExercise.pk,
              rate: solExercise.rate
            };
          }
        );

        if (this.task.taskType.name === "Exercise") {
          this.task.exercise.solution = JSON.parse(
            JSON.stringify(response.data.solutionValue)
          );
        } else {
          let solutions = response.data.solutionValue.map(singleSolution => {
            return JSON.parse(JSON.stringify(singleSolution));
          });
          console.log(solutions);

          for (let index in this.task.test.exercises) {
            this.task.test.exercises[index].solution = solutions[index];
          }
        }
      });
  },

  methods: {
    rateSolution() {
      for (let solRate of this.solutionRates) {
        console.log(solRate);
        if (solRate.rate === null || solRate.rate === undefined) {
          return;
        }
      }

      this.loading = true;

      let rateSolutionData = {};

      rateSolutionData.pk = this.solution.pk;
      rateSolutionData.solRates = this.solutionRates;
      rateSolutionData.mode = "RATE";

      this.$store
        .dispatch("tasks/rateSolution", rateSolutionData)
        .then(response => {
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
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  computed: {
    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>