<template>
  <div>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
    </v-snackbar>
    <v-form>
      <v-container>
        <v-row justify="center">
          <v-col cols="6">
            <v-card>
              <v-card-title>Tworzenie grupy</v-card-title>
              <v-card-text>
                  <v-text-field type="text" v-model="form.groupName" outlined label="Nazwa grupy" required></v-text-field>
                  <v-divider></v-divider>
                  <v-row>
                    <v-col cols="6">
                      <h3 class="text-center">Użytkownicy:</h3>
                      <v-list>
                        <v-list-item v-for="(user, index) in users" :key="`user-${index}`">
                          <v-list-item-content>
                            {{ user.first_name }} {{ user.last_name }}
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-checkbox 
                              v-model="usersList[index]"
                              @change="toggleUser(index, $event)">
                            </v-checkbox>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col cols="6">
                      <h3 class="text-center">Wybrani użytkownicy:</h3>
                      <v-list>
                        <v-list-item v-for="(user, index) in form.selectedUsers" :key="`user-${index}`">
                          <v-list-item-content>
                            {{ user.first_name }} {{ user.last_name }}
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>                   
                    </v-col>                    
                  </v-row>    
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" class="mr-2" @click="createGroup" :loading="loading">Utwórz</v-btn>
              </v-card-actions>
            </v-card>
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
      loading: false,
      snackbar: {
        show: false,
        color: "",
        message: ""
      },
      
      usersList: [],
      
      form: {
        groupName: '',
        selectedUsers: []
      }
    }
  },

  methods: {
    toggleUser (userIndex, event) {
      if (this.usersList[userIndex]) {
        this.form.selectedUsers.push(this.users[userIndex])
      }
      else {
        this.form.selectedUsers = this.form.selectedUsers.filter(user => {
          return user !== this.users[userIndex]
        })
      }
    },

    createGroup (event) {
      event.preventDefault()

      if (this.form.groupName === '') {
        this.snackbar.message = "Nie podano nazwy grupy"
        this.snackbar.color ="warning"
        this.snackbar.show = true
        return
      }

      this.loading = true

      this.$store
        .dispatch('users/createGroup', this.form)
        .then(response => {
          this.loading = false

          let color = ""        

          if (
            response.data !== undefined &&
            response.status === 200) {
              color = "success"  
          }
          else {            
            color = "error"
          }

          this.snackbar.message = response.data.message
          this.snackbar.color = color
          this.snackbar.show = true
          
          if (response.status === 200) {
            this.form.groupName = ""
            this.form.selectedUsers = []
          }
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
