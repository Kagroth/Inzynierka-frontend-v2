<template>
  <div>
    <v-row>
      <v-col>
        <v-btn icon @click="showSearchField = !showSearchField" class="d-inline">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
          <v-text-field
            v-if="showSearchField"
            v-model="searchForName"
            style="width: 20%; position: absolute; "
            class="d-inline-flex ma-0 pa-0"
            placeholder="Podaj nazwe kolokwium"
          ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(test, index) in tests" :key="index" cols="4">
        <v-card>
          <v-hover v-slot:default="{ hover }">
            <v-card-title :class="hover ? 'title-link' : ''" @click="showTestDetails(test)">
              {{ test.title }}
            </v-card-title>
          </v-hover>
          <v-card-subtitle>
            Ilość zadań: {{ test.exercises.length }}
          </v-card-subtitle>
        </v-card>
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
.v-card {
  cursor: default;
}

.title-link {
  cursor: pointer;
  color: lightblue;
}
</style>
