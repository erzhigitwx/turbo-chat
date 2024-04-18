import { v4 as uuidv4 } from "uuid";
import { userSocketRoomPrefix } from "../constants";
import { io } from "../index";

export function uuid(options?: any) {
  return uuidv4(options);
}

export function isOnline(id: string): boolean {
  return !!io.sockets.adapter.rooms.get(userSocketRoomPrefix + id)?.size;
}
