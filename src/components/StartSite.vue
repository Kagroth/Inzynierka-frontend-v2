<template>
  <div>
    <v-row>
      <!-- Boczne menu -->
      <v-col cols="2" v-if="isLogged">
        <v-navigation-drawer dark permanent>
          <v-list nav>
            <v-list-item
              link
              :to="{name: 'MyTasks'}"
              title="Zobacz aktywne zadania oraz zadania gotowe do oceny"
            >
              <v-list-item-icon>
                <v-icon>mdi-calendar-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Zadania</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <span v-if="userType.name === 'Teacher'">
              <v-list-group
                prepend-icon="mdi-folder"
                nav
                title="Rozwiń menu z odnośnikami do materiałów dydaktycznych"
              >
                <template v-slot:activator>
                  <v-list-item-title>Materialy</v-list-item-title>
                </template>
                <v-list-item
                  link
                  :to="{name: 'MyExercises'}"
                  title="Wyświetl wszystkie ćwiczenia i utwórz nowe"
                >
                  <v-list-item-icon>
                    <v-icon color="orange">mdi-text-box</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Cwiczenia</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  :to="{name: 'MyTests'}"
                  title="Wyświetl wszystkie kolokwia i utwórz nowe z istniejących ćwiczeń"
                >
                  <v-list-item-icon>
                    <v-icon color="green">mdi-text-box-multiple</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Kolokwia</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </span>

            <span v-if="userType.name === 'Teacher'">
              <v-list-group
                prepend-icon="mdi-account-group"
                nav
                title="Rozwiń menu z odnośnikami do użytkowników i grup"
              >
                <template v-slot:activator>
                  <v-list-item-title>Społeczność</v-list-item-title>
                </template>
                <v-list-item link :to="{name: 'Students'}" title="Wyświetl swoich studentów i zaproś nowych użytkowników">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Studenci</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  link
                  :to="{name: 'MyGroups'}"
                  title="Wyświetl swoje grupy użytkowników lub utwórz nowe grupy"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-account-multiple</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Grupy</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </span>

            <v-list-item
              v-else
              link
              :to="{name: 'MyGroups'}"
              title="Wyświetl grupy do których należysz"
            >
              <v-list-item-icon>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Grupy</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              link
              v-if="userType.name === 'Teacher'"
              :to="{name: 'SolutionListing'}"
              title="Wyświetl listę studentów i ich oceny"
            >
              <v-list-item-icon>
                <v-icon>mdi-star</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Oceny</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-else link :to="{name: 'SolutionListing'}" title="Wyświetl swoje oceny">
              <v-list-item-icon>
                <v-icon>mdi-magnify</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Moje wyniki</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item link to="email_test">
              <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Testowanie maila</v-list-item-title>
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
    isLogged() {
      return this.$store.state.auth.isLogged;
    },

    userType() {
      return this.$store.state.auth.profile.userType;
    }
  }
};
</script>

<style scoped>
</style>
