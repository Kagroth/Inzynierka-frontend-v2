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
            <v-card-title>Rejestracja</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  type="text"
                  v-model="form.firstname"
                  :rules="[() => !!$v.form.firstname.required || 'Imię jest wymagane', () => !!$v.form.firstname.alpha || 'Imię może składać się tylko ze znaków z alfabetu']"
                  label="Imię"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="text"
                  v-model="form.lastname"
                  label="Nazwisko"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="text"
                  v-model="form.username"
                  label="Nazwa użytkownika"
                  required
                  outlined
                ></v-text-field>
                <v-text-field type="email" v-model="form.email" label="Email" required outlined></v-text-field>
                <v-text-field
                  type="password"
                  v-model="form.password"
                  label="Hasło"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="form.passwordRepeat"
                  label="Powtórz hasło"
                  required
                  outlined
                ></v-text-field>
                <!--
                <v-select
                  :items="userTypes"
                  v-model="form.userType"
                  label="Rodzaj użytkownika"
                  outlined
                ></v-select>
                -->
                <v-btn
                  color="primary"
                  @click="registerUser"
                  class="ma-0"
                  :loading="loading"
                >Utwórz konto</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  required,
  sameAs,
  minLength,
  alpha,
  alphaNum,
  email
} from "vuelidate/lib/validators";

export default {
  data() {
    return {
      userTypes: [
        {
          value: "Student",
          text: "Student"
        },
        {
          value: "Teacher",
          text: "Nauczyciel"
        }
      ],
      loading: false,
      snackbar: {
        show: false,
        color: "",
        message: ""
      },
      form: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        passwordRepeat: "",
        userType: "Student"
      }
    };
  },

  validations: {
    form: {
      firstname: {
        required,
        alpha
      },

      lastname: {
        required,
        alpha
      },

      username: {
        required,
        alphaNum,
        minLength: minLength(3)
      },

      email: {
        required,
        email
      },

      password: {
        required,
        minLength: minLength(8)
      },

      passwordRepeat: {
        required,
        sameAsPassword: sameAs("password")
      },

      userType: {
        required
      }
    }
  },

  methods: {
    registerUser(event) {
      event.preventDefault();

      if (this.$v.$invalid) {
        this.snackbar.color = "warning";
        this.snackbar.show = true;
        this.snackbar.message = "Niepoprawnie wypelniony formularz";
        return;
      }

      this.loading = true;

      console.log("Username in component: " + this.form.username);

      this.$store.dispatch("auth/createUser", this.form).then(response => {
        this.loading = false;
        console.log(response);
        console.log(response.status);

        if (response.status === 200) {
          this.snackbar.color = "success";
          this.snackbar.show = true;
          this.snackbar.message =
            response.data.message +
            " .Nastapi przekierowanie do strony logowania";

          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } else {
          this.snackbar.color = "warning";
          this.snackbar.show = true;
          this.snackbar.message = response.data.message;
        }

        console.log(response);
      });
    }
  }
};
</script>

<style scoped>
</style>
