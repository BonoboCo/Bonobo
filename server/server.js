const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');
const session = require('express-session');

const app = express();
const server = require('http').createServer(app);
const fs = require('fs');

//creates a new server
const io = require('socket.io')(server);

const path = require('path');
const {postMessage, getMessage} = require('./controllers/messageController.js');
const {getRooms, createRoom, getRoomUsers} = require('./controllers/roomController.js');
const {isLoggedIn} = require('./controllers/sessionController.js');
const {Room, User, Msg} = require('../Schemas/Tables.js');
const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = require('./config.secret');
// Create our app

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('Connected User');
  socket.on('post', (msg) => {
    console.log('emitting...');
    io.emit(`${msg.roomID}`, msg);
  });
  socket.on('createRoom', (newRoomObj) => {
    io.emit('newRoom', newRoomObj);
  });
  socket.on('userjoinroom', (joinRoomData) => {
    console.log('Socket event [userjoinroom] triggered');
    console.log(`user ${joinRoomData.userId} joined room ${joinRoomData.roomId}`);
    let userJoinMsg = {
      _id: -1,
      createdby: `${joinRoomData.displayName} has joined the room`,
      msgBody:"",
      updatedAt: Date.now,
    }
    io.emit(`${joinRoomData.roomId}`, userJoinMsg);
    // update users table with roomID
    User.find({where: {_id: joinRoomData.userId}}).then(user => {
      if(user){
        user.updateAttributes({
          roomId: joinRoomData.roomId,
        });
      }
    });
  });
});

//with successful authentication user is redirected to homepage. Otherwise, redirected back to login page.
app.get('/login', (req,res) => res.sendFile(path.join(__dirname, '../public/login.html')));
app.post('/login', (req,res,next) => {
  let displayname = req.body.username;
  let usersecret = req.body.usersecret;
  User.findOrCreate( { where: {displayname, usersecret}})
    .spread((user, created) => {
      // here user would be the object created or found
      // created is set to true if a new user is created || false if found
      user = user.get();
      res.cookie('user_id', user._id);
      res.cookie('session', user.displayname+user._id+user.createdAt);
      res.cookie('display_name', user.displayname);
      res.cookie('new_user', created);
      next();
    });
}, (req, res) => {res.redirect('/')});

app.get('/', isLoggedIn, (req,res) => res.sendFile(path.join(__dirname, '../public/index.html')));
//Express route to get list of rooms in a nearby area
//responds with list of rooms
app.get('/roomlist', isLoggedIn, getRooms);

//Express route for saving message from specific room:id
app.post('/rooms/:roomid', isLoggedIn, postMessage, (req,res) => res.end()) //added af for end()

//Express route for returning list of messages for specific :roomid
app.get('/rooms/:roomid', isLoggedIn, getMessage, (req, res) => res.end());
app.post('/createroom', isLoggedIn, createRoom, (req, res) => res.end());

//Express route for returning list of users for a specific :roomid
app.get('/rooms/:roomid/users', isLoggedIn, getRoomUsers, (req,res) => res.end());

//get request to send stylesheet to the html
app.get('/css/styles.css', (req,res) => res.sendFile(path.join(__dirname, '../public/css/styles.css')))
app.get('/bundle.js', (req,res) => res.sendFile(path.join(__dirname, '../public/bundle.js')));
app.get('/images/github.png', (req,res) => res.sendFile(path.join(__dirname, '../public/images/github.png')));

app.get('/sounds/:soundfile', (req,res) => {
  console.log(__dirname + '/../public/sounds/'+req.params.sounddfile);
  res.status(200).send(fs.readFileSync(__dirname + '/../public/sounds/'+req.params.soundfile))
});

//listening on port 3000
server.listen(3000, () => console.log('Express server is up on port 3000'));
module.exports = {io};
