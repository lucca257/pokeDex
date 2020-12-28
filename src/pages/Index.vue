<template>
  <q-page>
    <div class="row justify-around full-width">
      <div class="row q-pa-lg" v-if="!loading">
        <q-input filled v-model="search" label="Encontre o seu pokemon" />
        <q-btn color="purple" label="Pesquisar" @click="searchPokemon" />
      </div>
    </div>
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card
        v-bind:class="pokemons.length !== 1 ? 'col-11 col-md-2 my-card bg-grey-1' : 'col-11 col-md-4 my-card bg-grey-1'"
        v-for="(pokemon, pk) in pokemons"
        :key="pk"
        @click="viewDetails(pokemon)">
        <q-card-section vertical align="center">
          <q-img :src="pokemon.url" :ratio="1" width="110px"/>
          <div class="text-subtitle2" style="color: #919191">Nº{{pokemon.id}}</div>
          <div class="text-h6">{{pokemon.name}}</div><br>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn v-for="(type,t) in pokemon.types" :key="t" flat v-bind:style="{color: type.color}" >
            {{type.name}}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="row justify-around full-width">
      <div class="row q-pa-lg" v-if="!loading">
        <q-btn color="purple" label="carregar mais pokemóns" @click="morePokemons()"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import api from '../services/api'
import axios from 'axios'
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
      limit:20,
      loading: false,
      details: {}
    }
  },

  async beforeMount(){
    await this.listPokemons()
  },
  beforeDestroy () {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  },
  methods: {
    async viewDetails (pokemon) {
      await api.get(`/pokemon-species/${pokemon.id}`)
        .then(async (response)=> {
          const {evolution_chain, flavor_text_entries} = response.data
          await this.evolutions(evolution_chain.url)
          this.details = {
            description: flavor_text_entries[0].flavor_text
          }
        })
        .catch(error => {
          console.error(error)
          this.triggerNegative ()
        })
    },
    async evolutions(evolution_url){
      await axios.get(evolution_url)
        .then(response => {
          console.log(response.data.id)
        })
        .catch(error => {
          console.error(error)
          this.triggerNegative ()
        })
    },
    showLoading () {
      this.loading = true
      this.$q.loading.show({
        message: '<b>processando</b> dados dos pokemons.<br/><span class="text-primary">Aguarde...</span>'
      })
      // hiding in 3s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
        this.loading = false
      }, 3000)
    },
    async listPokemons(){
      this.showLoading()
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
    },
    async getPokemon(search){
      await api.get(`/pokemon/${search}`)
      .then(response => {
        const {name, sprites, id, types, height, weight, abilities} = response.data
        const info = {
          name: name,
          id: id,
          url: sprites.front_default,
          height: height,
          weight: weight,
          abilities: abilities,
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
      .catch(error => {
        console.log(error)
        this.triggerNegative ()
      })
      this.pokemons.sort((a, b) => (a.id > b.id) ? 1 : -1)
    },
    async morePokemons(){
      if(this.pokemons.length === 1){
        this.pokemons = []
      }
      this.offset += 20
      this.limit += {...this.offset} - 20
      await this.listPokemons()
    },
    async searchPokemon(){
      this.pokemons = []
      await this.getPokemon(this.search)
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
