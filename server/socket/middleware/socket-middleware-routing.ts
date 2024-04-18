import { Event, Socket } from "socket.io";

export function socketMiddlewareRouting(
  middlewareFunc: (
    event: Event,
    next: (err?: Error | undefined) => void,
    socket?: Socket,
  ) => void,
  paths?: string[],
  socket?: Socket,
) {
  return (event: Event, next: (err?: Error | undefined) => void): void => {
    const [path] = event;
    if (paths && !paths.includes(path)) return next();
    middlewareFunc(event, next, socket);
  };
}
