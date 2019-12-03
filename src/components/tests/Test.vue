<template>
    <div>
      <v-container>
        <v-row>
          <v-col cols="6">
             <h3>{{ test.title }}</h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <v-btn color="error" @click="deleteTest">Usun</v-btn>
          </v-col>
        </v-row>
        <v-row v-for="(exercise, index) in test.exercises" :key="index">
          <v-col cols="12">
            <h4> Zadanie {{ index + 1 }} </h4>
          </v-col>
          <v-col>
            <exercise :pk="exercise.pk"></exercise>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>
<script>
import Exercise from '@/components/exercises/Exercise'

export default {
  components: {
    'exercise': Exercise
  },

  props: ['pk'],

  methods: {
    deleteTest () {
      this.$store.dispatch('tasks/deleteTest', this.test.pk)
    }
  },

  computed: {
    test () {
      /*
        jeżeli prop 'pk' jest zbindowany, wtedy wyszukaj test o zbindowanym pk
        w przeciwnym przypadku wyszukaj test po parametrze pk z URL
      */
      let filterParam

      if (this.pk === null || this.pk === undefined) {
        filterParam = this.$route.params.pk
      } else {
        filterParam = this.pk
      }

      let contentTest = this.$store.state.tasks.tests.find(test => test.pk === filterParam)

      return contentTest
    }
  }
}
</script>
<style scoped>

</style>
