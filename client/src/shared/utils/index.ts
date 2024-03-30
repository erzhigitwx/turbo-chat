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
