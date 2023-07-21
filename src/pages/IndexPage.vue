<template>
  <q-page class="flex flex-center">
    <fruit-card 
      v-for="fruit in fruits"
        :key = "fruit.id"
        :fruit-obj="fruit"
    />
  </q-page>
</template>

<script>
import axios from 'axios';
import FruitCard from "../components/FruitCard.vue";

export default {
  components: { FruitCard },
  
  data () {
    return {
      tab: 'image',
      fruits: []
    }
  },

  mounted() {
    axios.get('http://localhost:9010/api/fruit/all')
      .then((response) => {
        this.fruits = response.data;
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      });
  },
}
</script>
