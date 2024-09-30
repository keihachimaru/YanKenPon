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
          moveHistory: [],
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
      req.session.userID = uuidv4();
      let newUser = {
        id: req.session.userID,
        moveHistory: [],
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
        client.send(JSON.stringify({
          type: 'initUser',
          userID: client.session.userID,
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
                moves: [],
            }
            database.rooms.push(room)
            availableRoom = room
        }

        ws.session.roomID = availableRoom.id
        if (availableRoom.users.length == 1) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN && client.session.userID === availableRoom.users[0]) {
                    client.send(JSON.stringify({
                        type: 'userJoin',
                        count: availableRoom.users.length
                    }));
                    client.send(JSON.stringify({
                      type: 'startGame',
                  }));
                }
                if (client.readyState === WebSocket.OPEN && client.session.userID === ws.session.userID) {
                  client.send(JSON.stringify({
                      type: 'startGame',
                  }));
                }
            });
        }

        availableRoom.users.push(ws.session.userID)

        ws.session.save();
        
        ws.send(JSON.stringify({
            type: 'joinRoom',
            roomID: ws.session.roomID,
            count: availableRoom.users.length,
        }));

        console.log(`User ${ws.session.userID} joined room #${availableRoom.number} [${availableRoom.users.length}/2]: ${ws.session.roomID}`);
        // Broadcast to room or handle room logic here
    }

    if (parsedMessage.type === 'userMove') {
      let targetRoom = database.rooms.find((room)=>room.id==parsedMessage.roomID)
      let targetUser = database.users.find((user)=>user.id==parsedMessage.userID)
      
      targetRoom.moves.push({
        user: parsedMessage.userID,
        move: parsedMessage.move,
      })
      let enemyUser = targetRoom.users.filter((user)=>user!=parsedMessage.userID)[0]
      wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && client.session.userID === enemyUser) {
              client.send(JSON.stringify({
                type: 'enemyMove',
                move: parsedMessage.move,
              }));
              console.log('Sending enemy move to : ' + enemyUser)
          }
      });
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
