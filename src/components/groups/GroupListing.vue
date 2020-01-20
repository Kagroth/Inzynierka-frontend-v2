<template>
  <div>
    <v-row>
      <v-col>
        <v-btn icon @click="showSearchField = !showSearchField" class="d-inline">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-expandable-x-transition>          
          <v-text-field
            v-if="showSearchField"
            v-model="searchForName"
            style="width: 20%; position: absolute; "
            class="d-inline-flex ma-0 pa-0"
            placeholder="Podaj nazwe grupy"
          ></v-text-field>
        </v-expandable-x-transition>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" v-for="group in groups" :key="group.pk" class="pa-1">
        <v-card tile>
          <v-card-title @click="showGroupDetails(group)" link>{{ group.name }}</v-card-title>
          <v-card-subtitle>Liczba czlonkow: 
            <v-icon small>mdi-account</v-icon>
            {{ group.users.length }} <br>
            Aktywne zadania:
            <v-icon small>mdi-calendar</v-icon>
            {{ group.activeTasks.length }}
            
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import Group from '@/components/groups/Group'

export default {
  components: {
    //group: Group
  },

  data() {
    return {
      showSearchField: false,
      searchForName: ""
    };
  },

  methods: {    
    showGroupDetails(group) {
      this.$router.push({
        name: "GroupDetails",
        params: { name: group.name, group: group }
      });
    }
  },

  computed: {
    groups: {
      get() {        
        if (this.searchForName === "") {
          return this.$store.state.users.groups;
        }

        return this.$store.state.users.groups.filter(group => {
          return group.name.includes(this.searchForName)
        })
      },

      set(newValue) {}
    },

    userType: {
      get() {
        return this.$store.state.auth.profile.userType;
      },

      set(newValue) {}
    }
  },

  created() {
    this.$store
      .dispatch("users/loadGroups")
      .then(() => {
        this.groups = this.$store.state.users.groups;
      })
      .catch(error => {
        console.log(error);
        console.log("Nie udalo sie pobrac grup");
        alert("Nie udalo sie zwrocic grup");
      });
  }
};
</script>

<style scoped>
</style>
