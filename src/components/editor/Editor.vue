<template>
  <div style="height: 100%">
    <!-- Gorne menu z zadaniami oraz przyciskiem 'Uruchom' -->
    <v-row class="grey darken-3" align="center" style="height: 8%">
      <v-col v-if="task.taskType.name === 'Test'" class="ma-0 pa-0">
        <v-tabs left dark show-arrows v-model="tab" @change="onExerciseTabChange">
          <v-tab v-for="(exercise, index) in tabsExercises" :key="index">
            <v-icon color="blue" left>mdi-language-{{ exercise.language.name.toLowerCase() }}</v-icon>
            {{ exercise.title }}
            <span v-if="tabsSolutionsResults[index].result !== undefined && tabsSolutionsResults[index].result !== null">
              <v-icon right small v-if="tabsSolutionsResults[index].result" color="success">              
                mdi-checkbox-marked-circle               
              </v-icon>
              <v-icon right small v-else color="warning">
                mdi-alert-circle
              </v-icon>
            </span>            
            <v-icon v-else right small>
              mdi-checkbox-blank-circle-outline
            </v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col class="white--text" v-else>
        <v-icon color="blue" left>mdi-language-{{ task.exercise.language.name.toLowerCase() }}</v-icon>
        {{ task.exercise.title }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="pa-0 ma-0 text-right">
        <v-btn color="orange" class="white--text" :loading="sendSolutionLoading" @click="runSolution">
          <v-icon left>mdi-play</v-icon>
          Uruchom
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn color="success" :disabled="isReadyToSave" @click="commitSolutions">
          <v-icon left>mdi-file</v-icon>
          Zapisz
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row style="height: 92%;" class="pt-0 mt-0">
      <!-- KOLOKWIUM -->
      <v-col v-if="task.taskType.name === 'Test'" class="mt-0 mb-0 pt-0 pb-0">
        <v-tabs-items v-model="tab" style="height: 100%;">
          <v-tab-item v-for="(exercise, index) in tabsExercises" :key="`item-${index}`" style="height: 100%;"> 
            <v-row style="max-height: 100%; height: 100%;">
              <v-col class="ma-0 pa-0">
                <v-card tile dark height="100%">
                  <v-card-text>
                    <h3 class="mb-5">Treść zadania:</h3>
                    {{ exercise.content }}
                    <v-divider class="mt-5 mb-5"></v-divider>
                    <h3 class="mb-5">Testy:</h3>
                    <p v-for="(unit_test_arr_elem, index) in exercise.unit_tests" :key="`arr_elem_test-${index}`">
                      Test {{ index + 1 }}: <br>
                      <span v-for="(unit_test_line, idx) in unit_test_arr_elem.content.split('\n')" :key="`test-${idx}`">
                        {{ unit_test_line }}
                      </span>
                    </p>
                    <!--
                    <span v-for="(unit_test_arr_elem, index) in exercise.unit_tests" :key="`arr_elem_test-${index}`">
                      <p v-for="(unit_test, idx) in unit_test_arr_elem.content.split('\n')" :key="`test-${idx}`">
                        {{ unit_test }}
                      </p>
                    </span>
                    -->
                  </v-card-text>
                </v-card>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="8" class="pa-0">
                <v-row style="height: 70%;">
                  <v-col cols="12" class="pt-0 pb-0" style="max-height: 100%;">
                    <v-card dark tile height="100%">
                      <v-card-text style="height: 100%">                        
                        <prism-editor
                          :code="tabsExercisesCodes[index]"
                          v-model="tabsExercisesCodes[index]"
                          :language="tabsExercises[index].language.name.toLowerCase()">
                        </prism-editor>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row style="height: 29.9%;">
                  <v-col cols="12" class="pt-0 pb-0" style="max-height: 100%;">
                    <v-card dark tile style="max-height: 100%; height: 100%; overflow-y: scroll;">
                      <v-card-text>
                        <span>
                          {{ tabsResponseMessages[index] }}
                        </span>
                        <br>
                        <span v-for="(test_r, index) in tabsSolutionsResults[index].test_results" :key="`item-${index}`">
                          {{ test_r }} <br>
                        </span> 
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <!-- CWICZENIE -->
      <v-col v-else class="mt-0 mb-0 pt-0 pb-0">
        <v-row style="max-height: 100%; height: 100%">
          <v-col class="ma-0 pa-0">
            <v-card dark tile height="100%">
              <v-card-text>
                <h3 class="mb-5">Treść zadania:</h3>
                {{ task.exercise.content }}
                <v-divider class="mt-5 mb-5"></v-divider>
                <h3 class="mb-5">Testy: </h3>
                <p v-for="(unit_test_arr_elem, index) in task.exercise.unit_tests" :key="`arr_elem_test-${index}`">
                  Test {{ index + 1 }}: <br>
                  <span v-for="(unit_test_line, idx) in unit_test_arr_elem.content.split('\n')" :key="`test-${idx}`">
                    {{ unit_test_line }} <br>
                  </span>
                </p>
              </v-card-text>
              
            </v-card>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="8" class="pa-0">
            <v-row style="height: 70%">
              <v-col cols="12" class="pt-0 pb-0" style="max-height: 100%;">
                <v-card dark tile height="100%">
                  <v-card-text style="height: 100%">                                    
                    <prism-editor
                      :code="myCode"
                      v-model="myCode"
                      :language="task.exercise.language.name">
                    </prism-editor>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row style="height: 29.9%;">
              <v-col cols="12" class="pt-0 pb-0" style="max-height: 100%;">
                <v-card dark tile style="max-height: 100%; height: 100%; overflow-y: scroll;">
                  <v-card-text>
                    <span>
                      {{ responseMessage }}
                    </span><br>
                    <span v-for="(test_r, index) in testResults" :key="index">
                      {{ test_r }} <br>
                    </span>                    
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-okaidia.css";

import PrismEditor from "vue-prism-editor"

export default {
  props: ["task"],
  
  components: {
    PrismEditor
  },

  data() {
    return {
      tab: 0,
      // wprowadzane po to, aby wyniki testow byly zapisywane dla zadania (zakladki) z ktorej uruchomiono wykonywanie testow
      executionContextTab: 0,
      tabsExercises: [],
      tabsExercisesCodes: [],
      tabsSolutionsResults: [],
      tabsResponseMessages: [],
      myCode: "",
      sendSolutionLoading: false,
      responseMessage: "",
      testResults: null,
      isReadyToSave: true,
    };
  },

  created() {
    console.log(this.task);

    if (this.task.taskType.name === 'Test') {
      this.tabsExercises = this.task.test.exercises
      this.tabsExercisesCodes = this.tabsExercises.map(exercise => {
        if (exercise.language.name === 'Java') {
          return "// Tu wprowadź swój kod"
        }
      })
      this.tabsSolutionsResults = this.tabsExercises.map(exercise => {
        return {
          result: null
        }
      })
    }
    else {
      if (this.task.exercise.language.name === 'Java') {
        this.myCode = "// Tu wprowadź swój kod"
      }
    }
  },

  methods: {
    runSolution () {
      if (this.task.taskType.name === 'Test') {
        if (this.tabsExercisesCodes[this.tab].length === 0) {
          return
        }
      }
      else {
        if (this.myCode.length === 0) {
          return
        }
      }

      this.sendSolutionLoading = true
      this.executionContextTab = this.tab

      let formData = new FormData()

      formData.append('taskPk', this.task.pk)
      formData.append('solutionType', this.task.solutionType.name)

      if (this.task.taskType.name === 'Exercise') {
        formData.append('solution', this.myCode)
      }
      else {
        formData.append('solution', this.tabsExercisesCodes[this.executionContextTab])
        formData.append('exercisePk', this.tabsExercises[this.executionContextTab].pk)
      }

      this.$store.dispatch('tasks/sendSolution', formData).then(response => {
        this.sendSolutionLoading = false
        if (response.status === 200) {
          this.responseMessage = response.data.message
          if (this.task.taskType.name === 'Exercise') {            
            this.testResults = response.data.test_results
            this.isReadyToSave = !response.data.result
          }
          else {
            this.tabsSolutionsResults[this.executionContextTab].test_results = response.data.test_results
            this.tabsSolutionsResults[this.executionContextTab].result = response.data.result
            this.tabsResponseMessages[this.executionContextTab] = response.data.message

            let isNotNull = function (element, index, array) {
              return element.result !== null
            }

            this.isReadyToSave = !this.tabsSolutionsResults.every(isNotNull)
          }
        }
        else {
          if (this.task.taskType.name === 'Exercise') {            
            this.responseMessage = "Nie udalo sie przetestowac kodu"
          }
          else {
            this.tabsResponseMessages[this.executionContextTab] = "Nie udalo sie przetestowac kodu"
          }
        }
      })
    },

    commitSolutions () {
      alert("Twoje odpowiedzi zostaly zapisane")
      this.$router.push({name: 'TaskListing'})
    },

    onExerciseTabChange () {
      console.log('Current exercise: ')
      console.log(this.tabsExercises[this.tab])
    }
  },
};
</script>

<style>
.v-application pre {
  margin: 0;
}

.v-application code, .v-application pre code {
  box-shadow: none;
  -webkit-box-shadow: none;
  font-size: 1em;
  background-color: transparent;
}

.v-application pre code::before {
  content: "";
}

.prism-editor-wrapper {
  height: 100%;
  max-height: 75vh;
}

.prism-editor-wrapper > pre {
  height: 100%;
  max-height: 75vh;
}

</style>