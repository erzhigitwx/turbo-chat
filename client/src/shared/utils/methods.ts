export async function Fetch(url: string, options: RequestInit) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  const data = await res.json()

  return data
}
