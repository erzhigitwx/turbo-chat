import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { routes } from '@/app/config/routes/routes'
import { getCookie } from '@/shared/utils'
import { useEffect } from 'react'

const Layout = () => {
  const token = getCookie('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (token && window.location.pathname === '/registration') {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.name}
          path={route.path}
          element={route.credentials && !token ? <Navigate to={'/registration'} /> : route.element}
        />
      ))}
    </Routes>
  )
}

export { Layout }
