import { Server, Socket } from "socket.io";
import { socketMiddlewareRouting } from "../middleware/socket-middleware-routing.js";
import socketMiddleware from "../middleware/middleware.js";
import { UserData } from "../../types/user.js";
import { collection, updateDoc } from "firebase/firestore";
import {
  findRefById,
  updateClearChat,
  updateDeleteChat,
  updateMessagesStatus,
} from "../../models/firebase.js";
import { chatsCollection } from "../../config/index.js";
import { userSocketRoomPrefix } from "../../constants/index.js";
import { getChatById } from "../../utils/index.js";

interface ChatMemberBody {
  userData: UserData;
  chatId: string;
}

function chatController(io: Server, socket: Socket) {
  socket.use(
    socketMiddlewareRouting(socketMiddleware.verifyToken, [
      "select-chat",
      "clear-chat",
      "delete-chat",
      "typing-chat",
      "stop-typing-chat",
    ]),
  );

  socket.use(
    socketMiddlewareRouting(socketMiddleware.verifyChatMember, [
      "select-chat",
      "clear-chat",
      "delete-chat",
      "typing-chat",
      "stop-typing-chat",
    ]),
  );

  socket.on("select-chat", async (body: ChatMemberBody) => {
    const { chatId } = body;
    const chatRef = await findRefById(chatsCollection, "id", chatId);
    const messagesCollectionRef = collection(chatRef.ref, "messages");
    await updateMessagesStatus(messagesCollectionRef, body.userData);
    const chatRow = await getChatById(chatId);
    if (!chatRow) return;

    await updateDoc(chatRef.ref, { unread: 0 });
    io.to(userSocketRoomPrefix + chatRow.creatorId).emit("chat-selected", {
      chatId: chatId,
    });
    io.to(userSocketRoomPrefix + chatRow.opponentId).emit("chat-selected", {
      chatId: chatId,
    });
  });

  socket.on(
    "clear-chat",
    async (body: ChatMemberBody & { forBoth: boolean }) => {
      const { chatId, forBoth, userData } = body;
      const chatRow = await getChatById(chatId);
      if (!chatRow) return;
      const clearedFor = forBoth
        ? [chatRow.opponentId, chatRow.creatorId]
        : [userData.uid];
      await updateClearChat(chatId, clearedFor);

      io.to(userSocketRoomPrefix + chatRow.creatorId).emit("chat-cleared", {
        chatId: chatId,
      });
      io.to(userSocketRoomPrefix + chatRow.opponentId).emit("chat-cleared", {
        chatId: chatId,
      });
    },
  );

  socket.on(
    "delete-chat",
    async (body: ChatMemberBody & { forBoth: boolean }) => {
      const { chatId, forBoth, userData } = body;
      const chatRow = await getChatById(chatId);
      if (!chatRow) return;
      const deletedFor = forBoth
        ? [chatRow.opponentId, chatRow.creatorId]
        : [userData.uid];
      await updateClearChat(chatId, deletedFor);
      await updateDeleteChat(chatId, deletedFor);

      io.to(userSocketRoomPrefix + chatRow.creatorId).emit("chat-deleted", {
        chatId: chatId,
      });
      io.to(userSocketRoomPrefix + chatRow.opponentId).emit("chat-deleted", {
        chatId: chatId,
      });
    },
  );

  socket.on("typing-chat", async (body: ChatMemberBody) => {
    const { chatId, userData } = body;
    const chatRow = await getChatById(chatId);
    const receiverId =
      chatRow.creatorId === userData.uid
        ? chatRow.opponentId
        : chatRow.creatorId;
    if (!chatRow) return;

    io.to(userSocketRoomPrefix + receiverId).emit("chat-typing-receive", {
      chatId: chatId,
    });
  });

  socket.on("stop-typing-chat", async (body: ChatMemberBody) => {
    const { chatId, userData } = body;
    const chatRow = await getChatById(chatId);
    const receiverId =
      chatRow.creatorId === userData.uid
        ? chatRow.opponentId
        : chatRow.creatorId;
    if (!chatRow) return;

    io.to(userSocketRoomPrefix + receiverId).emit("chat-typing-stop", {
      chatId: chatId,
    });
  });
}

export default chatController;
