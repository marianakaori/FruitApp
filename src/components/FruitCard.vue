<template>
    <q-card dark bordered class="bg-blue-9 fruit-card">
        <q-card-section>
            <div class="text-h6">{{fruitObj.name}}</div>
        </q-card-section>
        <q-tab-panels class="fruit-card-tabs" v-model="tab" animated>
        <q-tab-panel name="image" class="fruit-card-image-panel" @click="toggleTab">
            <q-img class="fruit-image" src="https://www.calgiant.com/wp-content/uploads/2021/03/berry-hero-strawberry-individual.png" alt="Strawberry"/>
        </q-tab-panel>

        <q-tab-panel name="nutritions" class="fruit-card-nutritions-panel" @click="toggleTab">
            <q-list>
            <q-item>
                <q-item-section avatar>
                <q-icon style="color: gray;" name="fastfood" />
                </q-item-section>
                <q-item-section>
                <q-item-label>Calories</q-item-label>
                <q-item-label caption>{{fruitObj.nutritions.calories}}</q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                <q-icon style="color: #FFB24E;" name="fa-solid fa-bread-slice" />
                </q-item-section>
                <q-item-section>
                <q-item-label>Carbohydrates</q-item-label>
                <q-item-label caption>{{fruitObj.nutritions.carbohydrates}}</q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                <q-icon style="color: #EE4A8F;" name="fa-solid fa-ice-cream" />
                </q-item-section>
                <q-item-section>
                <q-item-label>Sugar</q-item-label>
                <q-item-label caption>{{fruitObj.nutritions.sugar}}</q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                <q-icon color="brown" name="fa-solid fa-drumstick-bite" />
                </q-item-section>
                <q-item-section>
                <q-item-label>Protein</q-item-label>
                <q-item-label caption>{{fruitObj.nutritions.protein}}</q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                <q-icon color="amber" name="fa-solid fa-cheese" />
                </q-item-section>
                <q-item-section>
                <q-item-label>Fat</q-item-label>
                <q-item-label caption>{{fruitObj.nutritions.fat}}</q-item-label>
                </q-item-section>
            </q-item>
            </q-list>
        </q-tab-panel>
        </q-tab-panels>
        <q-card-actions align="right">
            <q-btn flat round :color="favoriteColor" icon="favorite" @click="toggleFavorite"/>
        </q-card-actions>
    </q-card>
</template>

<script>
  export default {
      props: {
        fruitObj: undefined,
      },
    data () {
        return {
            tab: 'image',
            favorite: false,
            favoriteColor: 'white',
        }
    },
    methods: {
      toggleTab () {
        if (this.tab == 'image') {
            this.tab = 'nutritions';
        } else {
            this.tab = 'image'
        }
      },
      toggleFavorite () {
        this.favorite = !this.favorite
        if (this.favorite){
            this.favoriteColor = 'red'
        }else{
            this.favoriteColor = 'white'
        }
      },
    },
  }
</script>

<style lang="sass" scoped>
.fruit-card
  width: 85%
  margin: 15px 0px
  

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
