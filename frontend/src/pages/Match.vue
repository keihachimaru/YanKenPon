<template>
  <div class="battlefield">
    <PlayerSide :playerMove="enemyMove" :moveHistory="enemyMoveHistory" @sendMove="sendMove"/>
    <PlayerSide :playerMove="userMove" :moveHistory="userMoveHistory" @sendMove="sendMove"/>

    <span class="enemy-uid uid" v-if="match">{{ enemy.id }}</span>
    <span class="your-uid uid" v-if="match">{{ user.id }}</span>

    <div class="waiting" v-if="!match">
      <StartMatch v-if="'123'.includes(message)"/>
      <Loader v-else/>
    </div>
  </div>
</template>

<script>
import PlayerSide from '@/components/PlayerSide.vue'
import Loader from '@/components/Loader.vue'
import StartMatch from '@/components/StartMatch.vue'

export default {
  name: 'MatchView',
  components: {
    PlayerSide,
    Loader,
    StartMatch
  },
  data() {
    return {
      match: null,
      user: [],
      enemy: [],
      room: [],
      message: " ",
      userMove: null,
      enemyMove: null,
      userMoveHistory: [],
      enemyMoveHistory: [],
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
      if (data.type === 'joinRoom') {
        this.room = data.room;
      }
      if (data.type === 'userJoin') {
        this.roomCount = data.count+1;
      }
      if (data.type === 'enemyMove') {
        this.enemyMove = data.move;
      }
      if (data.type === 'draw') {
        setTimeout(()=>{
          this.enemyMove = null;
          this.userMove = null;
        }, 1000)
      }
      if (data.type === 'startMatch') {
        this.enemy = data.enemy
        this.startCounter(data.match)
        this.enemyMoveHistory = this.getHistory(data.enemy)
        this.userMoveHistory = this.getHistory(data.user)
      }
      if (data.type === 'gameResult') {
        if (data.match.winner == this.user.id) {
          console.log('Win')
        }
        else {
          console.log('Loss')
        }
        setTimeout(()=>{
          this.enemyMove = null;
          this.userMove = null;
        }, 1000)
        this.ws.send(JSON.stringify({ type: 'joinRoom', roomID: this.room.id }));
      }
    };

    let matchType = window.localStorage.getItem('matchType')
    window.localStorage.removeItem('matchType')

    this.ws.onopen = async () => {
      this.ws.send(JSON.stringify({ type: 'joinRoom', roomID: this.room.id, matchType: matchType }));
    };
  },
  methods: {
    getHistory(user) {
      let history = user.matches.map(match => match.moves.find(move => move.user == user.id).move)
      return history.slice(0, 9)
    },
    startCounter(match) {
      let count = 0
      let counter = ['3', '2', '1', 'Go']
      let interval = setInterval(() => {
        this.message = counter[count];
        count++;
        
        if (count >= counter.length) {
          clearInterval(interval);
          this.match = match;
        }
      }, 500);
    },
    sendMove(move) {
      this.userMove = move
      this.ws.send(JSON.stringify({ type: 'userMove', roomID: this.room.id, userID: this.user.id, move: move }));
    },
  }
};
</script>

<style scoped>
.battlefield {
  height: 100%;
  aspect-ratio: 9/16;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.waiting {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
  z-index: 1;
}
.uid {
  z-index: 2;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
}
.enemy-uid {
  color: red;
  position: absolute;
  top: 15px;
  left: 15px;
}
.your-uid {
  color: rgb(109, 111, 240);
  position: absolute;
  bottom: 15px;
  right: 15px;
}

#msg {
  font-size: 25px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: rgb(109, 111, 240);
  z-index: 2;
}
</style>
