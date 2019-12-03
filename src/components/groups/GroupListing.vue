<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h2>Moje Grupy</h2>
        </v-col>
        <v-col v-if="userType.name === 'Teacher'"> 
          <v-btn to="/groups/newGroup" color="success" small>Utwórz grupę</v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row v-for="group in groups" :key="group.pk">
        <v-col> 
          <h3>{{ group.name }}</h3>
        </v-col>
        <v-col>
          <v-btn @click="showGroupDetails(group)" color="primary" small>Szczegóły</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import Group from '@/components/groups/Group'

export default {
  components: {
    //group: Group
  },

  data () {
    return {}
  },

  methods: {
    showGroupDetails (group) {
      this.$router.push({
        name: 'GroupDetails',
        params: { name: group.name, group: group }
      })
    }
  },

  computed: {
    groups: {
      get () {
        return this.$store.state.users.groups
      },

      set (newValue) {}
    },

    userType: {
      get () {
        return this.$store.state.auth.profile.userType
      },

      set (newValue) {}
    }
  },

  created () {
    this.$store
      .dispatch('users/loadGroups')
      .then(() => {
        this.groups = this.$store.state.users.groups
      })
      .catch(error => {
        console.log(error)
        console.log('Nie udalo sie pobrac grup')
        alert('Nie udalo sie zwrocic grup')
      })
  }
}
</script>

<style scoped>
</style>
