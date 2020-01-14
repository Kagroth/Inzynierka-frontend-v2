<template>
    <div>
        Rozwiazanie: <br>
        <div v-if="task.taskType.name === 'Exercise'">
            <h4>{{ task.title }}</h4>    
            <span v-for="(solutionLine, index) in task.solution.split('\n')" :key="index">
                {{ solutionLine }} <br>
            </span>
        </div>
        <div v-else>
            <span v-for="(exercise, index) in task.test.exercises" :key="index">
                <h4>{{ exercise.title }}</h4>
                <span v-for="(solutionLine, idx) in exercise.solution.split('\n')" :key="idx">
                    {{ solutionLine }} <br>
                </span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            task: {},
        }
    },

    created () {
        console.log(this.$route.params.pks)
        this.$store.dispatch('tasks/getSolution', this.$route.params.pk).then(response => {
            console.log(response.data)
            console.log(response.data.data.solutionValue)

            this.task = response.data.data.task

            if (this.task.taskType.name === 'Exercise') {
                this.task.exercise.solution = JSON.parse(JSON.stringify(response.data.data.solutionValue))
            }
            else {
                let solutions = response.data.data.solutionValue.map(singleSolution => {
                    return JSON.parse(JSON.stringify(singleSolution))
                })
                console.log(solutions)

                for (let index in this.task.test.exercises) {
                    this.task.test.exercises[index].solution = solutions[index]
                }                
            }            
        })
    }
}
</script>