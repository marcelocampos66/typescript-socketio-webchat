import Connection from "./Connection";

class WebChatModel extends Connection {
  constructor() {
    super();
  }

  private formatMessage({ message, nickname, timestamp }: IMessageContent) {
    return `${timestamp} - ${nickname}: ${message}`;
  }

  public async registerNewMessage(message: IMessageContent) {
    return this.connection()
      .then((db) => db.collection('webchat').insertOne(message))
  }

  public async getAllMessages() {
    const allMessages = await this.connection()
      .then((db) => db.collection('webchat').find({}).toArray());
    const messagesWithoutId = allMessages.map(({ message, nickname, timestamp }) => ({ message, nickname, timestamp }));
    const result = messagesWithoutId.map(this.formatMessage);
    return result;
  }

}

export default WebChatModel;
