import cl from "./chat.module.scss";
import { ChatList } from "./chat-list/chat-list";
import { ChatFrame } from "./chat-frame/chat-frame";

const Chat = () => {
  return (
    <div className={cl.chat}>
      <ChatList />
      <ChatFrame />
    </div>
  );
};

export { Chat };
