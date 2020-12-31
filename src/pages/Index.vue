<template>
  <q-page v-if="!details">
    <div class="row justify-around full-width">
      <div class="row q-pa-lg" v-if="!loading">
        <q-input filled v-model="search" label="Find your pokemon" />
        <q-btn color="purple" label="Search" @click="searchPokemon" />
      </div>
    </div>
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card
        v-bind:class="pokemons.length !== 1 ? ' col-11 col-md-2 my-card text-white' : 'col-11 col-md-4 my-card text-white'"
        v-bind:style="{background: pokemon.types[0].color}"
        v-for="(pokemon, pk) in pokemons"
        :key="pk"
        @click="viewDetails(pokemon)">
        <q-card-section vertical align="center">
          <q-img :src="pokemon.url" :ratio="1" width="180px" class="pokemon-img-container"/>
          <div><span class="pokemon-id" style="color: #919191">Nº {{pokemon.id}}</span></div>
          <div class="text-h6">{{pokemon.name}}</div><br>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn v-for="(type,t) in pokemon.types" :key="t" flat color="white" >
            {{type.name}}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="row justify-around full-width">
      <div class="row q-pa-lg" v-if="!loading">
        <q-btn color="purple" label="load more pokemons" @click="morePokemons()"/>
      </div>
    </div>
  </q-page>
  <q-page class="flex" v-else>
    <div class="row gutter items-center">
      <div class="row justify-around full-width">
        <div class="row q-pa-lg" v-if="!loading">
          <q-input filled v-model="search" label="Find your pokemon" />
          <q-btn color="purple" label="Search" @click="searchPokemon" />
        </div>
      </div>
      <div class="col-12 col-md-5 row flex-center">
        <q-icon
          name="far fa-arrow-alt-circle-left"
          class="q-ml-sm cursor-pointer"
          size="50px"
          @click="nextPokemon(details.id - 1)"
          v-bind:style="{color: details.types[0].color}"
        >
          <q-tooltip>
            Previus
          </q-tooltip>
        </q-icon>
        <q-img :src="details.url2" class="pokemon-img" width="100%" style="max-width: 380px;"/>
        <q-icon
          name="far fa-arrow-alt-circle-right"
          class="q-ml-sm cursor-pointer"
          size="50px"
          @click="nextPokemon(details.id + 1)"
          v-bind:style="{color: details.types[0].color}"
        >
          <q-tooltip>
            Next
          </q-tooltip>
        </q-icon>
      </div>
      <div class="col-12 col-md-6">
        <div class="text-h2 text-center">{{details.name}}</div>
        <div class="text-center">
          <q-btn v-for="(type,t) in details.types" :key="t" flat v-bind:style="{color: type.color}" >
            {{type.name}}
          </q-btn>
        </div>
        <p class="text-center">{{details.description}}</p>
        <div class="row flex-center">
          <div class="q-pa-xs" style="width: 220px;" v-for="(stats, st) in details.stats" :key="st">
            <strong>{{stats.stat.name}}</strong>
            <q-linear-progress rounded size="20px" :value="stats.base_stat/170" :buffer="1" color="secondary" class="q-mt-sm">
              <div class="absolute-full flex">
                <q-badge text-color="white" color="secondary" :label="stats.base_stat" />
              </div>
            </q-linear-progress>
          </div>
        </div>
      </div>
      <div class="row col-12">
        <div class="col-12 col-md-2">
          <div class="text-h5">Abilities</div>
          <q-btn
            v-for="(abilitie, a) in details.abilities" :key="a" flat
            v-bind:style="{color: details.types[0].color}">
            <span>{{abilitie.ability.name}}</span>
          </q-btn>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-h5">Family</div>
          <div class="row">
            <q-img :src="evolution.url" :ratio="1" width="100px" v-for="(evolution, e) in details.evolution" :key="e"/>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-h5">Weakness</div>
        </div>
        <div class="col-12 col-md-2">
          <div class="text-h5">Held items</div>
          <div class="row">
            <q-btn v-for="(heldItem, e) in details.myItems" flat>
            <q-img :src="heldItem.url" :alt="heldItem.name" :ratio="1" width="25px"/>
              {{heldItem.name}}
              <q-tooltip>
                {{heldItem.description}}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
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
      details: null,
      tab: 'description'
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
    async pokemonUrl(name) {
      const pokemon = this.pokemons.find(pokemon => pokemon.name === name)
      if(typeof(pokemon) !== "undefined"){
        return pokemon.url
      }
      await this.getPokemon(name)
      const {url} = this.pokemons.find(pokemon => pokemon.name === name)
      return url
    },
    async heldItems(held_items){
      const items = []
      held_items.map(async (info) => {
        const itemInfo = await this.heldItemsInfo(info.item.name)
        items.push(itemInfo)
      })
      return items
    },
    async heldItemsInfo(item){
      return await api.get(`/item/${item}`)
      .then(response => {
        const {sprites, effect_entries} = response.data
        return {
          name: item,
          url: sprites.default,
          description: effect_entries[0].short_effect
        }
      })
      .catch(error => {
        console.error(error)
        this.triggerNegative ()
      })
    },
    async viewDetails (pokemon) {
      await api.get(`/pokemon-species/${pokemon.id}`)
        .then(async (response)=> {
          const {evolution_chain, flavor_text_entries} = response.data
          const evolution = await this.evolutions(evolution_chain.url)
          const heldItems = await this.heldItems(pokemon.held_items)
          this.details = {
            description: flavor_text_entries[0].flavor_text,
            ...pokemon,
            evolution: evolution,
            myItems: heldItems
          }
          console.log(this.details)
        })
        .catch(error => {
          console.error(error)
          this.triggerNegative ()
        })
    },
    async evolutions(evolution_url){
      return await axios.get(evolution_url)
        .then(async response => {
          const {species, evolves_to} = response.data.chain
          const evolution = [
            {
              name: species.name,
              url: await this.pokemonUrl(species.name),
            },
            {
              name: evolves_to[0].species.name,
              url: await this.pokemonUrl(evolves_to[0].species.name),
            },
          ]
          if(typeof(evolves_to[0].evolves_to[0]) !== 'undefined'){
            evolution.push({
              name: evolves_to[0].evolves_to[0].species.name,
              url: await this.pokemonUrl(evolves_to[0].evolves_to[0].species.name),
            })
          }
          return evolution
        })
        .catch(error => {
          console.error(error)
          this.triggerNegative ()
        })
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
        const {name, sprites, id, types, height, weight, abilities, stats, held_items} = response.data
        const info = {
          name: name,
          id: id,
          url: sprites.front_default,
          url2: sprites.other.dream_world.front_default,
          height: height,
          weight: weight,
          abilities: abilities,
          stats: stats,
          held_items: held_items,
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
      if(this.details !== null){
        this.details = null
        await this.nextPokemon(this.search)
      } else {
        this.pokemons = []
        await this.getPokemon(this.search)
      }
    },
    async nextPokemon(pokemon_id){
      this.showLoading()
      this.details = null
      let pokemon = this.pokemons.find(pokemon => pokemon.id == pokemon_id)
      if(typeof(pokemon) === "undefined"){
        await this.getPokemon(pokemon_id)
        pokemon = this.pokemons.find(pokemon => pokemon.id == pokemon_id)
      }
      await this.viewDetails(pokemon)
    },
    showLoading () {
      this.loading = true
      this.$q.loading.show({
        message: '<b>Loading</b> pokemon data.<br/><span class="text-primary">wait ...</span>'
      })
      // hiding in 3s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
        this.loading = false
      }, 2000)
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
.pokemon-id {
  margin-top: 10px;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 1.1rem;
  background: rgba(0, 0, 0, 0.2);
  color: #fff !important;
}
.pokemon-img-container {
  background-color: rgb(255 255 255 / 42%);
  border-radius: 50%;
  margin-bottom: 10px;
}
.pokemon-img {
  @media (min-width: 481px) and (max-width: 767px) {
    width: 350px!important;
  }
  @media (min-width: 361px) and (max-width: 480px) {
    width: 240px!important;
  }
  @media (min-width: 320px) and (max-width: 360px) {
    width: 180px!important;
  }
}
</style>
