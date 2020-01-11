
<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row v-if="currentRoute.name === 'TaskListing'">
          <v-col>Moje zadania</v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn color="success" :to="{name: 'TaskCreator'}">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <router-view></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

export default {
  created() {
    this.$router.push({ name: "TaskListing" });
  },

  watch: {
    $route(to, from) {
      if (to.name === "MyTasks") {
        this.$router.push({ name: "TaskListing" });
      }
    }
  },

  computed: {
    currentRoute() {
      return this.$route;
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>

<style scoped>
</style>
