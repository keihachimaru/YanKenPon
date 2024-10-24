<template>
    <div class="container">
        <NavBar :data="user"/>
        <h1 style="text-align: center;">Friends?</h1><br><br>
        <img src="@/assets/friends.webp"/>
    </div>
  </template>
  
  <script>
  import NavBar from '@/components/NavBar.vue'
  
  export default {
    name: 'LobbyView',
    components: {
        NavBar
    },
    data() {
      return {
        user: [],
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
  