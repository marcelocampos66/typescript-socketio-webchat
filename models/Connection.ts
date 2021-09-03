import 'dotenv/config';
import { MongoClient } from 'mongodb';

const { MONGO_DB_URL, MONGO_DB } = process.env;

type Options = {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

export default class Connection {
  public options: Options;
  public mongoDbUrl: string;
  constructor() {
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    this.mongoDbUrl = MONGO_DB_URL || 'mongodb://127.0.0.1:27017';
  }

  public connection() {
    return MongoClient.connect(this.mongoDbUrl)
      .then((conn) => conn.db(MONGO_DB))
      .catch((err) => {
        console.error(err);
        process.exit();
      });
  }
}
