<template>
  <div style="height: 100%;">
    <v-row style="height: 8%;" class="grey darken-3" align="center">
      <v-col v-if="task.taskType.name === 'Test'" class="ma-0 pa-0">
        <v-tabs left dark show-arrows v-model="tabs">
          <v-tab v-for="(exercise, index) in task.test.exercises" :key="index">
            <v-icon color="blue" left> mdi-language-{{ exercise.language.name.toLowerCase() }} </v-icon>
            {{ exercise.title }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col class="white--text" v-else> 
        <v-icon color="blue" left> mdi-language-{{ task.exercise.language.name.toLowerCase() }} </v-icon>
        {{ task.exercise.title }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="pa-0 ma-0">
        <v-btn color="orange" class="white--text">
          <v-icon left>mdi-play</v-icon>Uruchom
        </v-btn>
      </v-col>
    </v-row>

    <v-row style="height: 92%;">
      <!-- KOLOKWIUM -->
      <v-col v-if="task.taskType.name === 'Test'">
        <v-tabs-items v-model="tabs">
          <v-tab-item v-for="(exercise, index) in task.test.exercises" :key="`item-${index}`">
            <v-row>
              <v-col class="ma-0 pa-0">
                <v-card dark height="100%">
                  <v-card-text>
                    {{ exercise.content }}
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="8" class="mt-0 pt-0" style="height: 100%;">
                <v-row style="height: 80%;">
                  <v-col cols="12" class="pt-0 pb-0" style="height: 100%; position: relative">
                    <v-card dark>
                      <v-card-text>
                        <v-textarea rows="25" style="height: 100%;"></v-textarea>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row style="height: 22%;">
                  <v-col cols="12">
                    <v-card dark height="100%">
                      <v-card-text>
                        Tu będą wyświetlane testy i ich wyniki
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
                {{ task.exercise.content }}
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
                    <textarea rows="25" cols="100" v-model="myCode" v-on:keydown.tab="editorInputChange"></textarea>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row style="height: 22%;">
              <v-col cols="12">
                <v-card dark height="100%">
                  <v-card-text>
                    Tu będą wyświetlane testy i ich wyniki
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
      tabs: null,
      myCode: "function mojaFunkcja(a, b) {\n \treturn a + b\n}"
    };
  },

  created() {
    console.log(this.task);
  },

  methods: {
    // Obsługa tabulacji w edytorze
    editorInputChange (e) {
      if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var val = this.myCode,
                start = e.target.selectionStart,
                end = e.target.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.myCode = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            e.target.selectionStart = e.target.selectionEnd = start + 1;

            // prevent the focus lose
            e.preventDefault()

        }	
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