<template>
  <div id="app">
    <v-app>
      <main-nav />
      <v-content>
        <v-container fluid style="height: 100%; width: 100%" class="pt-0 pb-0 mt-0">
          <v-row style="height: 100%">
            <v-col cols="12" class="pt-0 pb-0 mt-0 mb-0">
              <router-view />
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import MainNav from "@/components/MainNav";
export default {
  components: {
    "main-nav": MainNav
  },

  name: "App"
};
</script>

<style>
#app {
  min-height: 100vh;
  width: 100vw;
}
</style>
