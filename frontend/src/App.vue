<template>
  <NavBar/>
  <BattleField/>
</template>

<script>
import BattleField from './components/BattleField.vue'
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    BattleField,
    NavBar
  }
}
</script>

<style>
#app {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  aspect-ratio: 9/16;
}
html, body {
  margin: 0px;
  padding: 0px;
  height: 100vh;
  width: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
div {
  box-sizing: border-box;
}
</style>
