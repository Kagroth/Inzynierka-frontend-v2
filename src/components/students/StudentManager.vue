<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col>Studenci</v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab">
          <v-tab v-for="(item, index) in items" :key="index">{{ item.title }}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, index) in items" :key="`item-${index}`">
            <span v-if="Array.isArray(item.content)">
              <v-list>
                <v-list-item v-for="(student, index) in item.content" :key="index">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title @click="inspectUser(student.pk)">
                      <v-hover v-slot:default="{ hover }">
                        <span
                          :class="hover ? 'title-link' : ''"
                        >{{ student.first_name }} {{ student.last_name }}</span>
                      </v-hover>
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ student.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </span>
            <span v-else>
              <v-row>
                <v-col>Tworzenie studentów</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-row>
                    <v-col>Wyślij email z linkiem rejestracyjnym</v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-form>
                        <v-text-field outlined type="email" label="Email" v-model="email"></v-text-field>
                      </v-form>
                    </v-col>
                    <v-col>
                      <v-btn @click="send_registration_link">Wyślij</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                    <v-row>
                        <v-col>Status użytkowników</v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Tu bedzie lista uzytkownikow ze statusem (utworzyl konto, jeszcze nie utworzone) i przycisk do re sendu maila
                        </v-col>
                    </v-row>
                </v-col>
              </v-row>
            </span>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
      my_students: [],
      all_students: [],
      items: [
        { title: "Moi studenci", content: this.my_students },
        { title: "Wszyscy", content: this.all_students },
        { title: "Zarządzaj", content: "Manage" }
      ],

      email: ""
    };
  },

  created() {
    this.$store.dispatch("users/loadTeachersStudents").then(response => {
      if (response.status === 200) {
        this.my_students = response.data;
        this.items[0].content = this.my_students;
      }
    });

    this.$store.dispatch("users/loadStudents").then(response => {
      if (response.data.status === 200) {
        this.all_students = response.data.data;
        console.log(this.all_students);
        this.items[1].content = this.all_students;
      }
    });
  },

  methods: {
      send_registration_link() {

      }
  }
};
</script>