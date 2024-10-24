<template>
    <div :class="['menu', show ? 'show' : 'hide']">
        <h1>user data and menu idk</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'vMenu',
    props: {
        show: Boolean,
    },
    methods: {
    },
    mounted() {}
  };
  </script>
  
  <style scoped>
    .menu {
        background: var(--background);
        height: calc(100% - 100px);
        width: 100%;
        overflow: hidden;
        position: absolute;
        top: 100px;
        left: 0px;
        transition: ease-in-out .15s;
    }
    .show {
        opacity: 1;
        z-index: 3;
    }
    .hide {
        opacity: 0;
        z-index: -1;
    }
  </style>
  