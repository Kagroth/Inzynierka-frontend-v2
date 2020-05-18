<template>
  <div>
    <v-row>
      <v-col cols="4">
        <h3>{{ group.name }}</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" v-if="userType.name === 'Teacher'">
          <v-btn class="mr-4" @click="editGroup" color="success" small>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>   
        <v-btn @click="deleteGroup" color="error" small>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row>
      <v-col>
        <h3>Członkowie:</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <v-list-item v-for="(user, index) in group.users" :key="index">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title @click="userType.name === 'Teacher' ? inspectUser(user.pk) : null"> <!-- jeśli typ uzytkownika to teacher to podepnij metode inspectUser -->
                <v-hover v-slot:default="{ hover }">
                  <span
                    :class="hover && userType.name === 'Teacher' ? 'title-link' : ''"
                  >{{ user.first_name }} {{ user.last_name }}</span>
                </v-hover>
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row>
      <v-col>
        <h3>Aktywne zadania:</h3>
      </v-col>
    </v-row>
    <span v-if="group.activeTasks.length > 0">
      <v-row>
        <v-col>
          <v-list>
            <v-list-item v-for="(task, index) in group.activeTasks" :key="index">
              <v-list-item-icon v-if="task.taskType.name === 'Exercise'">
                <v-icon>mdi-text-box</v-icon>
              </v-list-item-icon>
              <v-list-item-icon v-else>
                <v-icon>mdi-text-box-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title @click="showTaskDetails(task)">
                  <v-hover v-slot:default="{ hover }">
                    <span :class="hover ? 'title-link' : ''">{{ task.title }}</span>
                  </v-hover>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
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
      <v-row>
        <v-col>
          <v-list>
            <v-list-item v-for="(task, index) in group.archivedTasks" :key="index">
              <v-list-item-icon v-if="task.taskType.name === 'Exercise'">
                <v-icon>mdi-file-document-box</v-icon>
              </v-list-item-icon>
              <v-list-item-icon v-else>
                <v-icon>mdi-file-document-box-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title @click="showTaskDetails(task)">
                  <v-hover v-slot:default="{ hover }">
                    <span :class="hover ? 'title-link' : ''">{{ task.title }}</span>
                  </v-hover>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </span>
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
          this.$router.push({ name: "GroupListing" });
        });
      }
    },

    showTaskDetails(task) {
      this.$router.push({ name: "TaskDetails", params: { pk: task.pk } });
    },

    inspectUser(pk) {
      this.$router.push({
        name: "UserData",
        params: { pk: pk }
      });
    }
  },

  computed: {
    group() {
      let contextGroup = this.$store.state.users.groups.find(
        group => group.name === this.$route.params.name
      );

      return contextGroup;
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>

<style scoped>
.v-list {
  cursor: default;
}

.title-link {
  cursor: pointer;
  color: lightblue;
}
</style>
