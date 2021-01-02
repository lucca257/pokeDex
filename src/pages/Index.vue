<template>
  <q-page v-if="!details">
    <form @submit.prevent="">
      <div class="row justify-around full-width">
        <div class="row q-pa-lg" v-if="!loading">
          <q-input filled v-model="search" label="Find your pokemon" />
          <q-btn type="submit" color="purple" label="Search" @click="searchPokemon" />
        </div>
      </div>
    </form>
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
        <q-btn  color="purple" label="load more pokemons" @click="morePokemons()"/>
      </div>
    </div>
  </q-page>
  <q-page class="flex" v-else>
    <div class="row justify-around full-width ">
      <form @submit.prevent="">
        <div class="row q-pa-lg" v-if="!loading">
          <q-input filled v-model="search" label="Find your pokemon" />
          <q-btn type="submit" color="purple" label="Search" @click="searchPokemon" />
        </div>
      </form>
    </div>
    <div class="row gutter items-center">
      <div class="col-12 col-md-6 row flex-center">
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
        <q-img :src="details.url2" class="pokemon-img" width="100%" style="max-width: 400px;"/>
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
      <div class="row col-12 q-pa-lg">
        <div class="col-12 col-md-3">
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
        <div class="col-12 col-md-2">
          <div class="text-h5">Weakness</div>
          <div class="row">
            <q-btn
              v-for="(weakness, w) in details.weakness" :key="w" flat
              v-bind:style="{color: typeColor(weakness.name)}"
            >
              {{weakness.name}}
            </q-btn>
          </div>
        </div>
        <div class="col-12 col-md-1"></div>
        <div class="col-12 col-md-2">
          <div class="text-h5">Held items</div>
          <div class="row">
            <q-btn flat color="secondary" v-if="details.myItems.length === 0">NONE</q-btn>
            <q-btn v-for="(heldItem, h) in details.myItems" :key="h" flat>
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
      offset:0,
      limit:20,
      loading: false,
      details: null,
      colors: {
        grass: "#78c850",
        poison: "#a040a0",
        fire: "#f08030",
        flying: "#b9a6f3",
        water: "#6890f0",
        bug: "#b9c64d",
        normal: "#b9b993",
        electric: "#f9d959",
        ground: "#e6cd86",
        fighting: "#cd4d60",
        psychic: "#f979a0",
        rock: "#c6b360",
        fairy: "#f1adbd",
        steel: "#c6c6d9",
        ice: "#ade0e0",
        ghost: "#8d79ad",
        dark: "#705848",
        dragon: "#7038f8"
      }
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
          const typeWeakness = await Promise.all(pokemon.types.map(async type => {
            return await this.typeWeakness(type.name)
          }))
          let weakness = []
          for (let i = 0; i < typeWeakness.length; i++) {
            weakness.push(...typeWeakness[i].double_damage_from)
          }
          weakness = [...new Map(weakness.map(item => [item['name'], item])).values()]
          this.details = {
            description: flavor_text_entries[0].flavor_text,
            ...pokemon,
            evolution: evolution,
            myItems: heldItems,
            weakness: weakness
          }
        })
        .catch(error => {
          console.error(error)
          this.triggerNegative ()
        })
      //console.log(this.details)
    },
    typeColor(typeName){
      return this.colors[typeName]
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
          ]
          if(evolves_to.length !== 0) {
            evolves_to.map(async e => {
              evolution.push({
                name: e.species.name,
                url: await this.pokemonUrl(e.species.name),
              })
              if(e.evolves_to.length !== 0){
                evolution.push({
                  name: e.evolves_to[0].species.name,
                  url: await this.pokemonUrl(e.evolves_to[0].species.name),
                })
              }
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
    async typeWeakness(type){
      return await api.get(`/type/${type}`)
        .then(response => {
          const {double_damage_from} = response.data.damage_relations
          return {
            double_damage_from
          }
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
              return {
                name: type.type.name,
                color: this.typeColor(type.type.name)
              }
            })
          }
          this.pokemons.push(info)
        })
        .catch(error => {
          console.error(error)
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
      const search = this.search.toLowerCase()
      if(this.details !== null){
        this.details = null
        await this.nextPokemon(search)
      } else {
        await this.getPokemon(search)
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
