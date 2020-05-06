<template>
  <div>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false" text dark>Ok</v-btn>
    </v-snackbar>
    
    <v-container>
      <v-row justify="center">
        <v-col cols="6">
          <v-card>
            <v-card-title>Logowanie</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  type="text"
                  v-model="form.username"
                  label="Nazwa użytkownika"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="form.password"
                  label="Hasło"
                  requried
                  outlined
                ></v-text-field>
                <p>
                  <router-link
                    :to="{name: 'ObtainResetPasswordLink'}"
                  >Odzyskaj hasło</router-link>
                  
                </p>
                <v-btn color="primary" @click="loginUser" :loading="loading" :disabled="disabled">Zaloguj</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      loading: false,
      disabled: false,
      snackbar: {
        show: false,
        color: "",
        message: ""
      },

      form: {
        username: "",
        password: ""
      }
    };
  },

  validations: {
    form: {
      username: {
        required
      },

      password: {
        required
      }
    }
  },

  methods: {
    loginUser(event) {
      event.preventDefault();

      if (this.$v.$invalid) {
        this.snackbar.message = "Nie podano wszystkich danych logowania";
        this.snackbar.color = "warning";
        this.snackbar.show = true;
        return;
      }

      this.loading = true;

      this.$store.dispatch("auth/loginUser", this.form).then(responseData => {
        this.loading = false;

        if (
          responseData.data !== undefined &&
          responseData.data.status === 200
        ) {
          this.disabled = true;
          this.snackbar.message =
            "Pomyslnie zalogowano. Nastąpi przekierowanie";
          this.snackbar.color = "success";
          this.snackbar.show = true;

          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        } else {

          this.snackbar.message = responseData.message;
          this.snackbar.color = "error";
          this.snackbar.show = true;
          return;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
