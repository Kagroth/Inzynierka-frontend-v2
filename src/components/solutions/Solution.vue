<template>
    <div>
        Rozwiazanie <br>
        {{ this.solution }}
    </div>
</template>

<script>
export default {
    data () {
        return {
            solution: ""
        }
    },

    created () {
        console.log(this.$route.params.pks)
        this.$store.dispatch('tasks/getSolution', this.$route.params.pks).then(response => {
            this.solution = response.data.solutionValue
        })
    }
}
</script>