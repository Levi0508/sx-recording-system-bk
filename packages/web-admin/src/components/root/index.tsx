import { HashRouter } from 'react-router-dom'
import { RootRoute } from './root-router'
import { ConfigProvider } from 'antd'
// import enUS from 'antd/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'

import { MobxProvider } from '@kazura/react-mobx'
import { stores } from '@af-charizard/sdk-stores'
import { CommonFloatButton } from '../common-float-button'
import { ClickToComponent } from 'click-to-react-component'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export const Root = () => {
  return (
    <MobxProvider stores={stores}>
      <ConfigProvider locale={zhCN}>
        <ClickToComponent editor="cursor" />
        <HashRouter>
          <RootRoute />
          <CommonFloatButton />
        </HashRouter>
      </ConfigProvider>
    </MobxProvider>
  )
}
