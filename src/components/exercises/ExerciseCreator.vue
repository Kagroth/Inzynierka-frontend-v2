<template>
  <div>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
    </v-snackbar>
    <v-form>
      <v-container>
        <v-row justify="center">
          <v-col cols="10">
            <v-card>
              <v-card-title>Tworzenie ćwiczenia</v-card-title>
              <v-card-text>
                <v-text-field outlined type="text" v-model="form.title" label="Tytul" required></v-text-field>
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col>
                    <v-select
                      :items="languages"
                      v-model="form.language"
                      outlined
                      label="Technologia"
                      required
                    >
                      <template slot="item" slot-scope="data">
                        <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                        {{ data.item.name }}
                      </template>
                      <template slot="selection" slot-scope="data">
                        <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                        {{ data.item.name }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      :items="levels"
                      v-model="form.level"
                      outlined
                      label="Poziom zaawansowania"
                      required
                    >
                      <template slot="item" slot-scope="data">
                        <!-- ten slot odpowiada za to jak obiekty sa wyswietlane w liscie -->
                        {{ data.item.name }}
                      </template>
                      <template slot="selection" slot-scope="data">
                        <!-- ten slot odpowiada za to jak wybrany obiekt jest wyswietlany -->
                        {{ data.item.name }}
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-textarea
                      outlined
                      v-model="form.content"
                      label="Tresc zadania"
                      rows="12"
                      requried
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col class="text-center">
                    <h4>Utworz testy jednostkowe</h4>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-btn
                      color="primary"
                      @click="addUnitTest"
                      :disabled="unitTestFormShow()"
                      small
                    >Dodaj test</v-btn>
                    <v-btn icon @click="displayTooltip = !displayTooltip">
                      <v-icon color="accent">mdi-help-circle</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="displayTooltip">
                  <v-col>
                    <span v-if="form.language.name === 'Python'">
                      Aplikacja wykorzystuje bibliotekę 'unittest' do przeprowadzania testów jednostkowych.
                      Poniższy formularz pozwala na zdefiniowanie testów do tego ćwiczenia.
                      Każde z pól formularza odpowiada pojedynczemu testowi jednostkowemu
                      W formularzu należy wpisać asercje lub instrukcje oddzielone znakami nowej linii.
                      <br />Przykładowa metoda:
                      <v-card>
                        <v-card-text>
                          <v-row>
                            <v-col cols="6">
                              <h4>Przykład 1</h4>self.assertEqual(moja_funkcja(1, 1), 2)
                              self.assertEqual(moja_funkcja(2, 2), 4)
                            </v-col>
                            <v-col cols="6">
                              <h4>Przykład 2</h4>mk = MojaKlasa()
                              <br />assertEqual(mk.metoda(), True)
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <br />
                      <a
                        href="https://docs.python.org/3/library/unittest.html#assert-methods"
                      >Link do dostępnych asercji.</a>
                    </span>
                    <span v-else-if="form.language.name === 'Java'">
                      Aplikacja wykorzystuje bibliotekę "JUnit" do przeprowadzania testów jednostkowych.
                      Poniższy formularz pozwala na zdefiniowanie testów do tego ćwiczenia.
                      Każde z pól formularza odpowiada pojedynczemu testowi jednostkowemu
                      W polu formularza należy wpisać asercje lub instrukcje zakończone średnikiem ";"
                      i oddzielone znakiem nowej linii .
                      <br />Przykładowa metoda:
                      <v-card>
                        <v-card-text>
                          <v-row>
                            <v-col cols="6">
                              <h4>Przykład 1</h4>assertEquals(mojaFunkcja(1, 1), 2);
                              assertEquals(mojaFunkcja(2, 2), 4);
                            </v-col>
                            <v-col cols="6">
                              <h4>Przykład 2</h4>MojaKlasa mk = new MojaKlasa();
                              assertEqual(mk.metoda(), true);
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <br />
                      <a
                        href="https://junit.org/junit5/docs/5.0.1/api/org/junit/jupiter/api/Assertions.html"
                      >Link do dostępnych asercji.</a>
                    </span>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row v-for="(unit_test, index) in form.unitTests" :key="index">
                  <v-col cols="10">Test {{ index + 1}}</v-col>
                  <v-col cols="2">
                    <v-btn color="error" small @click="removeUnitTest(index)">
                      Usuń
                      <v-icon right>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      outlined
                      v-model="form.unitTests[index]"
                      required
                      placeholder="Wprowadź asercje"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-right">
                    <v-btn color="primary" @click="createExercise" :loading="loading">Utwórz</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      snackbar: {
        show: false,
        color: "",
        message: ""
      },
      displayTooltip: false,

      levels: [],
      languages: [],
      form: {
        title: "",
        language: "",
        level: "",
        content: "",
        unitTests: []
      }
    };
  },

  methods: {
    createExercise(event) {
      event.preventDefault();

      for (let field in this.form) {
        if (this.form[field] === "") {
          this.snackbar.message = "Nie podano wszystkich danych";
          this.snackbar.color = "warning";
          this.snackbar.show = true;
          return;
        }
      }

      console.log(this.form);

      this.loading = true;

      this.$store
        .dispatch("tasks/createExercise", this.form)
        .then(responseData => {
          console.log(responseData);
          this.loading = false;

          let color = "";

          if (responseData.status === 200) {
            color = "success";
          } else {
            color = "error";
          }

          this.snackbar.message = responseData.data.message;
          this.snackbar.color = color;
          this.snackbar.show = true;

          if (responseData.status === 200) {
            this.form.title = "";
            this.form.language = "";
            this.form.level = "";
            this.form.content = "";
            this.form.unitTests = [];
          }
        });
    },

    addUnitTest(event) {
      event.preventDefault();

      this.form.unitTests.push("");
    },

    removeUnitTest(index) {
      this.form.unitTests.splice(index, 1);
    },

    unitTestFormShow() {
      if (this.languages.includes(this.form.language)) return false;
      else return true;
    }
  },

  created() {
    this.$store.dispatch("tasks/getLanguagesAll").then(responseData => {
      this.languages = responseData;
    });

    this.$store.dispatch("tasks/getLevelsAll").then(responseData => {
      this.levels = responseData;
    });
  }
};
</script>

<style scoped>
</style>
