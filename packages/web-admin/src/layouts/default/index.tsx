import React, { useEffect, useMemo, useState } from 'react'
import {
  DashboardOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined,
  UserOutlined,
  SettingOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, theme, Button, message } from 'antd'
import { css } from '@emotion/css'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { services } from '@af-charizard/sdk-services'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import CommonFooter from '~/components/common-footer'
import styled from '@emotion/styled'
import { useIsMobile } from '~/hooks'

const { Header, Content, Sider } = Layout

export const StyledPage = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ colorBgContainer }: { colorBgContainer: any }) =>
    colorBgContainer};
  @media (max-width: 768px) {
    padding: 7px 13px;
  }
`

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('航空舱', '/dashboard', <DashboardOutlined />),
  getItem('操作模块', '/handler', <SettingOutlined />),
  getItem('用户分析', '/users/information', <UserOutlined />),
  getItem('每日数据', '/daily-data', <CrownOutlined />),
  getItem('视频分析', '/videos/information', <VideoCameraOutlined />),
  getItem('收入分析', '/money/information', <MoneyCollectOutlined />),
  getItem('兑换查询', '/exchange-query', <MoneyCollectOutlined />),
  // getItem('视频模块', '/videos', <VideoCameraOutlined />, [
  //   getItem('视频分析', '/videos/information'),
  // ]),
  // getItem('用户模块', '/users', <UserOutlined />, [
  //   getItem('用户分析', '/users/information'),
  // ]),
  // getItem('收入模块', '/money', <MoneyCollectOutlined />, [
  //   getItem('收入分析', '/money/information'),
  // ]),
]

export const LayoutDefault: React.FC = () => {
  const isMobile = useIsMobile()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const history = useNavigate()
  const navigate = useNavigate()

  const userStore = useStore(UserStore)
  console.log(
    '%c这是锋酱的打印',
    'color: red; font-size: 30px;',
    JSON.parse(JSON.stringify(userStore.statements)),
  )

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const menuDefaultSelected = useMemo(() => {
    const defaultSelectedKeys: string[] = [location.pathname]

    const defaultOpenKeys: string[] = []
    const parts = location.pathname.split('/')
    if (parts.length > 2) defaultOpenKeys.push('/' + parts[1])

    return {
      defaultSelectedKeys,
      defaultOpenKeys,
      selectedKeys: defaultSelectedKeys,
    }
  }, [location.pathname])

  /**
   * 登出
   */
  const logOutHandler = async () => {
    localStorage.removeItem('__PASSPORT')
    const resp2 = await services.passport$create({})

    userStore.setPassport(resp2.data.resource.passport)
    userStore.setUser(resp2.data.resource.user)
    userStore.setStatements(resp2.data.resource.statements)
    userStore.setPurchasedMonthGoods(resp2.data.resource.purchasedMonthGoods || {})
    userStore.setPurchasedAnchorGoods(resp2.data.resource.purchasedAnchorGoods || {})
    userStore.setPurchasedAnchorUpdatePackages(
      resp2.data.resource.purchasedAnchorUpdatePackages || {},
    )

    localStorage.setItem('__PASSPORT', resp2.data.resource.passport.token)
    message.success('退出成功')
    navigate('/')
    // window.close()
  }
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }, [isMobile])
  return (
    userStore.hasAccess('user:manage:all') && (
      <Layout hasSider style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            className={css`
              height: 32px;
              margin: 16px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 6px;
              text-align: center;
              color: #fff;
              line-height: 32px;
              font-weight: 600;
              cursor: pointer;
            `}
            onClick={() => {
              navigate('/')
            }}
          >
            😊 {collapsed ? '' : 'AF-Share'}
          </div>
          <Menu
            theme="dark"
            onSelect={({ key }) => {
              if (key.startsWith('/')) {
                console.log(key)
                history(key)
              }
            }}
            mode="inline"
            items={items}
            {...menuDefaultSelected}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200, // 根据 Sider 的收拢状态调整 margin-left
            transition: 'margin-left 0.2s', // 添加过渡效果
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              position: 'sticky',
              top: 0,
              width: '100%',
              zIndex: 999,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'right',
              paddingRight: 50,
            }}
          >
            <Button onClick={logOutHandler}>登出</Button>
          </Header>

          <Content
            style={{
              padding: '16px 16px 0px 16px',
            }}
          >
            <StyledPage colorBgContainer={colorBgContainer}>
              <Outlet />
            </StyledPage>
          </Content>

          <CommonFooter></CommonFooter>
        </Layout>
      </Layout>
    )
  )
}

export default LayoutDefault

export const LayoutReactNode = <LayoutDefault />
