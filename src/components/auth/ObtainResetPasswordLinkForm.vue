<template>
    <div>
        <v-snackbar v-model="snackbar.show" top :color="snackbar.color" :timeout=0>
          {{ snackbar.message }}
          <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
        </v-snackbar>

        <v-container>
            <v-row justify="center">
                <v-col cols="6">
                    <v-card>
                        <v-card-title>
                    Podaj email do odzyskania hasla
                        </v-card-title>
                        <v-card-text>
                            <v-form>
                                <v-text-field
                                    type="email"
                                    label="Email"
                                    v-model="form.email"
                                    outlined
                                ></v-text-field>
                                <v-btn color="primary" @click="sendObtainLinkRequest" :loading="loading" :disabled="loading">Wyślij</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

import {required, email} from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            loading: false,
            snackbar: {
                show: false,
                color: "",
                message: ""
            },
            form: {
                email: ""
            }
        }
    },

    methods: {
        sendObtainLinkRequest(event) {
            event.preventDefault();
            
            if (this.$v.$invalid) {
                console.log("Niepoprawnie wypelnione pole 'email'")
                return
            }

            this.loading = true

            this.$store.dispatch('auth/obtainResetPasswordLink', this.form)
                .then(response => {
                    this.loading = false

                    if (response.status === 200) {
                        this.snackbar.color = "success";
                        this.snackbar.show = true;
                        this.snackbar.message =
                            response.data.message

                        this.form.email = ""
                    } else {
                        this.snackbar.color = "warning";
                        this.snackbar.show = true;
                        this.snackbar.message = response.data.message;
                        }
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
        },


    },

    validations: {
        form: {
            email: {
                required,
                email
            }
        }
    }
}
</script>