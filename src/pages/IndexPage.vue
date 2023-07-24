<template>
  <q-page class="flex flex-center">
    <div v-if="showCards">
      <fruit-card @likes-updated="updateLikes"
        v-for="fruit in fruits"
        :key="fruit.id"
        :fruit-obj="fruit"
        :username="username"
        :fruit-likes="frutas.find((fruta) => fruta.idfruta === fruit.id)"
      />
    </div>
    <div v-else>
      <q-input label="Username" v-model="username"></q-input>
      <q-btn @click="mostrarCards">Log in</q-btn>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import FruitCard from "../components/FruitCard.vue";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

export default {
  components: { FruitCard },

  data() {
    return {
      fruits: [],
      frutas: [],
      selectedFruitId: null,
      username: "",
      showCards: false,
    };
  },
  methods: {
    async insereNoBanco(id) {
      try {
        const { data, error } = await supabase
          .from("frutas")
          .insert([{ idfruta: id, likes: [] }]);

        if (error) {
          console.error("Erro na inserção:", error);
        } else {
          console.log("Dados inseridos com sucesso:", data);
        }
      } catch (error) {
        console.error("Erro durante a inserção no banco:", error);
      }
    },
    mostrarCards() {
      if (this.username.trim() !== "") {
        // Mostra os cards ao definir showCards como true
        this.showCards = true;
      } else {
        alert("Please, enter a username.");
      }
    },
    async getFrutas() {
      const { data } = await supabase.from("frutas").select();

      this.frutas = data;
    },
    async verificarEInserirFrutas() {
      for (const fruit of this.fruits) {
        // Verifica se o id já existe no banco de dados Supabase
        const { data, error } = await supabase
          .from("frutas")
          .select("*")
          .eq("idfruta", fruit.id);

        if (error) {
          console.error("Erro ao verificar id no banco:", error);
        } else {
          // Se o id não existir no banco, insere o novo registro com likes vazios
          if (data.length === 0) {
            this.insereNoBanco(fruit.id);
          }
        }
      }
    },
    updateLikes(fruitId, newLikes) {
      this.frutas.find((fruta) => fruta.idfruta === fruitId).likes = newLikes;
    }
  },

  mounted() {
    axios
      .get("http://localhost:9010/api/fruit/all")
      .then((response) => {
        this.fruits = response.data;

        this.verificarEInserirFrutas();
        this.getFrutas();
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  },
};
</script>
