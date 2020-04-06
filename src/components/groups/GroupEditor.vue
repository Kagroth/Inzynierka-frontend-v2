<template>
  <div>
    <v-row>
      <v-col>
        <v-form>
          <v-row>
            <v-col>
              <v-text-field type="text" v-model="form.groupName" label="Nazwa grupy" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h3>Członkowie grupy:</h3>
            </v-col>
            <v-col cols="1">
              <v-btn
                small
                @click="openDialog($event, addUsersContext)"
                color="success"
                title="Dodaj nowych użytkowników do grupy"
              >
                <v-icon>mdi-account-multiple-plus</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn
                @click="openDialog($event, removeUsersContext)"
                small
                color="error"
                title="Usuń użytkowników z grupy"
              >
                <v-icon>mdi-account-multiple-minus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-list>
                <v-list-item v-for="(user, index) in contextGroup.users" :key="index">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ user.first_name }} {{ user.last_name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col>
              <h3>Indeks zmian:</h3>
              <v-list>
                <v-list-item v-for="(user, index) in addUsersContext.selectedUsers" :key="index">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ user.first_name }} {{ user.last_name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon color="success" title="Użytkownik wybrany do dodania do grupy">mdi-plus</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-list>
                <v-list-item v-for="(user, index) in removeUsersContext.selectedUsers" :key="index">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ user.first_name }} {{ user.last_name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon color="error" title="Użytkownik wybrany do usuniecia z grupy">mdi-minus</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="3" align="right">
              <v-btn color="primary" @click="saveGroupChanges">Zapisz zmiany</v-btn>
            </v-col>
          </v-row>

          <!-- Dodawanie użytkownikow do grupy -->
          <v-dialog persistent scrollable v-model="addUsersContext.showDialog" width="800">
            <v-card>
              <v-card-title>Wybierz użytkowników do dodania:</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <h3 class="text-center">Użytkownicy:</h3>
                    <v-list>
                      <v-list-item
                        v-for="(selectableUserElem, index) in selectableUserArray"
                        :key="`user-${index}`"
                      >
                        <v-list-item-content>{{ selectableUserElem.userData.first_name }} {{ selectableUserElem.userData.last_name }}</v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox
                            v-model="selectableUserElem.selected"
                            @change="toggleUser($event, index, addUsersContext)"
                          ></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="6">
                    <h3 class="text-center">Wybrani użytkownicy:</h3>
                    <v-list>
                      <v-list-item
                        v-for="(user, index) in addUsersContext.selectedUsers"
                        :key="`user-${index}`"
                      >
                        <v-list-item-content>{{ user.first_name }} {{ user.last_name }}</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialog($event, addUsersContext, true)">Wyczyść</v-btn>
                <v-btn text @click="closeDialog($event, addUsersContext)">Wybierz</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Usuwanie użytkowników z grupy -->
          <v-dialog persistent scrollable v-model="removeUsersContext.showDialog" width="800">
            <v-card>
              <v-card-title>Wybierz użytkowników do usunięcia:</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <h3 class="text-center">Użytkownicy:</h3>
                    <v-list>
                      <v-list-item
                        v-for="(selectableUserElem, index) in selectableUserArray"
                        :key="`user-${index}`"
                      >
                        <v-list-item-content>{{ selectableUserElem.userData.first_name }} {{ selectableUserElem.userData.last_name }}</v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox
                            v-model="selectableUserElem.selected"
                            @change="toggleUser($event, index, removeUsersContext)"
                          ></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="6">
                    <h3 class="text-center">Wybrani użytkownicy:</h3>
                    <v-list>
                      <v-list-item
                        v-for="(user, index) in removeUsersContext.selectedUsers"
                        :key="`user-${index}`"
                      >
                        <v-list-item-content>{{ user.first_name }} {{ user.last_name }}</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialog($event, removeUsersContext, true)">Wyczyść</v-btn>
                <v-btn text @click="closeDialog($event, removeUsersContext)">Wybierz</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contextGroup: {},

      selectableUserArray: [],

      addUsersContext: {
        showDialog: false,
        selectedUsers: []
      },

      removeUsersContext: {
        showDialog: false,
        selectedUsers: []
      },

      currentSelectedUser: null,
      form: {
        pk: "",
        oldName: "",
        groupName: "",
        selectedUsers: [],
        usersToRemove: []
      }
    };
  },

  methods: {
    addUser() {
      if (this.currentSelectedUser === null) {
        return;
      }

      if (this.form.selectedUsers.includes(this.currentSelectedUser)) {
        return;
      }

      this.form.selectedUsers.push(this.currentSelectedUser);
    },

    removeSelectedUser(user) {
      this.form.selectedUsers = this.form.selectedUsers.filter(
        selectedUser => selectedUser !== user
      );
    },

    removeUserFromGroup(user) {
      if (this.form.usersToRemove.includes(user)) {
        return;
      }

      this.contextGroup.users = this.contextGroup.users.filter(
        selectedUser => selectedUser !== user
      );
      this.form.usersToRemove.push(user);
    },

    /*
    undoRemove (user) {
      if (this.contextGroup.users.includes(user)) {
        return
      }

      if (this.contextGroup.users.length === 0) {
        console.log('Cos tu sie dzieje')
      }

      this.form.usersToRemove = this.form.usersToRemove.filter(selectedUser => selectedUser !== user)
      this.contextGroup.users.push(user)     
    },
*/
    saveGroupChanges(event) {
      event.preventDefault();

      if (this.form.groupName === "") {
        alert("Nie podano nazwy grupy");
        return;
      }

      this.$store
        .dispatch("users/updateGroup", this.form)
        .then(response => {
          let message = response.data.message;
          alert(message);

          if (message === "Grupa została zaktualizowana") {
            this.$router.push("/groups");
          }
        })
        .catch(() => {
          console.log("Nie udalo sie zaktualizowac grupy");
          alert("Nie udalo sie zaktualizowac grupy");
        });
    },

    toggleUser(event, userIndex, context) {
      if (this.selectableUserArray[userIndex].selected) {
        context.selectedUsers.push(
          this.selectableUserArray[userIndex].userData
        );
      } else {
        context.selectedUsers = context.selectedUsers.filter(user => {
          return user.pk !== this.selectableUserArray[userIndex].userData.pk;
        });
      }
    },

    openDialog(event, context) {
      let sourceArrayToMap = [];

      if (context === this.addUsersContext) {
        sourceArrayToMap = this.users;
      } else {
        sourceArrayToMap = this.contextGroup.users;
      }

      context.showDialog = true;

      // Tworzenie tablicy obiektow na potrzeby checkboxow
      this.selectableUserArray = sourceArrayToMap.map(user => {
        return {
          userData: user,
          selected: false
        };
      });

      /* 
        Odtworzenie stanu selectableUserArray z listy uzytkownikow z aktualnego contextu.
        Jezeli user znajduje sie w context.selectedUsers tzn ze odpowiedni obiekt w selecatbleUserArray
        musi miec wartosc selected = true.  
       */
      this.selectableUserArray.forEach(element => {
        for (let userData of context.selectedUsers) {
          if (userData.pk === element.userData.pk) {
            element.selected = true;
          }
        }
      });
    },

    closeDialog(event, context, cancelAction = false) {
      context.showDialog = false;

      if (cancelAction) {
        this.selectableUserArray.forEach(element => {
          element.selected = false;
        });

        context.selectedUsers = [];
      }
    }
  },

  created() {
    this.contextGroup = this.$store.state.users.groups.find(
      group => group.name === this.$route.params.name
    );
    this.form.pk = this.contextGroup.pk;
    this.form.groupName = this.contextGroup.name;
    this.form.oldName = this.contextGroup.name;

    this.$store
      .dispatch("users/loadStudents")
      .then(() => {
        console.log("Pobrano userow");
        console.log(this.$store.state.users.users);
      })
      .catch(() => {
        console.log("Nie udalo sie pobrac userow");
      });
  },

  computed: {
    users() {
      let gr = this.$store.state.users.groups.find(
        group => group.name === this.$route.params.name
      );

      // Zwraca liste uzytkownikow nienalezacych do grupy ktorych mozna do niej dodac
      return this.$store.state.users.users.filter(user => {
        return !gr.users.some(
          userOfEditedGroup => user.username === userOfEditedGroup.username
        );
      });
    }
  }
};
</script>

<style scoped>
</style>
