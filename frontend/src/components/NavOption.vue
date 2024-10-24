<template>
    <div class="option" @click="redirect">
        {{ option.name }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'vNavOption',
    props: {
        option: Object, 
    },
    methods: {
        redirect() {
            setTimeout(()=>{
                if (this.option.type) {
                    window.localStorage.setItem('matchType', this.option.type)
                }
                window.location.href = window.location.origin + this.option.path
            }, 50)
        }
    },
    mounted() {}
  };
  </script>
  
  <style scoped>
    .option {
        width: 60%;
        height: 60px;
        border: 2px solid var(--primary);
        background: var(--background);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: var(--text-font);
        transition: .1s ease-in-out;
    }
    .option:hover {
        border-color: var(--primary-dark);
        background: var(--primary-light);
        cursor: pointer;
    }
    .option:active {
        transform: scale(1.05);
    }
  </style>
  