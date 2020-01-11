<template>
  <div>
    <v-row>
      <v-col cols="3" v-if="isLogged">
        <v-card flat>
          <v-navigation-drawer dark>
            <v-list nav>
              <v-list-item link to="/tasks">
                <v-list-item-icon>
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Moje zadania</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link to="/groups/groups">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Moje grupy</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link to disabled>
                <v-list-item-icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Moje wyniki</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col>
        <router-view></router-view>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  computed: {    
    isLogged () {
      return this.$store.state.auth.isLogged
    },
  }
};
</script>

<style scoped>
</style>
