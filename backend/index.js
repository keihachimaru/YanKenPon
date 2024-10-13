// backend/index.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');  // For generating room and user IDs

const app = express();
const port = 3000;

let database = {
    rooms: [],
    users: [],
};

// Session setup
const sessionMiddleware = session({
  secret: uuidv4(),  // Change this to a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set true if using HTTPS
});

app.use(sessionMiddleware);

// Create an HTTP server and integrate WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Function to apply session to WebSocket
function wrapSession(ws, req) {
  sessionMiddleware(req, {}, () => {
    ws.session = req.session;
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userID = urlParams.get('userID');
    console.log('- - -')
    console.log(userID)
    if (userID!='null') {
      req.session.userID = userID;

      if (!database.users.find(user => user.id === userID)) {
        let newUser = {
          id: userID,
          matches: [],
          wins: 0,
          loses: 0,
        };
        database.users.push(newUser);
        console.log(`New user created: ${userID}`);
      } 
      else {
        console.log(`Session initialized for existing user: ${userID}`);
      }
    } 
    else {
      console.log('No userID provided, creating a new session.');
      req.session.userID = Math.floor(10000000 + Math.random() * 90000000);
      let newUser = {
        id: req.session.userID,
        matches: [],
        wins: 0,
        loses: 0,
      };
      database.users.push(newUser);
    }

    req.session.save();


  });
}


// WebSocket connection
wss.on('connection', (ws, req) => {
  wrapSession(ws, req)

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
        let targetUser = database.users.find(u => u.id == client.session.userID)
        client.send(JSON.stringify({
          type: 'initUser',
          id: targetUser.id,
          wins: targetUser.wins,
          loses: targetUser.loses,
          matches: JSON.stringify(targetUser.matches)
        }));
    }
});

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log('- - -')
    console.log(`User ${ws.session.userID} sent message: ${message}`);

    if (parsedMessage.type === 'joinRoom') {
        let availableRoom = []
        for (let i=0; i<database.rooms.length; i++) {
            if (database.rooms[i].users.length<2) {
                availableRoom = database.rooms[i]
            }
        }

        if (!availableRoom.id) {
            let room = {
                id : uuidv4(),
                number : database.rooms.length,
                users: [],
                matches: [],
            }
            database.rooms.push(room)
            availableRoom = room
        }

        ws.session.roomID = availableRoom.id
        if (availableRoom.users.length == 1) {
            let match = {
              id: uuidv4(),
              users: [availableRoom.users[0], ws.session.userID],
              moves: [],
              date: new Date().toLocaleTimeString(),
              winner: null,
            }
            availableRoom.matches.push(match)
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN && client.session.userID === availableRoom.users[0]) {
                    client.send(JSON.stringify({
                        type: 'startMatch',
                        match: match,
                        enemy: database.users.find(u => u.id==ws.session.userID),
                        user: database.users.find(u => u.id==availableRoom.users[0])
                    }));
                }
                if (client.readyState === WebSocket.OPEN && client.session.userID === ws.session.userID) {
                  client.send(JSON.stringify({
                      type: 'startMatch',
                      match: match,
                      enemy: database.users.find(u => u.id==availableRoom.users[0]),
                      user: database.users.find(u => u.id==ws.session.userID)
                  }));
                }
            });
        }

        availableRoom.users.push(ws.session.userID)

        ws.session.save();
        
        ws.send(JSON.stringify({
            type: 'joinRoom',
            room: availableRoom,
        }));

        console.log(`User ${ws.session.userID} joined room #${availableRoom.number} [${availableRoom.users.length}/2]: ${ws.session.roomID}`);
        // Broadcast to room or handle room logic here
    }

    if (parsedMessage.type === 'userMove') {
      console.log(parsedMessage)
      let targetRoom = database.rooms.find((room)=>room.id==parsedMessage.roomID)
      let targetMatch = targetRoom.matches.find(m => !m.winner)

      let move = {
        user: parsedMessage.userID,
        move: parsedMessage.move,
        time: new Date().toLocaleTimeString(),
      }
      
      targetMatch.moves.push(move)

      if (targetMatch.moves.length == 2) {
        let move1 = targetMatch.moves[0];
        let move2 = targetMatch.moves[1];
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && (client.session.userID === move1.user)) {
            client.send(
              JSON.stringify({
                type: 'enemyMove',
                move: move2.move,
              })
            );
          }
          if (client.readyState === WebSocket.OPEN && (client.session.userID === move2.user)) {
            client.send(
              JSON.stringify({
                type: 'enemyMove',
                move: move1.move,
              })
            );
          }
        });

        let winner;
        let loser;

        if (move1.move === move2.move) {
          winner = 'draw';
        } 
        else if (
          (move1.move === 'rock' && move2.move === 'scissor') ||
          (move1.move === 'scissor' && move2.move === 'paper') ||
          (move1.move === 'paper' && move2.move === 'rock')
        ) 
        {
          winner = move1.user;
          winnerMove = move1.move;

          loser = move2.user;
          loserMove = move2.user;
        } 
        else {
          winner = move2.user;
          winnerMove = move2.move;

          loser = move1.user;
          loserMove = move1.move;
        }
    
        console.log('Winner:', winner);
        
        if (winner == 'draw') {
          targetMatch.moves = []
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && (client.session.userID === move1.user || client.session.userID === move2.user)) {
              client.send(
                JSON.stringify({
                  type: 'draw',
                })
              );
            }
          });
        }
        else {
          targetMatch.winner = winner

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && (client.session.userID === move1.user || client.session.userID === move2.user)) {
              client.send(
                JSON.stringify({
                  type: 'gameResult',
                  match: targetMatch,
                })
              );
            }
          });
          
          let winnerUser = database.users.find(user => user.id == winner)
          let loserUser = database.users.find(user => user.id == loser)

          winnerUser.wins += 1
          loserUser.losses += 1

          winnerUser.matches.push(targetMatch)
          loserUser.matches.push(targetMatch)

          targetRoom.users = []
          console.log('\n\n\n\n')
        }
      }
    }
  });

  ws.on('close', () => {
    console.log(`User ${ws.session.userID} disconnected`);
    let room = null
    for (let i=0; i<database.rooms.length; i++) {
        if (database.rooms[i].id == ws.session.roomID) {
            room = database.rooms[i]
            break
        }
    }
    console.log(`User ${ws.session.userID} left room #${room.number}: ${room.id}`);
    room.users = room.users.filter(a => a!=ws.session.userID)
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
