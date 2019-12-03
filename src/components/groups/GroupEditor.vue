<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field type="text" v-model="form.groupName" label="Nazwa grupy" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Członkowie grupy: </h3>
          </v-col>
        </v-row>
        <v-row :key="index" v-for="(member, index) in contextGroup.users">
          <v-col>
            {{ member.first_name }} {{ member.last_name }}
          </v-col>
          <v-col>
             <v-btn color="error" small @click="removeUserFromGroup(member)">Usun</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Członkowie do usuniecia:</h3>
          </v-col>
        </v-row>
        <v-row :key="index" v-for="(member, index) in form.usersToRemove">
          <v-col>
            {{ member.first_name }} {{ member.last_name }}
          </v-col>
          <v-col>
            <v-btn @click="undoRemove(member)">Cofnij</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Nowi uzytkownicy do dodania </h3>
          </v-col>
        </v-row>
        <v-row :key="index" v-for="(user, index) in form.selectedUsers">
          <v-col>
             {{ user.first_name }} {{ user.last_name }}
          </v-col>
          <v-col>
            <v-btn color="error" small @click="removeSelectedUser(user)">Usun</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select :items="users" v-model="currentSelectedUser">
                <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                    {{ data.item.first_name }} {{ data.item.last_name }}
                </template>
                <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                    {{ data.item.first_name }} {{ data.item.last_name }}
                </template>
            </v-select>
          </v-col>
          <v-col>
            <v-btn color="primary" @click="addUser">Dodaj</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" @click="saveGroupChanges">Zapisz zmiany</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      contextGroup: {},

      currentSelectedUser: null,
      form: {
        pk: '',
        oldName: '',
        groupName: '',
        selectedUsers: [],
        usersToRemove: []
      }
    }
  },

  methods: {
    addUser () {
      if (this.currentSelectedUser === null) {
        return
      }

      if (this.form.selectedUsers.includes(this.currentSelectedUser)) {
        return
      }

      this.form.selectedUsers.push(this.currentSelectedUser)
    },

    removeSelectedUser (user) {
      this.form.selectedUsers = this.form.selectedUsers.filter(selectedUser => selectedUser !== user)
    },

    removeUserFromGroup (user) {
      if (this.form.usersToRemove.includes(user)) {
        return
      }

      this.contextGroup.users = this.contextGroup.users.filter(selectedUser => selectedUser !== user)
      this.form.usersToRemove.push(user)
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
    saveGroupChanges (event) {
      event.preventDefault()

      if (this.form.groupName === '') {
        alert('Nie podano nazwy grupy')
        return
      }

      this.$store
        .dispatch('users/updateGroup', this.form)
        .then(response => {
          let message = response.data.message
          alert(message)

          if (message === 'Grupa została zaktualizowana') {
            this.$router.push('/groups')
          }
        })
        .catch(() => {
          console.log('Nie udalo sie zaktualizowac grupy')
          alert('Nie udalo sie zaktualizowac grupy')
        })
    }
  },

  created () {
    this.contextGroup = this.$store.state.users.groups.find(group => group.name === this.$route.params.name)
    this.form.pk = this.contextGroup.pk
    this.form.groupName = this.contextGroup.name
    this.form.oldName = this.contextGroup.name

    this.$store
      .dispatch('users/loadStudents')
      .then(() => {
        console.log('Pobrano userow')
        console.log(this.$store.state.users.users)
      })
      .catch(() => {
        console.log('Nie udalo sie pobrac userow')
      })
  },

  computed: {
    users () {
      let gr = this.$store.state.users.groups.find(group => group.name === this.$route.params.name)

      // Zwraca liste uzytkownikow nienalezacych do grupy ktorych mozna do niej dodac
      return this.$store.state.users.users.filter(user => {
        return !gr.users.some(userOfEditedGroup => user.username === userOfEditedGroup.username)
      })
    }
  }
}
</script>

<style scoped>
</style>
