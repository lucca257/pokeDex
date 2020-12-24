<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <h2>{{name}}</h2>
      <q-img :src="url" width="250px"/>
    </div>
    <div class="row justify-around full-width">
      <div class="row">
        <q-input filled v-model="search" label="Encontre o seu pokemon" />
      <q-btn color="purple" label="Pesquisar" @click="getPokemon()" />
      </div>
    </div>
    <div class="row justify-between absolute full-width container-arrows">
      <q-icon
        name="far fa-arrow-alt-circle-left"
        color="purple"
        class="q-ml-sm cursor-pointer"
        size="50px"
        @click="getPokemon(id - 1)"
      >
        <q-tooltip>
          anterior
        </q-tooltip>
      </q-icon>
      <q-icon
        name="far fa-arrow-alt-circle-right"
        color="purple"
        class="q-ml-sm cursor-pointer"
        size="50px"
        @click="getPokemon(id + 1)"
      >
        <q-tooltip>
          próximo
        </q-tooltip>
      </q-icon>
    </div>
  </q-page>
</template>

<script>
import api from '../services/api'
export default {
  name: 'PageIndex',

  data(){
    return {
      name: '',
      url: '',
      id: 0,
      search: ''
    }
  },

  async beforeMount(){
    await this.getPokemon(1)
  },

  methods: {
    async getPokemon(id){
      const search = id ? id : this.search
      await api.get(`/pokemon/${search}`)
      .then(response => {
        const {name, sprites, id} = response.data
        this.triggerPositive ()
        this.name = name
        this.url = sprites.other.dream_world.front_default
        this.id = id
        this.search = ""
      })
      .catch(error => {
        this.triggerNegative ()
      })
    },

    triggerPositive () {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Pokemon encontrado`
      })
    },

    triggerNegative () {
      this.$q.notify({
        type: 'negative',
        position: 'top',
        message: `Oops, ocorreu um erro. Tente novamente!`
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.container-arrows {

}
</style>
