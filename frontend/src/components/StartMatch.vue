<template>
    <div class="start">
        <div class="enemy">

        </div>
        <div class="divider">
        </div>
        <div class="vs">
            VS
        </div>
        <div class="you">
            
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'vStartMatch',
    props: {
    },
    methods: {
    },
    mounted() {}
  };
  </script>
  
  <style scoped>
    .start {
        background: var(--background);
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
    }
    .enemy, .you {
        border: 2px solid var(--primary);
        width: 50%;
        aspect-ratio: 1;
        position: absolute;
        left: 50%;
        border-radius: 50%;
        animation-delay: .5s;
        animation: enter ease-in .5s;
        animation-fill-mode: forwards;
    }
    .enemy {
        top: 10%;
        transform: translateY(-50%) translateX(-50%);
    }
    .you {
        bottom: 10%;
        transform: translateY(50%) translateX(-50%);
    }

    .divider {
        width: 1000px;
        height: 5px;
        position: absolute;
        background: var(--primary);
        top: 50%;
        left: 50%;
        transform-origin: 0% -50%;
        transform: rotate(-50deg) translate(-50%, -50%);
        animation: straighten ease-out .5s;
        animation-fill-mode: forwards;
    }
    .vs {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(5);
        color: var(--primary);
        font-weight: bolder;
        font-size: 30px;
        padding: 5px;
        background: var(--background);
        font-family: var(--text-font);
        animation: appear ease-out .5s;
        animation-fill-mode: forwards;
    }
    @keyframes appear {
        to { 
            transform: translate(-50%, -50%) scale(1);
        }
    }
    @keyframes straighten {
        to { 
            transform: rotate(0deg) translate(-50%, -50%);
            height: 2px;
        }
    }
    @keyframes enter {
        to { 
            transform: translateX(-50%) translateY(0%);
        }
    }
  </style>
  