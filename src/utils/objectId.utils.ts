import { Types } from "mongoose";

export type ObjectId = Types.ObjectId;

export const createObjectId = (id: string): ObjectId => new Types.ObjectId(id);
