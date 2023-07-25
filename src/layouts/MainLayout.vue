<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Fruit App
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-img class="absolute-top" src="~assets/Pastel Fruit on Purple 1.png" style="height: 192px;">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="~assets/single_strawberry.jpg">
            </q-avatar>
            <div class="text-weight-bold font-deep-purple">Strawberry</div>
            <div class="font-deep-purple">@username123</div>
          </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: { },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style lang="sass" scoped>

.header
  backgroud-color: $primary
  color: $text
.font-deep-purple
  color: $text

</style>