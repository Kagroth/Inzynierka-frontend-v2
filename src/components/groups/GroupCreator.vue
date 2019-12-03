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
            <v-btn color="primary" @click="createGroup">Utwórz</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Wybrani użytkownicy: </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-flex md4 offset-md4 :key="selectedUser" v-for="selectedUser in form.selectedUsers">
                {{ selectedUser.first_name }} {{ selectedUser.last_name }}
            </v-flex>
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
      currentSelectedUser: null,
      form: {
        groupName: '',
        selectedUsers: []
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

    createGroup (event) {
      event.preventDefault()

      if (this.form.groupName === '') {
        alert('Nie podano nazwy grupy')
        return
      }

      this.$store
        .dispatch('users/createGroup', this.form)
        .then(response => {
          let message = response.data.message
          alert(message)

          if (message === 'Grupa została utworzona') {
            this.$router.push('/groups')
          }
        })
        .catch(() => {
          console.log('Nie udalo sie utworzyc grupy')
          alert('Nie udalo sie utworzyc grupy')
        })
    }
  },

  created () {
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
      return this.$store.state.users.users
    }
  }
}
</script>

<style scoped>
</style>
