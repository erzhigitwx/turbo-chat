import cl from "./frame-count.module.scss";
import { ReactNode } from "react";

const FrameCount = ({ children, count }: { children: ReactNode; count: string | number }) => {
  return Number(count) ? (
    <div className={cl.frameCount}>
      <div className={cl.frameCountInner}>
        <p>{count}</p>
      </div>
      {children}
    </div>
  ) : (
    children
  );
};

export { FrameCount };
