<template>
  <q-page class="flex flex-center">
    <div v-if="showCards">
      <fruit-card
        v-for="fruit in fruits"
        :key="fruit.id"
        :fruit-obj="fruit"
        :frutas="frutas"
        :username="username"
      />
    </div>
    <div v-else>
      <q-input label="Nome do Usuario" v-model="username"></q-input>
      <q-btn @click="mostrarCards">Logar</q-btn>
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
      tab: "image",
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
        // Modificamos o objeto para incluir o id fornecido como parâmetro
        const { data, error } = await supabase
          .from("frutas")
          .insert([{ idfruta: id, likes: [] }]);

        if (error) {
          // Se ocorrer um erro, exiba-o no console ou trate-o de acordo com sua necessidade
          console.error("Erro na inserção:", error);
        } else {
          console.log("Dados inseridos com sucesso:", data);
          // Atualize a lista de frutas após a inserção, se necessário
          this.getFrutas();
        }
      } catch (error) {
        // Se ocorrer um erro na execução da consulta
        console.error("Erro durante a inserção no banco:", error);
      }
    },
    mostrarCards() {
      // Verifica se o nome do usuário foi digitado (pode adicionar outras verificações aqui)
      if (this.username.trim() !== "") {
        // Mostra os cards ao definir showCards como true
        this.showCards = true;
      } else {
        alert("Por favor, digite o nome do usuário.");
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
  },

  mounted() {
    this.getFrutas();
    axios
      .get("http://localhost:9010/api/fruit/all")
      .then((response) => {
        this.fruits = response.data;

        // Chama a função para verificar e inserir os novos registros
        this.verificarEInserirFrutas();
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  },
};
</script>
