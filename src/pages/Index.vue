<template>
  <q-page class="flex flex-center">
    <div class="row q-pa-sm">
      <q-input filled v-model="search" label="Encontre o seu pokemon" />
      <q-btn color="purple" label="Pesquisar" @click="getPokemon()" />
    </div>
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card class="col-11 col-md-2 my-card bg-grey-1" v-for="(pokemon, pk) in pokemons" :key="pk">
      <q-card-section vertical align="center">
        <div class="text-subtitle2 float-left">{{pokemon.id}}</div>
        <div class="text-h6">{{pokemon.name}}</div><br>
        <q-img :src="pokemon.url" :ratio="1" width="110px"/>
      </q-card-section>
      <q-card-actions align="around">
      <q-btn v-for="(type,t) in pokemon.types" :key="t" flat v-bind:style="{color: type.color}" >
        {{type.name}}
      </q-btn>
      </q-card-actions>
    </q-card>
      <q-btn class="q-mr" color="purple" label="carregar mais pokemons" @click="morePokemons()" />
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
          type: 'poison',
          color: '#a040a0'
        },
        {
          type: 'flying',
          color: '#b9a6f3'
        },
        {
          type: 'electric',
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
      ],
      offset:0,
      limit:50
    }
  },

  async beforeMount(){
    await this.listPokemons()
    //await this.getPokemon(1)
  },

  methods: {
    async listPokemons(){
      await api.get(`/pokemon?offset=${this.offset}&limit=${this.limit}`)
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
            const info = this.typesInfo.find(t => t.type === type.type.name)
            return {
              name: type.type.name,
              color: info.color
            }
          })
        }
        this.pokemons.push(info)
      })
       this.pokemons.sort((a, b) => (a.id > b.id) ? 1 : -1)
      .catch(error => {
        console.log(error)
        this.triggerNegative ()
      })
    },
    async morePokemons(){
      this.offset += {...this.limit}
      this.limit += 50
      await this.listPokemons()
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
