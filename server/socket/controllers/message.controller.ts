import { Server, Socket } from "socket.io";
import { socketMiddlewareRouting } from "../middleware/socket-middleware-routing.js";
import socketMiddleware from "../middleware/middleware.js";
import { UserData } from "../../types/user.js";
import { userSocketRoomPrefix } from "../../constants/index.js";
import { getChatById, uuid } from "../../utils/index.js";
import { createAttachMessage, createTextMessage } from "../../models/chat.js";
import { AttachType, Message } from "../../types/chat.js";

interface ChatMemberBody {
  userData: UserData;
  chatId: string;
}

function messageController(io: Server, socket: Socket) {
  socket.use(
    socketMiddlewareRouting(socketMiddleware.verifyToken, ["create-message"]),
  );

  socket.use(
    socketMiddlewareRouting(socketMiddleware.verifyChatMember, [
      "create-message",
    ]),
  );

  //   socket.use(middleware.validateMessage) it had better pass a message validate

  socket.on(
    "create-message",
    async (body: ChatMemberBody & { message: string; attach: AttachType }) => {
      const { userData, chatId, message, attach } = body;
      const type = attach ? attach.type : "text";
      const messageFormatted: Message = {
        senderId: userData.uid,
        createdAt: Date.now(),
        messageId: uuid(),
        content: message,
        clearedFor: [],
        status: "send",
        type,
      };

      if (attach && attach.data && attach.data.length > 0) {
        await createAttachMessage(chatId, attach.data, messageFormatted);
      }

      const newMessage = await createTextMessage(chatId, messageFormatted);
      const chatRow = await getChatById(chatId);

      if (newMessage.success || messageFormatted.attach) {
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
      }
    },
  );
}

export default messageController;
