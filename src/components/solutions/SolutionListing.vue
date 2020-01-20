<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card v-if="userType.name === 'Student'">
          <v-card-title>Moje wyniki</v-card-title>
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
                  <tr v-for="(solution, index) in solutions" :key="index">
                    <td>{{ solution.task.title }}</td>
                    <td>{{ solution.rate || "Brak oceny"}}</td>
                    <td>
                      <v-btn icon color="primary" @click="showSolution(solution.pk)">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-expansion-panels>
              <v-expansion-panel v-for="(group, index) in groups" :key="index">
                <v-expansion-panel-header>Grupa: {{ group.name }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table>
                    <template>
                      <thead>
                        <tr class="text-center">
                          <th>Student</th>
                          <th>Podgląd</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(user, index) in group.users" :key="`index-user-${index}`">
                          <td>{{ user.first_name }} {{ user.last_name }}</td>
                          <td>
                            <v-btn icon color="primary" @click="inspectUser(user.pk)">
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
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
      solutions: []
    };
  },

  created() {
    this.$store.dispatch("users/loadGroups");
    this.$store.dispatch("tasks/getAllSolutions").then(response => {
      if (response.status === 200) {
        this.solutions = response.data;
      }
    });
  },

  methods: {
    showSolution(pk) {
      this.$router.push({
        name: "Solution",
        params: { pk: pk }
      });
    },

    inspectUser(pk) {
        this.$router.push({
            name: "UserData",
            params: { pk: pk }
        })
    }
  },

  computed: {
    userType() {
      return this.$store.state.auth.profile.userType;
    },

    groups() {
      return this.$store.state.users.groups;
    }
  }
};
</script>