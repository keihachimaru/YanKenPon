<template>
    <div class="container">
        <NavBar :data="user" @openMenu="showMenu=!showMenu"/>
        <Menu :show="showMenu"/>
        <div class="options">
            <NavOption v-for="(option, i) in navOptions" :key="i" :option="option"/>
        </div>
    </div>
  </template>
  
  <script>
  import NavBar from '@/components/NavBar.vue'
  import NavOption from '@/components/NavOption.vue'
  import Menu from '@/components/Menu.vue'
  
  export default {
    name: 'LobbyView',
    components: {
        NavOption,
        NavBar,
        Menu
    },
    data() {
      return {
        showMenu: false,
        user: [],
        navOptions: [
            {name :'Rapid', path: '/match', type: 'rapid'}, 
            {name: 'Slow', path: '/match',  type: 'slow'},
            {name: 'Friends', path: '/friends'}
        ],
      }
    },
    mounted() {

      const userID = localStorage.getItem('userID');
      this.ws = new WebSocket(`ws://localhost:3000?userID=${userID}`);
  
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'initUser') {
          this.user = {
            id: data.id,
            wins: data.wins,
            loses: data.loses,
            matches: JSON.parse(data.matches)
          }
          localStorage.setItem('userID', this.user.id)
        }
      };
    },
    methods: {
    }
  };
  </script>
  
  <style scoped>
  .container {
    height: 100%;
    aspect-ratio: 9/16;
    background-color: var(--background);
    display: flex;
    flex-direction: column;
    position: relative;
    color: var(--text);
  }
  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    position: relative;
    flex: 1;
  }
  </style>
  