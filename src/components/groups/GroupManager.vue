<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row v-if="currentRoute.name === 'GroupListing'">
          <v-col>Moje grupy</v-col>
          <v-spacer></v-spacer>
          <v-col v-if="userType.name === 'Teacher'">
            <v-btn color="success" :to="{name: 'GroupCreator'}">
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
  data() {
    return {};
  },

  created() {
    this.$router.push({ name: "GroupListing" });
  },

  watch: {
    $route(to, from) {
      if (to.name === "MyGroups") {
        this.$router.push({ name: "GroupListing" });
      }
    }
  },

  computed: {
    currentRoute() {
      return this.$route;
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    },
  }
};
</script>

<style scoped>
</style>
