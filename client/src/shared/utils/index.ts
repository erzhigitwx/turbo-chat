import { Message } from '@/shared/types'

export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export function setCookie(name: string, value: string, daysToExpire?: number) {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + daysToExpire!)

  var cookieString = name + '=' + encodeURIComponent(value)
  if (daysToExpire) {
    cookieString += '; expires=' + expirationDate.toUTCString()
  }

  document.cookie = cookieString
}

export function deleteCookie(name: string) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: any

  return function (this: void, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function calculateDateDifference(timestamp: number) {
  const now = Date.now()
  const difference = now - timestamp

  const seconds = Math.floor(difference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 1) {
    return `${days} дней назад`
  } else if (hours) {
    return `${hours} час. ${minutes % 60} мин.`
  } else if (minutes) {
    return `${minutes} мин.`
  } else {
    return `${seconds} сек.`
  }
}

export function formattedTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

export function formattedDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', options)
}

export function sortByDate(array: Array<any>, field: string) {
  return array.sort((a, b) => {
    return a[field] - b[field]
  })
}

export function groupMessagesByDay(messages: Message[]) {
  const groupedMessages: { [key: string]: Message[] } = {}

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt)
    const messageDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate(),
    ).toISOString()

    if (!groupedMessages[messageDay]) {
      groupedMessages[messageDay] = []
    }

    groupedMessages[messageDay].push(message)
  })

  const sortedGroupedMessages = Object.keys(groupedMessages)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => ({ day: date, messages: groupedMessages[date] }))

  return sortedGroupedMessages
}
