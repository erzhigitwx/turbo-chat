import cl from "./header.module.scss";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuth } from "@/shared/hooks/useAuth";
import { Avatar, FrameCount, Toggler } from "@/shared/UI";
import LogoImg from "@/../public/logo.svg?react";
import ChatImg from "@/../public/icons/chat.svg?react";

const Header = () => {
  const isAuth = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <header className={cl.header}>
      <Link to={"/"}>
        <LogoImg />
      </Link>
      <div className={cl.headerLinks}>
        <Link to={"/"}>
          <FrameCount count={0}>
            <ChatImg className={clsx(isHomePage && "blue-stroke", "blue-stroke-hover")} />
          </FrameCount>
        </Link>
        <Toggler value={theme === "dark"} setter={toggleTheme} size={[48, 34]} isThemeToggler />
        {isAuth && (
          <Link to={"/profile"}>
            <Avatar isActive />
          </Link>
        )}
      </div>
    </header>
  );
};

export { Header };
