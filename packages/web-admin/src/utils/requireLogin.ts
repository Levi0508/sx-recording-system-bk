import { message } from 'antd'

/**
 * 显示"请先登录"提示，并在1秒后自动跳转到登录页
 */
export const requireLogin = () => {
  message.warning('请先登录或注册')
  setTimeout(() => {
    window.location.hash = '/login'
  }, 1000)
}

