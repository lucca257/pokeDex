<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card class="col-11 col-md-2 my-card bg-purple text-white" v-for="(pokemon, pk) in pokemons" :key="pk">
      <q-card-section>
        <div class="text-h6">{{pokemon.name}}</div>
        <q-img :src="pokemon.url" :ratio="1" width="40px"/>
      </q-card-section>
      <q-card-actions>
      <q-btn v-for="(type,t) in pokemon.types" :key="t" flat>
        {{type}}
      </q-btn>
      </q-card-actions>
    </q-card>
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
      id: null,
      search: '',
      pokemons: []
    }
  },

  async beforeMount(){
    await this.listPokemons()
    //await this.getPokemon(1)
  },

  methods: {
    async listPokemons(){
      await api.get(`/pokemon?offset=0&limit=50`)
      .then(response => {
        const pokemons = response.data.results
        pokemons.map(async (pokemon) => {
          await this.getPokemon(pokemon.name)
        })
      })
      .catch(error => {
        this.triggerNegative ()
      })
      //console.log(this.pokemons)
    },
    async getPokemon(search){
      await api.get(`/pokemon/${search}`)
      .then(response => {
        const {name, sprites, id, types} = response.data
        const info = {
          name: name,
          id: id,
          url: sprites.other.dream_world.front_default,
          types: types.map(type => {
            return type.type.name
          })
        }
        this.pokemons.push(info)
      })
      //this.pokemons.sort()
      .catch(error => {
        console.log(error)
        this.triggerNegative ()
      })
    },

    triggerPositive () {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        delay: 3000,
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
