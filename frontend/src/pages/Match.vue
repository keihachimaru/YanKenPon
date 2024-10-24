<template>
  <div class="battlefield" v-if="!gameResult">
    <PlayerSide :playerMove="enemyMove" :moveHistory="enemyMoveHistory" @sendMove="sendMove"/>
    <PlayerSide :playerMove="userMove" :moveHistory="userMoveHistory" @sendMove="sendMove"/>

    <span class="enemy-uid uid" v-if="match">{{ enemy.id }}</span>
    <span class="your-uid uid" v-if="match">{{ user.id }}</span>
    <div class="score" v-if="match && !fightResult">
      <span class="enemy-score">{{ enemyScore }}</span>
      <span style="font-size: 14px;">
        {{ timeLeft }} s
      </span>
      <span class="your-score">{{ yourScore }}</span>
    </div>
    <div :class="['result', fightResult]" v-if="fightResult">
      {{ fightResult }}
    </div>

    <div class="waiting" v-if="!match">
      <StartMatch v-if="'123'.includes(message)"/>
      <Loader v-else/>
    </div>
  </div>
  <div class="battlefield" v-if="gameResult=='win'">
    <h1>Win</h1>
  </div>
  <div class="battlefield" v-if="gameResult=='loss'">
    <h1>Loss</h1>
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
      enemyScore: 0,
      yourScore: 0,
      fightResult: null,
      gameResult: null,
      timeLeft: '-',
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
        this.fightResult = 'draw'
        setTimeout(()=>{
          this.fightResult = null
          this.enemyMove = null;
          this.userMove = null;
          this.startFight()
        }, 1000)
      }
      if (data.type === 'startMatch') {
        this.enemy = data.enemy
        this.startCounter(data.match)
        this.enemyMoveHistory = this.getHistory(data.enemy)
        this.userMoveHistory = this.getHistory(data.user)
      }
      if (data.type === 'fightResult') {
        if (data.fight.winner == this.user.id) {
          this.fightResult = 'Win'
          this.yourScore += 1
        }
        else {
          this.fightResult = 'Loss'
          this.enemyScore += 1
        }
        setTimeout(()=>{
          this.enemyMove = null;
          this.userMove = null;
          this.fightResult = null
          this.startFight()
        }, 1000)
      }
      if (data.type === 'gameResult') {
        if (data.fight.winner == this.user.id) {
          this.fightResult = 'Win'
          this.yourScore += 1
        }
        else {
          this.fightResult = 'Loss'
          this.enemyScore += 1
        }

        let gameResult = null
        if (data.match.winner == this.user.id) {
          gameResult = 'win'
        }
        else {
          gameResult = 'loss'
        }
        setTimeout(()=>{
          this.enemyMove = null;
          this.userMove = null;
          this.enemyScore = 0;
          this.yourScore = 0;
          this.gameResult = gameResult;
        }, 1000)

        this.room = []
      }
    };

    let matchType = window.localStorage.getItem('matchType')
    if (!matchType) {
      window.location.href = '/'
    }
    window.localStorage.removeItem('matchType')

    this.ws.onopen = async () => {
      this.ws.send(JSON.stringify({ type: 'joinRoom', roomID: this.room.id, matchType: matchType }));
    };
  },
  methods: {
    startFight() {
      this.timeLeft = this.match.duration
      let interval = setInterval(() => {
      this.timeLeft --
      
      if (this.timeLeft == 0 && !this.userMove) {
        clearInterval(interval);
        this.ws.send(JSON.stringify({ type: 'userMove', roomID: this.room.id, userID: this.user.id, move: 'none' }));
      }
      else if (this.userMove) {
        clearInterval(interval);
      }
    }, 1000);
    },
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
          this.startFight()
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
.result {
  position: absolute;
  font-family: var(--text-font);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  font-weight: bolder;
  font-size: 24px;
  transform: translate(-50%, -50%);
}
.draw {
  color: var(--text);
}
.win {
  color: var(--primary);
}
.loss {
  color: var(--secondary);
}
.score {
  position: absolute;
  font-family: var(--text-font);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  top: 50%;
  left: 50%;
  font-weight: bolder;
  font-size: 24px;
  transform: translate(-50%, -50%);
}
.your-score {
  color: var(--primary);
}
.enemy-score {
  color: var(--secondary);
}
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
  color: var(--secondary);
  position: absolute;
  top: 15px;
  left: 15px;
}
.your-uid {
  color: var(--primary);
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
