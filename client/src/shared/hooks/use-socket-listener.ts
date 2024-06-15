import { useContext, useEffect } from 'react'
import { SocketContext } from '@/app/providers/socket-provider'

function useSocketListener(event: string, handler: Function): void {
  const socket = useContext(SocketContext)

  useEffect(() => {
    socket?.on(event, (data: any) => handler(data))

    return () => {
      socket?.off(event, (data: any) => handler(data))
    }
  }, [socket])
}

export { useSocketListener }
