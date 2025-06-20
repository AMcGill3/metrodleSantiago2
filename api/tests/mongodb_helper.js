import mongoose from "mongoose"
import {connectToDatabase} from "../db/db";

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await mongoose.connection.close(true);
});
