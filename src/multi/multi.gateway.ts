import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectedUsers } from './connectedUsers';


@WebSocketGateway({ namespace: /\/room-.+/ })
export class MultiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }
  
  afterInit(server: Server) {
      console.log('WebSockets Init');
  }

  // 이벤트 발생 시
  @SubscribeMessage('enter')
  handleLogin(
    @MessageBody() data: { id: number; roomid: string },
    @ConnectedSocket() client: Socket,
  ) {
    const newNamespace = client.nsp;
    console.log('enter', newNamespace);
    ConnectedUsers[client.nsp.name][client.id] = data.id;
    newNamespace.emit('ConnectedUsers', Object.values(ConnectedUsers[client.nsp.name]));
    console.log('join', client.nsp.name, data.roomid);
    client.join(`${client.nsp.name}-${data.roomid}`);

  }

  handleConnection(client: Socket) {
      console.log('connected', client.nsp.name);
      
      if(!ConnectedUsers[client.nsp.name]){
        ConnectedUsers[client.nsp.name] = {};
      }
      console.log(ConnectedUsers);
      client.emit('connected', client.nsp.name);
  }

  handleDisconnect(client: Socket) {
      console.log('Disconnected', client.nsp.name);

      const nsp = client.nsp
      delete ConnectedUsers[client.nsp.name][client.id];
      console.log(ConnectedUsers);
      nsp.emit('connectedList', Object.values(ConnectedUsers[client.nsp.name]));
  }
}