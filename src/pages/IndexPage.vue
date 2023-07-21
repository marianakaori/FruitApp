<template>
  <q-page class="flex flex-center">
    <fruit-card fruit-name="strawberry"/>
    <fruit-card fruit-name="strawberry"/>
    <fruit-card fruit-name="strawberry"/>
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
    axios.get('https://localhost:9010/api/fruit/all')
      .then((response) => {
        this.fruits = response.data;
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      });
  },
}
</script>
