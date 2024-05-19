import { Server, Socket } from "socket.io";
import { socketMiddlewareRouting } from "../middleware/socket-middleware-routing.ts";
import socketMiddleware from "../middleware/middleware.ts";
import { UserData } from "../../types/user.ts";
import { userSocketRoomPrefix } from "../../constants/index.ts";
import { findRefById } from "../../models/firebase.ts";
import { chatsCollection } from "../../config/index.ts";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getChatById, uuid } from "../../utils/index.ts";
import { Message } from "../../types/chat.ts";

interface ChatMemberBody {
  userData: UserData;
  chatId: string;
}

function messageController(io: Server, socket: Socket) {
  socket.use(
    socketMiddlewareRouting(socketMiddleware.verifyToken, [
      "create-message",
      "create-call",
    ]),
  );

  socket.use(
    socketMiddlewareRouting(socketMiddleware.verifyChatMember, [
      "create-message",
      "create-call",
    ]),
  );

  //   socket.use(middleware.validateMessage) it had better pass a message validate

  socket.on(
    "create-message",
    async (body: ChatMemberBody & { message: string }) => {
      const { userData, chatId, message } = body;

      const chatRef = await findRefById(chatsCollection, "id", chatId);
      const messagesCollection = collection(chatRef.ref, "messages");
      const messageFormatted = {
        senderId: userData.uid,
        createdAt: Date.now(),
        messageId: uuid(),
        content: message,
        clearedFor: [],
        status: "send",
        type: "text",
      };
      const newMessage = await addDoc(
        messagesCollection,
        messageFormatted as Message,
      );
      const chatRow = await getChatById(chatId);
      if (!chatRow) return;

      if (chatRow.deletedFor.length) {
        await updateDoc(chatRef.ref, { deletedFor: [] });
      }

      if (newMessage) {
        await updateDoc(chatRef.ref, { unread: chatRow.unread + 1 });
        io.to(userSocketRoomPrefix + chatRow.creatorId).emit(
          "incoming-message",
          {
            chatId: chatId,
            message: messageFormatted,
          },
        );
        io.to(userSocketRoomPrefix + chatRow.opponentId).emit(
          "incoming-message",
          {
            chatId: chatId,
            message: messageFormatted,
          },
        );
      } else {
        return;
      }
    },
  );
}

export default messageController;
