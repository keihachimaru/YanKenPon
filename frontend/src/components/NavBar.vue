<template>
    <div class="navbar">
        <div class="user-data">
          <img src="@/assets/trophy.png" height="20px"/>
          {{data.wins }}
        </div>
        <button class="profile" @click="openMenu">
        </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'vNavBar',
    props: {
        data: Object, 
    },
    methods: {
      openMenu() {
        this.$emit('openMenu')
      }
    },
    mounted() {}
  };
  </script>
  
  <style scoped>
    .navbar {
      width: 100%;
      height: 15%;
      background: var(--primary);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .user-data {
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    .profile {
      position: absolute;
      top: 50%;
      right: 0%;
      transform: translate(-100%,-50%);
      height: 30%;
      aspect-ratio: 1;
      border: none;
      background: url("@/assets/menu.png");
      background-repeat: no-repeat;
      background-size: cover;
      outline: none;
      transition: .15s ease-in-out;
    }
    .profile:hover {
      cursor: pointer;
      filter: invert(100%);
    }
  </style>
  