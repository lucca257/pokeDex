<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card class="col-11 col-md-2 my-card bg-grey-1" v-for="(pokemon, pk) in pokemons" :key="pk">
      <q-card-section vertical align="center">
        <div class="text-h6">{{pokemon.name}}</div><br>
        <q-img :src="pokemon.url" :ratio="1" width="110px"/>
      </q-card-section>
      <q-card-actions align="around">
      <q-btn v-for="(type,t) in pokemon.types" :key="t" flat style="color: #FF0080">
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
      pokemons: [],
      typesInfo: [
        {
          type: 'grass',
          color: '#78c850'
        },
        {
          type: 'fire',
          color: '#f08030'
        },
        {
          type: 'water',
          color: '#6890f0'
        },
        {
          type: 'bug',
          color: '#b9c64d'
        },
        {
          type: 'normal',
          color: '#b9b993'
        },
        {
          type: 'position',
          color: '#b9b993'
        },
        {
          type: 'flying',
          color: '#b9a6f3'
        },
        {
          type: 'eletric',
          color: '#f9d959'
        },
        {
          type: 'ground',
          color: '#e6cd86'
        },
        {
          type: 'eletric',
          color: '#f9d959'
        },
        {
          type: 'fairy',
          color: '#f1adbd'
        },
        {
          type: 'fighting',
          color: '#cd4d60'
        },
        {
          type: 'psychic',
          color: '#f979a0'
        },
        {
          type: 'rock',
          color: '#c6b360'
        },
        {
          type: 'steel',
          color: '#c6c6d9'
        },
        {
          type: 'ice',
          color: '#ade0e0'
        },
        {
          type: 'ghost',
          color: '#8d79ad'
        },
        {
          type: 'dark',
          color: '#705848'
        },
        {
          type: 'dragon',
          color: '#7038f8'
        },
      ]
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
        console.error(error)
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
          url: sprites.front_default,
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
