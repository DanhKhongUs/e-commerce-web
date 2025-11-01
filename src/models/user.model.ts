import { CollectionManager } from "lib/mongodb-wrapper";
import { IUser } from "types/user";

export const userCollection = new CollectionManager<IUser>("users");
