<template class="flex">
  <q-card dark bordered class="fruit-card"
  :style="
    `background-color: ${fruitObj.image_info.color};
     display: ${this.show ? 'block' : 'none'};`">  
    <q-card-section class="q-pa-sm flex column">
      <q-btn class="card-buttons"
        flat
        round
        style="margin-bottom:-20px ;"
        :icon="favorite? 'favorite' : 'favorite_border'"
        @click="toggleFavorite"
      />
      <div class="text-h5 fruit-name">{{ fruitObj.name }}</div>
    </q-card-section>
    <q-tab-panels class="fruit-card-tabs" v-model="tab" animated >
      <q-tab-panel
        name="image"
        class="fruit-card-image-panel"
        :style="`background-color: ${fruitObj.image_info.color}`"
        @click="toggleTab"
      >
        <q-img
          class="q-ma-lg fruit-image"
          :src="fruitObj.image_info.url"
          :alt="fruitObj.name"
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
              }} cal</q-item-label>
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
              }} g</q-item-label>
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
              }} g</q-item-label>
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
              }} g</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="amber" name="fa-solid fa-cheese" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Fat</q-item-label>
              <q-item-label caption>{{ fruitObj.nutritions.fat }} g</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
    <q-card-actions class="justify-between q-py-sm q-pl-md">
      <div class="text-h6 clickable-text fruit-likes" @click="showLikes">
        {{ fruitLikes.likes.length }} {{ fruitLikes.likes.length == 1 ? ' Like' : ' Likes'}}
      </div>
      <q-btn class="card-buttons"
        flat
        round
        :icon="(this.tab == 'image') ? 'info_outline' : 'o_image'"
        @click="toggleTab"
      />
    </q-card-actions>
  </q-card>
  <!-- Modal para exibir os likes -->
  <q-dialog v-model="showModal">
    <q-card>
      <q-card-section style="padding: 16px 16px; width: 200px;">
        <h5 style="color: #220343; margin-top: 16px;" class="q-mb-md">Liked by</h5>
        <div class="liked-by" v-for="like in fruitLikes.likes" :key="like">{{ like }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn style="background: #ead8f2; color: #220343 "  label="Close" v-close-popup />
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
    show: undefined,
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
  border-radius: 18px
  max-width: 250px
  min-width: 220px

.fruit-card-image-panel
  display: flex
  justify-content: center
  align-items: center
  padding: 0
  min-width: 220px

.fruit-card-nutritions-panel
  color: black

.fruit-image
    width: 100%

.fruit-card-tabs
    width: 100%

.fruit-name
  font-weight: bold
  align-self: center
  padding: 10px

.card-buttons
  align-self: end

.liked-by
  color: $text
  border-top: 1px solid pink

.liked-by:last-child
  border-bottom: 1px solid pink
</style>
