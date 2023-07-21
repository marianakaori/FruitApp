<template>
  <q-page class="flex flex-center">
    <fruit-card fruit-name="strawberry"/>
    <fruit-card fruit-name="strawberry"/>
    <fruit-card fruit-name="strawberry"/>
  </q-page>
</template>

<script>
import FruitCard from "../components/FruitCard.vue";

export default {
  data () {
    return {
      tab: 'image',
    }
  },

  components: { FruitCard },
}
</script>
