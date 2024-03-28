import cl from "./chat-list.module.scss";
import clsx from "clsx";
import { Input } from "@/shared/UI/input/input";
import { Button } from "@/shared/UI/button/button";
import { ChatListItem } from "./chat-list-item/chat-list-item";
import SettingsImg from "@/../public/icons/settings.svg?react";
import SearchImg from "@/../public/icons/search.svg?react";
import PlusImg from "@/../public/icons/plus.svg?react";

const ChatList = () => {
  return (
    <div className={cl.chatList}>
      <header className={cl.chatListHeader}>
        <div>
          <span>
            <h1>чаты</h1>
            <h3>32</h3>
          </span>
          <ul>
            <Button>
              <SettingsImg className={"blue-fill-hover"} />
            </Button>
            <Button>
              <PlusImg className={"blue-stroke-hover"} />
            </Button>
          </ul>
        </div>
        <Input placeholder={"Поиск"} labelImg={<SearchImg />} />
      </header>
      <div className={clsx(cl.chatListBody, "scroll")}>
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
        <ChatListItem />
      </div>
    </div>
  );
};

export { ChatList };
