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
  secret: 'your-secret-key',  // Change this to a strong secret
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
    if (!req.session.userID) {
      req.session.userID = uuidv4();  // Assign a new user ID if not set
    }
    ws.session.save();
  });

}

// WebSocket connection
wss.on('connection', (ws, req) => {
  wrapSession(ws, req);

  ws.on('message', (message) => {
    console.log(`User ${ws.session.userID} sent message: ${message}`);

    // Example: Handle joining a room
    const parsedMessage = JSON.parse(message);

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

        console.log(`User ${ws.session.userID} joined room #${availableRoom.number}: ${ws.session.roomID}`);
        // Broadcast to room or handle room logic here
    }

    // Broadcast messages to other clients (for simplicity, we're broadcasting to all)
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          userID: ws.session.userID,
          roomID: ws.session.roomID,
          message: parsedMessage.message
        }));
      }
    });
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

// API route to check session (optional)
app.get('/api/check-session', (req, res) => {
    try {
        res.json({
            userID: req.session.userID || null,
            roomID: req.session.roomID || null
        });
    }
    catch {
        wrapSession(ws, req);
        res.json({
            userID: req.session.userID || null,
            roomID: req.session.roomID || null
        });
    }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
