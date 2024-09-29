<template>
  <div class="battlefield">
    <div class="room">
      <span v-if="roomID">{{ roomCount }}</span>
      <div class="loader" v-else></div>
    </div>
    <div class="counter">
      {{ counter }}
    </div>
    <div class="move">
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BattleField',
  props: {
    msg: String
  },
  data() {
    return {
      play: false,
      move: 'rock',
      roomID: null,
      userID: null,
      counter: 'N/A',
      moveHistory: [],
      wins: 0,
      loses: 0,
      roomCount: 0,
    }
  },
  mounted() {
    this.ws = new WebSocket('ws://localhost:3000'); // Or your ngrok URL

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'joinRoom') {
        this.roomID = data.roomID;
        this.roomCount = data.count;
      }
      if (data.type === 'userJoin') {
        this.roomCount = data.count+1;
      }
    };

    this.ws.onopen = async () => {
      const sessionResponse = await axios.get('/api/check-session');
      const sessionData = sessionResponse.data;
      const userID = sessionData.userID || localStorage.getItem('userID');
      localStorage.setItem('userID', userID);
      this.userID = userID
      this.ws.send(JSON.stringify({ type: 'joinRoom', roomID: this.roomID }));
    };

  },
  methods: {
  }
};
</script>

<style scoped>
.battlefield {
  flex: 1;
  width: 100%;
  background: #333;
  position: relative;
}
.room {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.counter {
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  font-weight: bold;
}
.move {
  width: 80%;
  aspect-ratio: 1;
  background: white;
  border: 3px solid #777;
  box-shadow: 0px 0px 4px white;
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loader {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #fff;
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
