import { useRoutes } from 'react-router-dom'

import { Loading, withFetchLoading } from '~/components/loading'
import { services } from '@af-charizard/sdk-services'
import type { HttpResponse, ResponsePacket } from '@af-charizard/sdk-utils'
import type { IResponseResource } from '@af-charizard/sdk-services/src/services/passport$create'
import { useMount } from 'ahooks'
import routes from '~/components/root/routes'
import { useStore } from '@kazura/react-mobx'
import { MailStore, UserStore } from '@af-charizard/sdk-stores'

interface RootRouteProps {
  result: HttpResponse<ResponsePacket<IResponseResource>>[]
}

const Component: React.FC<RootRouteProps> = ({ result }) => {
  const userStore = useStore(UserStore)
  const mailStore = useStore(MailStore)

  useMount(() => {
    if (window.name === 'newWindow') {
      const mobxData = sessionStorage.getItem('mobxData')

      if (mobxData) {
        try {
          const parsedData = JSON.parse(mobxData)
          userStore.setUser(parsedData.userStore.user)
          userStore.setPassport(parsedData.userStore.passport)
          userStore.setStatements(parsedData.userStore.statements)
          userStore.setPurchasedMonthGoods(
            parsedData.userStore.purchasedMonthGoods || {},
          )
          userStore.setPurchasedAnchorGoods(
            parsedData.userStore.purchasedAnchorGoods || {},
          )
          userStore.setPurchasedAnchorUpdatePackages(
            parsedData.userStore.purchasedAnchorUpdatePackages || {},
          )

          mailStore.setUnreadMail(parsedData.mailStore.unreadMail)
          mailStore.setReadMail(parsedData.mailStore.readMail)
          mailStore.setTypeMail(parsedData.mailStore.typeMail)
          mailStore.setTotalCount(parsedData.mailStore.totalCount)
          mailStore.setReadTotalCount(parsedData.mailStore.readTotalCount)
          mailStore.setTypeTotalCount(parsedData.mailStore.typeTotalCount)
        } catch (error) {
          console.error('解析 sessionStorage 数据失败:', error)
        }
      }
    } else {
      const resource = result[0].data.resource
      userStore.setPassport(resource.passport)
      userStore.setUser(resource.user)
      userStore.setStatements(resource.statements)
      userStore.setPurchasedMonthGoods(resource.purchasedMonthGoods || {})
      userStore.setPurchasedAnchorGoods(resource.purchasedAnchorGoods || {})
      userStore.setPurchasedAnchorUpdatePackages(
        resource.purchasedAnchorUpdatePackages || {},
      )

      window.localStorage.setItem('__PASSPORT', resource.passport.token)
    }
    window.name = String(Date.now()) // 改变窗口名字
  })

  const element = useRoutes(routes)

  if (!userStore.passport) return <Loading />

  return element
}

// export const RootRoute = withFetchLoading(Component, () => [
//   services.passport$create({}),
// ])
export const RootRoute = withFetchLoading(Component, () => {
  if (window.name === 'newWindow') return []
  // 新窗口不执行请求
  return [services.passport$create({})] // 执行请求
})
