<template>
  <div>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>{{ userData.user.first_name }} {{ userData.user.last_name }}</v-card-title>
          <v-card-text>
            <v-simple-table>
              <template>
                <thead>
                  <tr class="text-center">
                    <th>Zadanie</th>
                    <th>Ocena</th>
                    <th>Podgląd</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(task, index) in userData.tasks" :key="index">
                    <td>{{ task.title }}</td>
                    <td>
                      <div
                        v-if="getSolution(task) !== undefined"
                      >{{ getSolution(task).rate || "Brak oceny" }}</div>
                      <div v-else>Brak rozwiązania</div>
                    </td>
                    <td>
                      <div v-if="getSolution(task) !== undefined">
                        <v-btn icon color="primary" @click="showSolution(getSolution(task))">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </div>
                      <div v-else>
                        <v-btn icon color="error" disabled>
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["pk"],

  data() {
    return {
      userData: {}
    };
  },

  created() {
    this.$store.dispatch("users/getUserData", this.pk).then(response => {
      if (response.status === 200) {
        this.userData = response.data;
      }
    });
  },

  methods: {
    getSolution(task) {
      let sol = task.solution.find(sol => {
        return sol.user.pk === this.userData.user.pk;
      });

      return sol;
    },

    showSolution(solution) {
      let pk = null;

      if (solution) {
        pk = solution.pk;
      }

      this.$router.push({
        name: "Solution",
        params: { pk: pk }
      });
    }
  }
};
</script>