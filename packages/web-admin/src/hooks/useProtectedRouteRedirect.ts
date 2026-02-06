import { UserStore } from '@af-charizard/sdk-stores'
import { useStore } from '@kazura/react-mobx'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useProtectedRouteRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userStore = useStore(UserStore)

  useEffect(() => {
    const protectedRoutes = [
      '/profit/invitation',
      '/vip/center',
      '/vip/history',
      '/vip/favorite',
      '/mail/message',
    ]

    // 检查当前路径是否在受保护的路由列表中
    const shouldRedirectToLogin = protectedRoutes.some((route) =>
      location.pathname.startsWith(route),
    )

    if (shouldRedirectToLogin && !userStore.user) {
      navigate('/login')
    }
  }, [location.pathname, navigate])

  return null // 这里可以根据需要返回其他数据
}

export default useProtectedRouteRedirect
