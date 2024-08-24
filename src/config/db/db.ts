import mongoose, { ConnectOptions } from "mongoose";
import dbConfig from '../index';

const MONGO_URL = dbConfig.db.mongoURL;

mongoose.connect(MONGO_URL).catch(console.error);

const db = mongoose.connection;

export default db;


