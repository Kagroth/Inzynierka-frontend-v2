<template>
  <div>
    <v-row>
      <!-- Boczne menu -->
      <v-col cols="2" v-if="isLogged">
        <v-navigation-drawer dark permanent>
            <v-list nav>              
              <v-list-item link :to="{name: 'MyTasks'}">
                <v-list-item-icon>
                  <v-icon>mdi-calendar-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Zadania</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <span v-if="userType.name === 'Teacher'">
                <v-list-group prepend-icon="mdi-folder" nav>
                  <template v-slot:activator>
                    <v-list-item-title>Materialy</v-list-item-title>
                  </template>
                    <v-list-item link :to="{name: 'MyExercises'}">
                      <v-list-item-icon>
                        <v-icon color="orange">mdi-file-document-box</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Cwiczenia</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item link :to="{name: 'MyTests'}">                    
                      <v-list-item-icon>
                        <v-icon color="green">mdi-file-document-box-multiple</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Kolokwia</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>                  
                </v-list-group>              
              </span>

              <v-list-item link :to="{name: 'MyGroups'}">
                <v-list-item-icon>
                  <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Grupy</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
               <v-list-item link v-if="userType.name === 'Teacher'" disabled>
                  <v-list-item-icon>
                    <v-icon>mdi-star</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Oceny</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

              <v-list-item v-else link disabled>
                <v-list-item-icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Moje wyniki</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
      </v-col>
      <v-col cols="8">
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

    userType() {
      return this.$store.state.auth.profile.userType;
    },
  }
};
</script>

<style scoped>
</style>
