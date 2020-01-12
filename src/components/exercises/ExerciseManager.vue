<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row v-if="currentRoute.name === 'ExerciseListing'">
          <v-col>Moje cwiczenia</v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn color="success" :to="{name: 'ExerciseCreator'}">
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
  props: ['redirected'],

  created() {
    if (!this.$route.params.redirected) {
      this.$router.push({ name: "ExerciseListing" });
    }    
  },

  watch: {
    $route(to, from) {
      if (to.name === "MyExercises") {
        this.$router.push({ name: "ExerciseListing" });
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