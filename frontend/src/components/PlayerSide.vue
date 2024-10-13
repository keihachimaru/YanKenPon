<template>
    <div class="side">
      <button :class="move!='scissor'?'card':'selected card'" @click="selectMove('scissor')">
        <img src="@/assets/scissor.png" width="33%">
      </button>
      <button :class="move!='rock'?'card':'selected card'" @click="selectMove('rock')">
        <img src="@/assets/fist-bump.png" width="42%">
      </button>
      <button :class="move!='paper'?'card':'selected card'" @click="selectMove('paper')">
        <img src="@/assets/palm-of-hand.png" width="33%">
      </button>
      <div class="moveHistory">
        <div :class="[pastMove, 'icon']" v-for="(pastMove, i) in moveHistory" :key="i">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PlayerSide',
    props: {
      playerMove: String,
      moveHistory: Array,
    },
    data() {
      return {
        move: null,
      }
    },
    methods: {
      selectMove(move) {
        this.$emit('sendMove', move)
      },
    },
    watch: {
      playerMove: {
        handler(newMove) {
          this.move = newMove;
        },
        immediate: true,
      }
    },
    mounted() {}
  };
  </script>
  
  <style scoped>
  .moveHistory {
    height: 100%;
    aspect-ratio: 2/16;
    border-top: 1px solid rgb(109, 111, 240);
    border-right: 1px solid rgb(109, 111, 240);
    top: 0px;
    left: 0px;
    position: absolute;
    border-top-right-radius: 10px;
  }
  .icon {
    width: 100%;
    aspect-ratio: 1;
    border-bottom: 1px solid rgb(109, 111, 240);
    background-repeat: no-repeat !important;
    background-position: center center !important;
  }
  .icon.paper {
    background: url('@/assets/palm-of-hand.png');
    background-size: 80%;
  }
  .icon.scissor {
    background: url('@/assets/scissor.png');
    background-size: 80%;
  }
  .icon.rock {
    background: url('@/assets/fist-bump.png');
    background-size: 110%;
  }
  .side {
    aspect-ratio: 3/2;
    width: 100%;
    position: relative;
    z-index: 1;
  }
  .side:has(.selected) .card {
    pointer-events: none;
    align-items: center;
    justify-content: center;
  }

  .side:nth-child(1) {
    transform: rotate(180deg);
    pointer-events: none;
  }
  .side:nth-child(1) .moveHistory {
    border-top-color: red;
    border-right-color: red;
  }
  .side:nth-child(1) .icon {
    border-bottom-color: red;
  }
  .selected {
    z-index: 2;
  }
  .selected img {
    transform: scale(2);
  }
  .card {
    background: white;
    aspect-ratio: 5/7;
    border-radius: 10px;
    height: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: none;
    box-shadow: 0px 0px 3px 0px #333;
    transition: all ease-in-out .2s;
    display: flex;
    justify-content: start;
    align-items: start;
    padding: 5px;
    box-sizing: border-box;
  }
  .card img {
    transition: all ease-in-out .2s;
  }
  .card:nth-child(1) {
    transform: translate(-70%, -50%) rotate(-15deg);
  }
  .card:nth-child(2) {
    padding: 0px;
  }
  .card:nth-child(3) {
    transform: translate(-30%, -45%) rotate(15deg);
  }

  .card:nth-child(1):hover, .card:nth-child(1).selected {
    transform: translate(-80%, -70%) rotate(-17deg) scale(1.1);
    cursor: pointer;
    box-shadow: 0px 0px 3px 0px rgb(109, 111, 240);
  }
  .card:nth-child(1):hover img, .card:nth-child(1).selected img {
    filter: invert(43%) sepia(69%) saturate(2604%) hue-rotate(220deg) brightness(97%) contrast(94%);
  }

  .card:nth-child(2):hover, .card:nth-child(2).selected {
    transform: translate(-50%, -70%) scale(1.1);
    cursor: pointer;
    box-shadow: 0px 0px 3px 0px rgb(109, 111, 240);
  }
  .card:nth-child(2):hover img, .card:nth-child(2).selected img {
    filter: invert(43%) sepia(69%) saturate(2604%) hue-rotate(220deg) brightness(97%) contrast(94%);
  }

  .card:nth-child(3):hover, .card:nth-child(3).selected {
    transform: translate(-20%, -70%) rotate(17deg) scale(1.1);
    cursor: pointer;
    box-shadow: 0px 0px 3px 0px #6d6ff0;
  }
  .card:nth-child(3):hover img, .card:nth-child(3).selected img {
    filter: invert(43%) sepia(69%) saturate(2604%) hue-rotate(220deg) brightness(97%) contrast(94%);
  }


  </style>
  