<template>
  <div class="battlefield">

    <div class="move">
      <div class="enemy-move" id="enemy">
      </div>
    </div>
    <div class="your move">
      <div class="counter" v-if="!play">
        <span v-if="counter">{{ counter }}</span>
        <div class="loader" v-else></div>
      </div>
      <div class="election-container" v-if="play&&!move">
        <div class="election-row">
          <button v-on:click="sendMove('rock')">
            <img src="@/assets/fist-bump.png" height="100%" width="100%">
          </button>
        </div>
        <div class="election-row">
          <button v-on:click="sendMove('scissor')">
            <img src="@/assets/scissor.png" height="80%" width="80%">
          </button>
          <button v-on:click="sendMove('paper')">
            <img src="@/assets/palm-of-hand.png" height="80%" width="80%">
          </button>
        </div>
      </div>
      <div :class="['enemy-move', move]" v-else>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BattleField',
  props: {
    msg: String
  },
  data() {
    return {
      play: false,
      move: null,
      roomID: null,
      userID: null,
      counter: null,
      moveHistory: [],
      wins: 0,
      loses: 0,
      roomCount: 0,
      result: null,
    }
  },
  mounted() {
    const userID = localStorage.getItem('userID');
    this.ws = new WebSocket(`ws://localhost:3000?userID=${userID}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'initUser') {
        this.userID = data.userID
        localStorage.setItem('userID', this.userID)
      }
      if (data.type === 'joinRoom') {
        this.roomID = data.roomID;
        this.roomCount = data.count;
      }
      if (data.type === 'userJoin') {
        this.roomCount = data.count+1;
      }
      if (data.type === 'startGame') {
        this.startCounter()
      }
      if (data.type === 'enemyMove') {
        let enemy = document.getElementById('enemy')
        enemy.classList.remove('rock')
        enemy.classList.remove('scissor')
        enemy.classList.remove('paper')
        enemy.classList.add(data.move)
      }
      if (data.type === 'gameResult') {
        if (data.winner == 'draw') {
          console.log('draw')
        }
        else if (data.winner == this.userID) {
          console.log('Win')
        }
        else {
          console.log('Loss')
        }
      }
    };

    this.ws.onopen = async () => {
      this.ws.send(JSON.stringify({ type: 'joinRoom', roomID: this.roomID }));
    };

  },
  methods: {
    startCounter() {
      let count = 0
      let counter = ['3', '2', '1', 'Go']
      let interval = setInterval(() => {
        this.counter = counter[count];
        count++;
        
        if (count >= counter.length) {
          clearInterval(interval);
          this.play = true;
        }
      }, 500);
    },
    sendMove(move) {
      this.move = move;
      this.ws.send(JSON.stringify({ type: 'userMove', roomID: this.roomID, userID: this.userID, move: move }));
    },
  }
};
</script>

<style scoped>
.battlefield {
  flex: 1;
  width: 100%;
  background: #333;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.room {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.counter {
  height: 100%;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: black;
  font-weight: bold;
}
.move {
  width: 70%;
  aspect-ratio: 1;
  background: white;
  border: 3px solid #777;
  box-shadow: 0px 0px 4px white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.your:has(.loader):active {
  pointer-events: none;
}
.loader {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgb(161, 161, 161);
  border-radius: 50%;
  overflow: hidden;
  border-top-color: #000000;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s linear infinite;
}
@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
.election-container {
  aspect-ratio: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.election-container button {
  height: 60%;
  aspect-ratio: 1;
  margin: 0px;
  padding: 0px;
  border-radius: 50%;
  background: white;
  border: 2px solid rgb(211, 211, 211);
}
.election-container button:hover {
  border: 2px solid red;
}
.election-container button:active {
  border: 2px solid red;
  box-shadow: 0px 0px 6px red;
  cursor: pointer;
}
.election-row {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 0px;

}
.election-row:nth-child(2) {
  align-items: flex-start;
}
.enemy-move {
  height: 90%;
  width: 90%;
  border-radius: 50%;
}
.paper.enemy-move {
  background: url("@/assets/palm-of-hand.png");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.rock.enemy-move  {
  background: url("@/assets/fist-bump.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.scissor.enemy-move  {
  background: url("@/assets/scissor.png");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
