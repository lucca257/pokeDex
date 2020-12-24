<template>
  <q-page class="flex flex-center">
  </q-page>
</template>

<script>
import api from '../services/api'
export default {
  name: 'PageIndex',

  beforeMount(){
    api.get('/pokemon')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    })
  }
}
</script>
