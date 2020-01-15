<template>
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
              {{ task.exercise.solution }}
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-card-text>

        <v-card-actions>
          <v-row class="pa-0 ma-0" align="baseline">
            <v-spacer></v-spacer>
            <v-col cols="2" class="pa-0 ma-0">
              <v-select outlined rounded label="Ocena" :items="[2, 3, 3.5, 4, 4.5, 5]"></v-select>
            </v-col>
            <v-col cols="1">
              <v-btn large rounded color="primary">Oceń</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <h3> {{ task.test.title }} </h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h4> Roziwazanie uzytkownika: {{ solutionAuthor.first_name }} {{ solutionAuthor.last_name }} </h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col  
          cols="12"
          v-for="(exercise, index) in task.test.exercises"
          :key="index">
           <v-card
              class="mb-4"
              style="white-space: pre-wrap;">
              <v-card-title>
                {{ exercise.title }}
              </v-card-title>
              <v-card-text class="text--primary">
                 <v-row>
                  <v-col>{{ exercise.content }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col>
                    <h4>Rozwiazanie:</h4>
                    {{ exercise.solution }}
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-card-text>
              <v-card-actions>
                <v-row class="pa-0 ma-0" align="baseline">
                  <v-spacer></v-spacer>
                  <v-col cols="2" class="pa-0 ma-0">
                    <v-select outlined rounded label="Ocena" :items="[2, 3, 3.5, 4, 4.5, 5]"></v-select>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>        
        <v-col cols="1">
           <v-btn large rounded color="primary">Oceń</v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      solutionAuthor: {},
      task: {}
    };
  },

  created() {
    this.$store
      .dispatch("tasks/getSolution", this.$route.params.pk)
      .then(response => {
        this.solutionAuthor = response.data.data.user;
        this.task = response.data.data.task;

        if (this.task.taskType.name === "Exercise") {
          this.task.exercise.solution = JSON.parse(
            JSON.stringify(response.data.data.solutionValue)
          );
        } else {
          let solutions = response.data.data.solutionValue.map(
            singleSolution => {
              return JSON.parse(JSON.stringify(singleSolution));
            }
          );
          console.log(solutions);

          for (let index in this.task.test.exercises) {
            this.task.test.exercises[index].solution = solutions[index];
          }
        }
      });
  },

  computed: {
    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>