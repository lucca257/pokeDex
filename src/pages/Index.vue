<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <h2>{{name}}</h2>
      <q-img :src="url" :ratio="1" width="250px"/>
    </div>
    <div class="row justify-around full-width">
      <q-input filled v-model="search" label="Encontre o seu pokemon" />
      <q-btn color="purple" label="Pesquisar" @click="getPokemon" />
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
      search: 'ditto'
    }
  },

  async beforeMount(){
    await this.getPokemon()
  },

  methods: {
    async getPokemon(){
      await api.get(`/pokemon/${this.search}`)
      .then(response => {
        const {name, sprites} = response.data
        this.triggerPositive ()
        this.name = name
        this.url = sprites.other.dream_world.front_default
      })
      .catch(error => {
        this.triggerNegative ()
      })
    },

    triggerPositive () {
      this.$q.notify({
        type: 'positive',
        message: `Pokemon encontrado`
      })
    },

    triggerNegative () {
      this.$q.notify({
        type: 'negative',
        message: `Oops, ocorreu um erro. Tente novamente!`
      })
    },
  }
}
</script>
