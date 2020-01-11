<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row v-if="currentRoute.name === 'TestListing'">
          <v-col>Moje kolokwia</v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn color="success" :to="{name: 'TestCreator'}">
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
    this.$router.push({ name: "TestListing" });
  },

  watch: {
    $route(to, from) {
      if (to.name === "MyTests") {
        this.$router.push({ name: "TestListing" });
      }
    }
  },

  computed: {
    currentRoute() {
      return this.$route;
    }
  }
};
</script>