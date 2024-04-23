const chatDiv = document.querySelector('#chatDiv');
const listDiv = document.querySelector('#listDiv');
let nickname = localStorage.getItem('nickname');
if (nickname === null || nickname === '') {
  setNickname();
} else {
  setNamespan();
}
const socket = io('http://localhost:4000/chat');
const roomSocket = io('http://localhost:4000/room');
let currentRoom = '';
const currentRoomSpan = document.getElementById('currentRoom');

function setNickname() {
  nickname = prompt('Please Enter the nickname.');
  if (nickname === '' || nickname === null) {
    return;
  }
  localStorage.setItem('nickname', nickname);
  setNamespan();
}

function setNamespan() {
  const nameSpan = document.querySelector('#nameSpan');
  nameSpan.innerHTML = `Nickname: ${localStorage.getItem('nickname')}`;
}

function sendMessage() {
  if (currentRoom === '') {
    alert('Choose the room.');
    return;
  } else if ($('#message').val() === '') {
    alert('Type message before submit');
    return;
  }
  const message = $('#message').val();
  const data = { message, nickname, room: currentRoom };
  $('#chat').append(`<div>Me : ${message}</div>`);
  roomSocket.emit('message', data);
  $('#message').val('');
  const chat = document.getElementById('chat');
  chat.scrollTop = chat.scrollHeight;
  document.getElementById('message').focus();
  return false;
}

socket.on('connect', () => {
  console.log('Connect Successful');
  socket.emit('connected', {
    nickname,
  });
});

socket.on('message', (message) => {
  $('#chat').append(`<div>${message}</div>`);
});

socket.on('notice', (data) => {
  const notice = document.getElementById('notice');
  $('#notice').append(`<div>${data.message}</div>`);
  notice.scrollTop = notice.scrollHeight;
});

function createRoom() {
  const room = prompt('Enter the room name for create');
  if (room === '') {
    alert("room name can't be empty!");
    return;
  } else if (room === null) {
    return;
  }
  roomSocket.emit('createRoom', { room, nickname });
}

function joinRoom(room) {
  if (room === currentRoom) {
    alert('you already in the room');
    return;
  }
  roomSocket.emit('joinRoom', { room, nickname, toLeaveRoom: currentRoom });
  $('#chat').html('');
  currentRoom = room;
  currentRoomSpan.innerText = currentRoom;
  chatDiv.classList.toggle('hide');
  listDiv.classList.toggle('hide');
}

function leaveRoom() {
  if (currentRoom === null || currentRoom === '') {
    alert("you didn't join any room");
    return;
  }
  roomSocket.emit('leaveRoom', { nickname, toLeaveRoom: currentRoom });
  $('#chat').html('');
  currentRoom = '';
  currentRoomSpan.innerText = 'none';
  chatDiv.classList.toggle('hide');
  listDiv.classList.toggle('hide');
}

roomSocket.on('rooms', (data) => {
  console.log(data);
  $('#rooms').empty();
  data.forEach((room) => {
    $('#rooms').append(
      `<li>${room} <button onclick="joinRoom('${room}')">Join</button></li>`,
    );
  });
});

roomSocket.on('message', (data) => {
  $('#chat').append(`<div>${data.message}</div>`);
});
