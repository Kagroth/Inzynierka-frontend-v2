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
          <v-card-title>Studenci:</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(student, index) in students" :key="index">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    @click="inspectUser(student.pk)"
                  >{{ student.first_name }} {{ student.last_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ student.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
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
      students: [],
      solutions: []
    };
  },

  created() {
    let actionToDispatch = '';

    if (this.userType.name === 'Student') {
      actionToDispatch = 'tasks/getAllSolutions';
    }
    else {
      actionToDispatch = 'users/loadTeachersStudents'
    }

    this.$store.dispatch(actionToDispatch).then(response => {
      if (response.status === 200) {
        if (this.userType.name === 'Student') {
          this.solutions = response.data
        }
        else {
          this.students = response.data
        }
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