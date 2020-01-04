<template>
  <div style="height: 100%;">
    <!-- Gorne menu z zadaniami oraz przyciskiem 'Uruchom' -->
    <v-row style="height: 8%;" class="grey darken-3" align="center">
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

    <v-row style="height: 92%;">
      <!-- KOLOKWIUM -->
      <v-col v-if="task.taskType.name === 'Test'">
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(exercise, index) in tabs_exercises" :key="`item-${index}`">
            <v-row>
              <v-col class="ma-0 pa-0">
                <v-card dark height="100%">
                  <v-card-text>{{ exercise.content }}</v-card-text>
                </v-card>
              </v-col>
              <v-col cols="8" class="mt-0 pt-0" style="height: 100%;">
                <v-row style="height: 80%;">
                  <v-col cols="12" class="pt-0 pb-0" style="height: 100%; position: relative">
                    <v-card dark>
                      <v-card-text>
                        <v-textarea rows="25" style="height: 100%;" spellcheck="false" v-model="tabs_exercises_codes[index]"  v-on:keydown.tab="editorInputChange(index, $event)"></v-textarea>
                      </v-card-text>
                    </v-card>
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
        <v-row>
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
          <v-col cols="8" class="pt-0" style="height: 100%;">
            <v-row style="height: 80%;">
              <v-col cols="12" class="pt-0 pb-0" style="height: 100%;">
                <v-card dark>
                  <v-card-text>
                    <!--
                    <pre v-highlightjs="myCode">
                      <code class="language-javascript editor">
                      </code>
                    </pre>
                    <textarea class="textarea-editor" spellcheck="false" v-model="myCode"></textarea> 
                    -->
                    <textarea
                      rows="25"
                      cols="100"
                      spellcheck="false"
                      v-model="myCode"
                      v-on:keydown.tab="editorInputChange(null, $event)"
                    ></textarea>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row style="height: 22%;">
              <v-col cols="12">
                <v-card dark height="100%">
                  <v-card-text>
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
export default {
  props: ["task"],

  data() {
    return {
      tab: 0,
      tabs_exercises: [],
      tabs_exercises_codes: [],
      tabs_solutions_results: [],
      myCode: "def myFun(a, b):\n\treturn a + b",
      sendSolutionLoading: false,
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
/*
textarea, code {
  width: 100%;
		height: auto;
		min-height: 500px;
		
    border: 0;
		
    position: absolute;
		top: 0;
		left: 0;
		
    margin: 0;
		padding: 20px !important;
		
    font-size: 14px;
		font-family: Consolas,Liberation Mono,Courier,monospace;
		line-height: 21px;
		
    overflow: visible;
		
    transition: all 0.5s ease-in-out;
}

.textarea-editor {
background: transparent !important;
		z-index: 2;
		height: auto;
		resize: none;
		color: black;
    text-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
		-webkit-text-fill-color: transparent;
}

code{
		z-index: 1;
    background-color: black;
	}
*/
</style>