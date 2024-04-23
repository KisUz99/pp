import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('connected')
  handleConnect(socket: Socket, data: any): void {
    const { nickname } = data;
    this.server.emit('notice', { message: `${nickname} has connected.` });
  }

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any): void {
    const { message, nickname } = data;
    socket.broadcast.emit('message', `${nickname}: ${message}`);
  }
}

@WebSocketGateway({ namespace: 'room' })
export class RoomGateway implements OnGatewayConnection {
  constructor(private chatGateway: ChatGateway) {}
  rooms = ['chat1'];

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(@MessageBody() data) {
    const { nickname, room } = data;
    this.chatGateway.server.emit('notice', {
      message: `the user ${nickname} create the room ${room}.`,
    });
    this.rooms.push(room);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, data) {
    const { nickname, room, toLeaveRoom } = data;
    socket.leave(toLeaveRoom);
    this.chatGateway.server.emit('notice', {
      message: `the user ${nickname} join the room, ${room}.`,
    });
    socket.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(socket: Socket, data) {
    const { nickname, toLeaveRoom } = data;
    socket.leave(toLeaveRoom);
    this.chatGateway.server.emit('notice', {
      message: `the user ${nickname} leave the room, ${toLeaveRoom}.`,
    });
  }

  @SubscribeMessage('message')
  handleMessageToRoom(socket: Socket, data) {
    const { nickname, room, message } = data;
    console.log(data);
    socket.broadcast.to(room).emit('message', {
      message: `${nickname}: ${message}`,
    });
  }
}
