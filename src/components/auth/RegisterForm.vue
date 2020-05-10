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
                  @input="$v.form.firstname.$touch()"
                  @blur="$v.form.firstname.$touch()"
                  :error-messages="firstnameRules"
                  label="Imię"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="text"
                  v-model="form.lastname"
                  @input="$v.form.lastname.$touch()"
                  @blur="$v.form.lastname.$touch()"
                  :error-messages="lastnameRules"
                  label="Nazwisko"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="text"
                  v-model="form.username"
                  @input="$v.form.username.$touch()"
                  @blur="$v.form.username.$touch()"
                  :error-messages="usernameRules"      
                  label="Nazwa użytkownika"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="email"
                  v-model="form.email"
                  @input="$v.form.email.$touch()"
                  @blur="$v.form.email.$touch()"
                  :error-messages="emailRules"
                  label="Email"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="form.password"
                  @input="$v.form.password.$touch()"
                  @blur="$v.form.password.$touch()"
                  :error-messages="passwordRules"
                  label="Hasło"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="form.passwordRepeat"
                  @input="$v.form.passwordRepeat.$touch()"
                  @blur="$v.form.passwordRepeat.$touch()"
                  :error-messages="passwordRepeatRules"
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
  //alpha,
  alphaNum,
  email,
  helpers
} from "vuelidate/lib/validators";

const polishAlpha = helpers.regex('polishAlpha', /^[a-zA-Z\u0105\u0104\u0107\u0106\u0119\u0118\u0142\u0141\u0144\u0143\u00f3\u00d3\u015b\u015a\u017a\u0179\u017c\u017b]*$/)

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
        polishAlpha
      },

      lastname: {
        required,
        polishAlpha
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

      this.$v.$touch();

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
            ". Nastapi przekierowanie do strony logowania";

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
  },

  computed: {
    firstnameRules() {
      const errors = []

      if (!this.$v.form.firstname.$dirty) return errors

      !this.$v.form.firstname.required && errors.push('Pole jest wymagane')
      !this.$v.form.firstname.polishAlpha && errors.push('Imię może składać się tylko ze znaków alfabetu')

      return errors
    },

    lastnameRules() {
      const errors = []

      if (!this.$v.form.lastname.$dirty) return errors

      !this.$v.form.lastname.required && errors.push('Nazwisko jest wymagane')
      !this.$v.form.lastname.polishAlpha && errors.push('Nazwisko może składać się tylko ze znaków alfabetu')
      
      return errors
    },

    usernameRules() {
      const errors = []

      if (!this.$v.form.username.$dirty) return errors

      !this.$v.form.username.required && errors.push('Nazwa użytkownika jest wymagana')
      !this.$v.form.username.alphaNum && errors.push('Nazwa użytkownika może składać się tylko ze znaków alfanumerycznych')
      !this.$v.form.username.minLength && errors.push('Nazwa użytkownika musi składać się conajmniej z 3 znaków')
      
      return errors                  
    },

    emailRules() {
      const errors = []
      
      if (!this.$v.form.email.$dirty) return errors

      !this.$v.form.email.required && errors.push('Adres email jest wymagany')
      !this.$v.form.email.email && errors.push('Niepoprawny adres email')
      
      return errors
    },

    passwordRules() {
      const errors = []

      if (!this.$v.form.password.$dirty) return errors

      !this.$v.form.password.required && errors.push('Hasło jest wymagane')
      !this.$v.form.password.minLength && errors.push('Hasło musi składać się conajmniej z 8 znaków')
      
      return errors
    },

    passwordRepeatRules() {
      const errors = []
      
      if (!this.$v.form.passwordRepeat.$dirty) return errors

      !this.$v.form.passwordRepeat.required && errors.push('Wprowadź ponownie hasło')
      !this.$v.form.passwordRepeat.sameAsPassword && errors.push('Hasła się różnią')

      return errors
    }
  }
};
</script>

<style scoped>
</style>
