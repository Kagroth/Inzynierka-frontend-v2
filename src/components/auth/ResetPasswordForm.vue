<template>
    <div>
        <v-snackbar v-model="snackbar.show" top :color="snackbar.color" :timeout="0">
            {{ snackbar.message }}
            <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
            </v-snackbar>
        <v-container>
            <v-row v-if="loading" justify="center">
                <v-col cols="1">
                    <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
                </v-col>
            </v-row>
            <v-row v-else justify="center">
                <v-col cols="7">
                    <v-card v-if="response_status_code === 200">
                        <v-card-title>{{ response_message }} dla konta: {{ email }}</v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field type="password" v-model="form.password" label="Nowe haslo" outlined></v-text-field>
                                <v-text-field type="password" v-model="form.passwordRepeat" label="Powtórz nowe haslo" outlined></v-text-field>
                                <v-btn @click="sendChangePasswordRequest" color="primary" :loading="sendButtonLoading" :disabled="sendButtonLoading">Zapisz hasło</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                    <v-card v-else-if="[400, 406, 500].includes(response_status_code)">
                        <v-card-title>
                            {{ response_message }}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

import {required, sameAs, minLength} from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            loading: true,
            sendButtonLoading: false,
            
            response_status_code: "",
            response_message: "",
            email: "",

            snackbar: {
                show: false,
                color: "",
                message: ""
            },

            form: {
                password: "",
                passwordRepeat: ""
            }
        }
    },

    created() {
        const hash_string = this.$route.params.hash_string

        this.$store.dispatch('auth/verifyResetPasswordHash', hash_string)
            .then(response => {
                this.loading = false

                this.response_status_code = response.status
                this.response_message = response.data.message

                if (response.status === 200) {
                    this.email = response.data.email
                }
            })
            .catch(error => {
                console.log(error)
            })
    },

    methods: {
        sendChangePasswordRequest() {
            if (this.$v.$invalid) {
                this.snackbar.color = "warning";
                this.snackbar.show = true;
                this.snackbar.message = "Niepoprawnie wypelniony formularz";
                return;
            }

            this.sendButtonLoading = true

            this.form.hash_string = this.$route.params.hash_string

            this.$store.dispatch('auth/setNewPassword', this.form)
                .then(response => {
                    this.sendButtonLoading = false

                    if (response.status === 200) {
                        this.snackbar.color = "success"; 
                        this.snackbar.message = response.data.message + ". Nastapi przekierowanie do strony logowania";

                        setTimeout(() => {
                            this.$router.push("/login");
                        }, 2000);
                    }
                    else {
                        this.snackbar.color = "warning";  
                        this.snackbar.message = response.data.message;                      
                    }

                    this.snackbar.show = true;
                    
                })
                .catch(error => {
                    this.sendButtonLoading = false
                })
        }
    },

    validations: {
        form: {
            password: {
                required,
                minLength: minLength(8)
            },

            passwordRepeat: {
                required,
                sameAsPassword: sameAs("password")
            },
        }
    }
}
</script>