<template>
    <div class="loader">
    </div>
  </template>
  
  <script>
  export default {
    name: 'vLoader',
    props: {
    },
    methods: {
    },
    mounted() {}
  };
  </script>
  
  <style scoped>
    .loader {
        width: 60px;
        height: 60px;
        border: 3px solid var(--primary-light);
        border-radius: 50%;
        overflow: hidden;
        border-top-color: var(--primary-dark);
        animation: spin 1s ease-in-out infinite;
        -webkit-animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to { -webkit-transform: rotate(360deg); }
    }
    @-webkit-keyframes spin {
        to { -webkit-transform: rotate(360deg); }
    }
  </style>
  