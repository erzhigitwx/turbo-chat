import { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const SocketContext = createContext<Socket | null>(null)

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const socket = io('http://localhost:5000')
    socketRef.current = socket
    setIsReady(true)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={socketRef.current}>{isReady && children}</SocketContext.Provider>
  )
}

export { SocketProvider }
