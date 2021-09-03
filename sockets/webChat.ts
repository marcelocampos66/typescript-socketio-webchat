import { Socket } from "socket.io";
import models from '../models';

interface IOnlineUsers {
  id: any;
  nickname: any;
}

interface IMessagePayload {
  chatMessage: string;
  nickname: string;
}

const onlineUsers: Array<IOnlineUsers> = [];

const createDate = () => {
  const newDate = new Date().toLocaleString();
  const [date, time] = newDate.split(' ');
  const [day, month, year] = date.split('/');
  const correctDay = day.length === 1 ? `0${day}` : day;
  const correctMonth = month.length === 1 ? `0${month}` : month;
  const correctDate = `${correctDay}-${correctMonth}-${year}`;
  return `${correctDate} ${time}`;
};

const formatMessage = async (chatMessage: string, nickname: string) => {
  const newDate = createDate();
  await models.webchatmodel.registerNewMessage({ message: chatMessage, nickname, timestamp: newDate });
  return `${newDate} - ${nickname}: ${chatMessage}`;
};

const startConnection = async (io: any, socket: Socket) => {
  const nickname = socket.id.slice(0, 16);
  onlineUsers.push({
    id: socket.id,
    nickname,
  });
  const allMessages = await models.webchatmodel.getAllMessages();
  socket.emit('oldMessages', allMessages);
  socket.emit('login', nickname);
  io.emit('sendAllUsers', onlineUsers);
};

export default (io: any) => {
  io.on('connection', (socket: Socket) => {
    socket.on('login', () => startConnection(io, socket));

    socket.on('message', async ({ chatMessage, nickname }: IMessagePayload) => {
      const message = await formatMessage(chatMessage, nickname);
      io.emit('message', message);
    });

    socket.on('changeNickname', (newNickname: string) => {
      const chosenUser: IOnlineUsers | undefined = onlineUsers.find((user) => user.id === socket.id);
      if (!chosenUser) return;
      chosenUser.nickname = newNickname;
      io.emit('sendAllUsers', onlineUsers);
    });

    socket.on('disconnect', () => {
      const index = onlineUsers.findIndex((user) => user.id === socket.id);
      onlineUsers.splice(index, 1);
      io.emit('sendAllUsers', onlineUsers);
    });
  });
};
