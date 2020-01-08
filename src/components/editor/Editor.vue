<template>
  <div style="height: 100%">
    <!-- Gorne menu z zadaniami oraz przyciskiem 'Uruchom' -->
    <v-row class="grey darken-3" align="center" style="height: 8%">
      <v-col v-if="task.taskType.name === 'Test'" class="ma-0 pa-0">
        <v-tabs left dark show-arrows v-model="tab" @change="onExerciseTabChange">
          <v-tab v-for="(exercise, index) in tabs_exercises" :key="index">
            <v-icon color="blue" left>mdi-language-{{ exercise.language.name.toLowerCase() }}</v-icon>
            {{ exercise.title }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col class="white--text" v-else>
        <v-icon color="blue" left>mdi-language-{{ task.exercise.language.name.toLowerCase() }}</v-icon>
        {{ task.exercise.title }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="pa-0 ma-0">
        <v-btn color="orange" class="white--text" :loading="sendSolutionLoading" @click="runSolution">
          <v-icon left>mdi-play</v-icon>
          Uruchom
        </v-btn>
      </v-col>
    </v-row>

    <v-row style="height: 92%;" class="pt-0 mt-0">
      <!-- KOLOKWIUM -->
      <v-col v-if="task.taskType.name === 'Test'" class="pt-0 mt-0">
        <v-tabs-items v-model="tab" style="height: 100%;">
          <v-tab-item v-for="(exercise, index) in tabs_exercises" :key="`item-${index}`" style="height: 100%;"> 
            <v-row style="max-height: 100%; height: 100%;">
              <v-col class="ma-0 pa-0">
                <v-card tile dark height="100%">
                  <v-card-text>
                    <h3 class="mb-5">Treść zadania:</h3>
                    {{ exercise.content }}
                    <v-divider class="mt-5 mb-5"></v-divider>
                    <h3 class="mb-5">Testy:</h3>
                    <span v-for="(unit_test_arr_elem, index) in exercise.unit_tests" :key="`arr_elem_test-${index}`">
                      <p v-for="(unit_test, idx) in unit_test_arr_elem.content.split('\n')" :key="`test-${idx}`">
                        {{ unit_test }}
                      </p>
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="8" class="pa-0">
                <v-row style="height: 80%;">
                  <v-col cols="12" class="pt-0 pb-0" style="max-height: 100%;">
                        <prism-editor
                          :code="tabs_exercises_codes[index]"
                          v-model="tabs_exercises_codes[index]"
                          language="java">
                        </prism-editor>
                  </v-col>
                </v-row>
                <v-row style="height: 22%;">
                  <v-col cols="12">
                    <v-card dark height="100%">
                      <v-card-text>
                        <span v-for="(test_r, index) in tabs_solutions_results[index]" :key="`item-${index}`">
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
      <v-col v-else>
        <v-row style="max-height: 100%; height: 100%">
          <v-col class="ma-0 pa-0">
            <v-card dark height="100%">
              <v-card-text>
                <h3 class="mb-5">Treść zadania:</h3>
                {{ task.exercise.content }}
                <v-divider class="mt-5 mb-5"></v-divider>
                <h3 class="mb-5">Testy: </h3>
                <span v-for="(unit_test_arr_elem, index) in task.exercise.unit_tests" :key="`arr_elem_test-${index}`">
                  <p v-for="(unit_test, idx) in unit_test_arr_elem.content.split('\n')" :key="`test-${idx}`">
                    {{ unit_test }}
                  </p>
                </span>
              </v-card-text>
              
            </v-card>
          </v-col>
          <v-col cols="8" class="pt-0">
            <v-row style="height: 80%">
              <v-col cols="12" class="pt-0 pb-0" style="max-height: 100%;">                
                    <prism-editor
                      :code="myCode"
                      v-model="myCode"
                      language="py">
                    </prism-editor>
              </v-col>
            </v-row>
            <v-row style="height: 23%">
              <v-col cols="12">
                <v-card dark height="100%">
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
      tabs_exercises: [],
      tabs_exercises_codes: [],
      tabs_solutions_results: [],
      myCode: "def myFun(a, b):\n\treturn a + b",
      sendSolutionLoading: false,
      responseMessage: "",
      testResults: null,
    };
  },

  created() {
    console.log(this.task);
    if (this.task.taskType.name === 'Test') {
      this.tabs_exercises = this.task.test.exercises
      this.tabs_exercises_codes = this.tabs_exercises.map(exercise => "")
      this.tabs_solutions_results = this.tabs_exercises.map(exercise => "")
    }
  },

  methods: {
    // Obsługa tabulacji w edytorze
    editorInputChange(index=null, event) {
      //event.target.selectionStart = event.target.selectionStart + 5
      console.log(event)
      console.log(index)    
      console.log(event.target.selectionStart)  
      let start = event.target.selectionStart
      let end = event.target.selectionEnd
      
      if (index !== null) {
        let val = this.tabs_exercises_codes[index]
        console.log(val)

        this.tabs_exercises_codes[index] = val.substring(0, start) + '\t' + val.substring(end) 
      }
      else {
        let val = this.myCode

        this.myCode = val.substring(0, start) + '\t' + val.substring(end);
      }
      
      event.target.selectionStart = event.target.selectionEnd = start + 1
      event.preventDefault()

      this.$forceUpdate()
    },

    runSolution () {
      if (this.myCode.length === 0) {
        return 
      }

      this.sendSolutionLoading = true

      let formData = new FormData()

      formData.append('taskPk', this.task.pk)
      formData.append('solutionType', this.task.solutionType.name)

      if (this.task.taskType.name === 'Exercise') {
        formData.append('solution', this.myCode)
      }
      else {
        formData.append('solution', this.tabs_exercises_codes[this.tab])
        formData.append('exercisePk', this.tabs_exercises[this.tab].pk)
      }

      this.$store.dispatch('tasks/sendSolution', formData).then(response => {
        this.sendSolutionLoading = false
        if (response.status === 200) {
          this.responseMessage = response.data.message
          if (this.task.taskType.name === 'Exercise') {            
            this.testResults = response.data.test_results
          }
          else {
            this.tabs_solutions_results[this.tab] = response.data.test_results
          }
        }
      })
    },

    onExerciseTabChange () {
      console.log('Current exercise: ')
      console.log(this.tabs_exercises[this.tab])
    }
  }
};
</script>

<style>
.v-application pre {
  margin: 0;
}

.v-application code, .v-application pre code {
  box-shadow: none;
  -webkit-box-shadow: none;
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