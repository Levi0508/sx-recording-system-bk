import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { services } from '@af-charizard/sdk-services'
import { useStore } from '@kazura/react-mobx'
import { MailStore, UserStore } from '@af-charizard/sdk-stores'

export const useLogout = (handler?: () => void) => {
  const navigate = useNavigate()
  const userStore = useStore(UserStore)
  const mailStore = useStore(MailStore)

  const logoutHandler = useCallback(async () => {
    try {
      // 移除本地存储的通行证
      localStorage.clear()

      await services.user$logout()
      // 创建新的通行证

      const resp2 = await services.passport$create({})

      // 更新用户存储
      userStore.setPassport(resp2.data.resource.passport)
      userStore.setUser(resp2.data.resource.user)
      userStore.setStatements(resp2.data.resource.statements)
      userStore.setPurchasedMonthGoods(resp2.data.resource.purchasedMonthGoods || {})
      userStore.setPurchasedAnchorGoods(resp2.data.resource.purchasedAnchorGoods || {})
      userStore.setPurchasedAnchorUpdatePackages(
        resp2.data.resource.purchasedAnchorUpdatePackages || {},
      )
      mailStore.setEmpty()
      // 将新的通行证存储到本地
      localStorage.setItem('__PASSPORT', resp2.data.resource.passport.token)

      // 显示成功消息
      message.success('退出成功')

      if (handler) {
        handler()
      } else {
        // 导航到首页
        navigate('/')
      }
    } catch (error) {
      // 处理错误
      message.error('退出失败，请稍后再试')
      console.error('Logout failed:', error)
    }
  }, [navigate])

  return logoutHandler
}
