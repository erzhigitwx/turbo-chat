export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export function setCookie(name: string, value: string, daysToExpire: number) {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + daysToExpire)

  var cookieString = name + '=' + encodeURIComponent(value)
  if (daysToExpire) {
    cookieString += '; expires=' + expirationDate.toUTCString()
  }

  document.cookie = cookieString
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
  const difference = new Date(Date.now() - timestamp)
  const hours = difference.getHours()
  const minutes = difference.getMinutes()
  const seconds = difference.getSeconds()

  if (hours) {
    return `${hours} час. ${minutes} мин.`
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
