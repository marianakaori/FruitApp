<template class="flex">
  <q-card dark bordered class="bg-blue-9 fruit-card">
    <q-card-section>
      <div class="text-h6">{{ fruitObj.name }}</div>
    </q-card-section>
    <q-tab-panels class="fruit-card-tabs" v-model="tab" animated>
      <q-tab-panel
        name="image"
        class="fruit-card-image-panel"
        @click="toggleTab"
      >
        <q-img
          class="fruit-image"
          src="https://www.calgiant.com/wp-content/uploads/2021/03/berry-hero-strawberry-individual.png"
          alt="Strawberry"
        />
      </q-tab-panel>

      <q-tab-panel
        name="nutritions"
        class="fruit-card-nutritions-panel"
        @click="toggleTab"
      >
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon style="color: gray" name="fastfood" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Calories</q-item-label>
              <q-item-label caption>{{
                fruitObj.nutritions.calories
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon style="color: #ffb24e" name="fa-solid fa-bread-slice" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Carbohydrates</q-item-label>
              <q-item-label caption>{{
                fruitObj.nutritions.carbohydrates
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon style="color: #ee4a8f" name="fa-solid fa-ice-cream" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sugar</q-item-label>
              <q-item-label caption>{{
                fruitObj.nutritions.sugar
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="brown" name="fa-solid fa-drumstick-bite" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Protein</q-item-label>
              <q-item-label caption>{{
                fruitObj.nutritions.protein
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="amber" name="fa-solid fa-cheese" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Fat</q-item-label>
              <q-item-label caption>{{ fruitObj.nutritions.fat }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
    <q-card-actions class="justify-around q-py-md">
      <!-- Exibe a lista de "likes" dentro de cada card -->
      <div class="text-h6 clickable-text" @click="showLikes">
        Likes: {{ fruitLikes.likes.length }}
      </div>
      <q-btn
        flat
        round
        :color="favorite ? 'red' : 'white'"
        icon="favorite"
        @click="toggleFavorite"
      />
    </q-card-actions>
  </q-card>
  <!-- Modal para exibir os likes -->
  <q-dialog v-model="showModal">
    <q-card>
      <q-card-section>
        <h2 class="q-mb-md">Likes</h2>
        <ul>
          <li v-for="like in fruitLikes.likes" :key="like">{{ like }}</li>
        </ul>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" label="Close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { supabase } from "../lib/supabaseClient";

export default {
  emits: {
    likesUpdated: null,
  },
  props: {
    fruitObj: undefined,
    fruitLikes: undefined,
    username: undefined,
  },
  data() {
    return {
      tab: "image",
      favorite: false,
      showModal: false,
    };
  },
  methods: {
    toggleTab() {
      if (this.tab == "image") {
        this.tab = "nutritions";
      } else {
        this.tab = "image";
      }
    },
    toggleFavorite() {
      this.favorite = !this.favorite;
      const fruitLikesCopy = [...this.fruitLikes.likes]

      if (this.favorite) {
        fruitLikesCopy.push(this.username)
        this.$emit('likesUpdated', this.fruitObj.id, fruitLikesCopy);
        
        this.updateLikes('adicionar');
      } 
      
      else {
        const indiceDelete = fruitLikesCopy.indexOf(this.username);
        if(indiceDelete != -1){
          fruitLikesCopy.splice(indiceDelete, 1);
        }
        this.$emit('likesUpdated', this.fruitObj.id, fruitLikesCopy);

        this.updateLikes('deletar');
      }
    },
    updateLikes(operacao) {
      try {
          // busca os likes da fruta
          supabase
          .from("frutas")
          .select("*")
          .eq("idfruta", this.fruitObj.id)
          .then((response) => {
            const { data, error } = response;
            if (error) {
              console.error("Erro na busca:", error);
            } else {
              const newLikes = data[0].likes;

              // confere se o like deve ser apagado ou adicionado 
              if (operacao === 'deletar'){
                const indiceDelete = newLikes.indexOf(this.username);
                if(indiceDelete != -1){
                  newLikes.splice(indiceDelete, 1);
                }
              } else if (operacao === 'adicionar') {
                newLikes.push(this.username)
              } else {
                return
              }

              // atualiza os likes no banco adicionando ou removendo a curtida atual
              supabase
              .from("frutas")
              .update({ likes: newLikes })
              .eq("idfruta", this.fruitObj.id)
              .then((response) => {
                const { data, error } = response;
                if (error) {
                console.error("Erro na inserção:", error);
                } else {
                  console.log("Dados atualizados com sucesso:", data);
                }
              });
            }
          })
        } catch (error) {
          console.error("Erro durante a atualização no banco:", error);
        }
    },
    checkUserLikes() {
      if(this.fruitLikes.likes.includes(this.username)){
        this.favorite = true;
      }
    },
    showLikes() {
      this.showModal = true;
    },
  },

  mounted() {
    this.checkUserLikes();
  },
};
</script>

<style lang="sass" scoped>
.clickable-text:hover
    cursor: pointer

.fruit-card
  margin: 15px 0px
  border-radius: 18px

.fruit-card-image-panel
  display: flex
  justify-content: center
  align-items: center

.fruit-card-nutritions-panel
  color: black

.fruit-image
    width: 90%

.fruit-card-tabs
    width: 100%
</style>
