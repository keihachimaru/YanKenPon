import { createRouter, createWebHistory } from 'vue-router';

// Import your components
import LobbyView from '../pages/Lobby.vue';
import MatchView from '../pages/Match.vue';
import FriendsView from '../pages/Friends.vue';

const routes = [
  {
    path: '/',
    name: 'Lobby',
    component: LobbyView
  },
  {
    path: '/match',
    name: 'Match',
    component: MatchView
  }
  ,
  {
    path: '/friends',
    name: 'Friends',
    component: FriendsView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
