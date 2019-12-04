<template>
  <div>
    <v-card>
      <v-container>
        <v-row>
          <v-col>
             <v-text-field type="text" v-model="form.title" label="Tytul" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select :items="languages" v-model="form.language" label="Technologia" required>
              <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                    {{ data.item.name }}
                </template>
                <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                    {{ data.item.name }}
                </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select :items="levels" v-model="form.level" label="Poziom zaawansowania" required>
              <template slot="item" slot-scope="data"> <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                    {{ data.item.name }}
                </template>
                <template slot="selection" slot-scope="data"> <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                    {{ data.item.name }}
                </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="form.content"
              label="Tresc zadania"
              rows="12"
              requried>
            </v-textarea>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            Utworz testy jednostkowe
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn color="primary" @click="addUnitTest">Dodaj test</v-btn>
          </v-col>
        </v-row>
        <v-row v-for="(unit_test, index) in form.unitTests" :key="index">
          <v-col>
            <v-textarea
              v-model="form.unitTests[index]"
              required
            >

            </v-textarea>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-col cols="1">
            <v-btn color="primary" @click="createExercise">Utwórz</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      levels: [],
      languages: [],
      form: {
        title: '',
        language: '',
        level: '',
        content: '',
        unitTests: []
      }
    }
  },

  methods: {
    createExercise (event) {
      event.preventDefault()

      for (let field in this.form) {
        if (this.form[field] === '') {
          alert('Nie podano wszystkich danych')
          return
        }
      }

      console.log(this.form)

      this.$store.dispatch('tasks/createExercise', this.form).then(responseData => {
        alert(responseData.message)
      })
    },

    addUnitTest (event) {
      event.preventDefault()

      this.form.unitTests.push("")
    }
  },

  created () {
    this.$store.dispatch('tasks/getLanguagesAll').then(responseData => {
      this.languages = responseData
    })

    this.$store.dispatch('tasks/getLevelsAll').then(responseData => {
      this.levels = responseData
    })
  }
}
</script>

<style scoped>
</style>
