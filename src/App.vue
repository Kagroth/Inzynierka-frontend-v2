<template>
  <div id="app">
    <v-app>      
      <main-nav />
      <v-content>
        <v-container fluid style="height: 100%; width: 100%">
          <router-view />
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
