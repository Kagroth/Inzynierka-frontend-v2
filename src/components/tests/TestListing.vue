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
            placeholder="Podaj nazwe kolokwium"
          ></v-text-field>
        </v-expandable-x-transition>
      </v-col>
    </v-row>
    <v-row v-for="(test, index) in tests" :key="index">
      <v-col>
        <h3>{{ test.title }}</h3>
      </v-col>
      <v-col>
        <v-btn @click="showTestDetails(test)" color="primary" small>Szczegóły</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSearchField: false,
      searchForName: ""
    };
  },

  created() {
    this.$store.dispatch("tasks/getAllTests");
  },

  methods: {
    filterTestsByName(testArray) {
      if (this.searchForName === "") {
        return testArray;
      }

      return testArray.filter(test => {
        return test.title.includes(this.searchForName);
      });
    },

    showTestDetails(test) {
      this.$router.push({
        name: "TestDetails",
        params: { pk: test.pk }
      });
    }
  },

  computed: {
    tests() {
      return this.filterTestsByName(this.$store.state.tasks.tests);
    }
  }
};
</script>

<style scoped>
</style>
