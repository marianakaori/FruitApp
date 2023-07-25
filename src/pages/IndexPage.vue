<template>
  <q-page class="flex flex-center q-mt-lg">
    <template v-if="showCards">
      <h3 class="titulo">Check the nutritional value of your favorite fruits</h3>
      <div class="filter-container">
        <q-input style="width: 80%;" label="Search a fruit" v-model="searchStr"></q-input>
      </div>
      <div class="filter-container">
        <q-radio v-model="orderStr" val="likes_count" label="Most liked" />
        <q-radio v-model="orderStr" val="alphabetical" label="Alphabetical" />
        <template v-if="orderStr">
          <q-btn style="margin-left: 5px;" round color="primary" icon="filter_list_off" @click="clearOrder"/>
        </template>
      </div>
      <div class="flex-container">
        <fruit-card @likes-updated="updateLikes"
          v-for="fruit in filtered_fruits"
          :key="fruit.id"
          :fruit-obj="fruit"
          :username="username"
          :fruit-likes="fruit.likes"
          :show="fruit.show"
        />
      </div>
    </template>
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
      selectedFruitId: null,
      username: "",
      showCards: false,

      searchStr: "",
      orderStr: "",
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
      supabase.from("frutas").select()
      .then(response => {
        const { data } = response;

        for(let i = 0; i < this.fruits.length; i++){
          const f = this.fruits[i];
          f.likes = data.find((fruta) => fruta.idfruta === f.id);
        }
      });
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
      this.fruits.find((fruta) => fruta.likes.idfruta === fruitId).likes.likes = newLikes;
    },

    clearOrder(){
      this.orderStr = "";
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


  computed: {
      filtered_fruits() {
        const searchStrLower = this.searchStr.toLocaleLowerCase();

        const result = this.fruits.map(f => {
          const fruitNameLower = f.name.toLocaleLowerCase();
          const show = fruitNameLower.match(searchStrLower);
          f['show'] = show;

          return f;
        });

        if (!this.orderStr){
          return result;
        }

        result.sort((a, b) => {
          if (this.orderStr == 'likes_count') {
            return (b.likes.likes.length - a.likes.likes.length);
          } else if (this.orderStr == 'alphabetical') {
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          }
        });

        return result;
      }
	}
};
</script>

<style lang="sass" scoped>
.flex-container
  display: flex
  flex-direction: row
  flex-wrap: wrap
  gap: 15px
  justify-content: center

.filter-container
  display: flex
  width: 100%
  justify-content: center
  margin-bottom: 10px
  
.titulo
  color: $text
  font-size: 30px
  line-height: 2rem
  width: 90%
  text-align: center
</style>
