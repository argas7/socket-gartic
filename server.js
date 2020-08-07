const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const getColor = require('./public/colors');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let users = {};
let image;

io.on('connection', (socket) => {
  if (!users[socket.id]) {
    users = {
      ...users,
      [socket.id]: { color: getColor() },
    }
  }
  console.log(users);
  socket.emit('myData', { color: users[socket.id].color });

  socket.on('draw', (data) => {
    console.log(data.image);
    if (data.image) image = data;
  });

  setInterval(() => {
    io.emit('image', image);
  }, 500);

  socket.on('disconnect', () => delete users[socket.id]);
});

http.listen(3000, () => console.log('Listening on port: 3000'));
