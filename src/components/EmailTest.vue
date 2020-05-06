<template>
    <div>
        <h3>Testowanie tworzenia linkow z przypomnieniem hasla - metoda POST:</h3>
        <br>
        <h5>GET</h5>
        <v-btn @click="getTest" small>Test GET</v-btn>
        <br>
        <br>
        <h5>POST</h5>
        <p v-for="(obj, index) in testing_POST" :key="index">
            <v-btn small @click="runTest(obj.data)">{{ obj.text }}</v-btn>
        </p>
        <h5>PUT</h5>
        <p v-for="(obj, index) in testing_PUT" :key="`${index}-2`">
            <v-btn small @click="putTest(obj.data, obj.hash)">{{ obj.text }}</v-btn>
        </p>
        <v-divider></v-divider>
        <br>
        <h5>GitHub API Test</h5>
        <br>
        <p>
            <v-btn @click="getRepos" small>
                Pobranie repozytoriow
            </v-btn>
        </p>
        <p>
            <v-btn @click="getFilesOfRepo" small>
                Pobranie plikow z repozytorium
            </v-btn>
        </p>
    </div>
</template>

<script>

export default {
    data() {
        return {
            testing_POST: [
                {
                    text: 'Niepoprawny format danych',
                    data: {

                    }
                },
                {
                    text: 'Poprawny format danych, email nie istnieje w bazie',
                    data: {
                        "email": "niematakiego@maila.com"
                    }
                },
                {
                    text: 'Email istnieje',
                    data: {
                        "email": "kamilbania2@gmail.com"
                    }
                }
            ],

            testing_PUT: [
                {
                    text: 'Hash ktory nie istnieje',
                    hash: 'abcdefg',
                    data: {

                    }
                },
                {
                    text: 'Brak wszystkich danych',
                    hash: 'OkUXWZoJ0aIF4Yuo4eprkGFqxRA',
                    data: {
                        "password": "Abcdefgh"
                    }
                },
                {
                    text: 'Rozne hasla',
                    hash: 'OkUXWZoJ0aIF4Yuo4eprkGFqxRA',
                    data: {
                        "password": "Abcdefgh",
                        "password_repeat": "trew"
                    }
                },
                {
                    text: 'Poprawna zmiana hasla',
                    hash: 'OkUXWZoJ0aIF4Yuo4eprkGFqxRA',
                    data: {
                        "password": "qwerty123",
                        "password_repeat": "qwerty123"
                    }
                },                
            ]
        }
    },

    methods: {
        async getTest() {
            let response = await fetch('http://localhost:8000/reset_password/')
            console.log(response)
            console.log(response.json())
        },

        async runTest(data) {
            let response = await fetch('http://localhost:8000/reset_password/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(data)})
        
            console.log(response)

        },

        async putTest(data, hash_str) {
            let response = await fetch('http://localhost:8000/reset_password/' + hash_str, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(data)})
        
            console.log(response)
        },

        async getRepos() {
            let response = await fetch('https://api.github.com/users/Kagroth/repos', {
                method: 'GET'
            })

            let data = await response.json()

            console.log(data)
        },

        async getFilesOfRepo() {
            let response = await fetch('https://api.github.com/repos/Kagroth/NextGenMusic/contents/softwareengineering?ref=master', {
                method: 'GET'
            })

            let data = await response.json()

            console.log(data)
        }
    }
}
</script>