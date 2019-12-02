<template>
  <div id="app">
    <v-app>      
      <main-nav />
      <v-content>
        <v-container fluid>
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
</style>
