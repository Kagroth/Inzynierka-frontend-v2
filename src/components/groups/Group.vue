<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <h3>{{ group.name }}</h3>
        </v-col>
        <v-spacer></v-spacer>
        <span v-if="userType.name === 'Teacher'">
          <v-col cols="1">
            <v-btn @click="editGroup" color="success" small>Edytuj</v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn @click="deleteGroup" color="error" small>Usuń</v-btn>
          </v-col>
        </span>
      </v-row>

      <v-divider></v-divider>

      <v-row>
        <v-col>
          <h3>Członkowie:</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>Imię i nazwisko</v-col>
        <v-col>Email</v-col>
      </v-row>
      <v-row v-for="(user, index) in group.users" :key="index">
        <v-col>{{user.first_name}} {{ user.last_name}}</v-col>
        <v-col>{{ user.email }}</v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row>
        <v-col>
          <h3>Aktywne zadania:</h3>
        </v-col>
      </v-row>
      <span v-if="group.activeTasks.length > 0">
        <v-row v-for="(task, index) in group.activeTasks" :key="index">
          <v-col>{{ task.title }}</v-col>
          <v-col>
            <v-btn @click="showTaskDetails(task)" color="primary" small>Szczegóły</v-btn>
          </v-col>
        </v-row>
      </span>
      <span v-else>
        <v-row>
          <v-col>Brak aktywnych zadan</v-col>
        </v-row>
      </span>

      <v-divider></v-divider>

      <span v-if="group.archivedTasks.length > 0">
        <v-row>
          <v-col>
            <h3>Zadania zarchiwizowane:</h3>
          </v-col>
        </v-row>
        <v-row v-for="(task, index) in group.archivedTasks" :key="index">
          <v-col>{{ task.title }}</v-col>
          <v-col>
            <v-btn color="primary" small disabled>Szczegoly</v-btn>
          </v-col>
        </v-row>
      </span>
    </v-container>
  </div>
</template>

<script>
//import Task from '@/components/tasks/Task'

export default {
  components: {
    //'task': Task
  },

  methods: {
    editGroup() {
      let currentGroup = this.$route.params.name;
      this.$router.push({
        name: "GroupEditor",
        params: { name: currentGroup }
      });
    },

    deleteGroup() {
      let confirmation = confirm("Czy na pewno chcesz usunąć grupę?");

      if (confirmation) {
        console.log(this.group);
        this.$store.dispatch("users/deleteGroup", this.group.pk).then(() => {
          this.$router.push("/groups/groups");
        });
      }
    },

    showTaskDetails(task) {
      this.$router.push({ name: "TaskDetails", params: { pk: task.pk } });
    }
  },

  computed: {
    group() {
      let contextGroup = this.$store.state.users.groups.find(
        group => group.name === this.$route.params.name
      );

      return contextGroup;
    },

    userType () {
      return this.$store.state.auth.profile.userType
    }
  }
};
</script>

<style scoped>
</style>
