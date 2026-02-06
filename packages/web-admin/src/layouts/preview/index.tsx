import React from 'react'

import { Layout, theme } from 'antd'
import { CommonHeader } from '~/components/common-header'
import { CommonFooter } from '~/components/common-footer'

import { Outlet } from 'react-router-dom'

import styled from '@emotion/styled'
import useProtectedRouteRedirect from '~/hooks/useProtectedRouteRedirect'

const { Content } = Layout
export const StyledPage = styled.div`
  padding: 12px 130px 24px 130px;

  width: 100%;
  height: 100%;
  background: ${({ colorBgContainer }: { colorBgContainer: any }) =>
    colorBgContainer};
  @media (max-width: 768px) {
    padding: 7px 13px;
  }
`
export const LayoutPreview: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  useProtectedRouteRedirect()

  return (
    <Layout hasSider style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Layout>
        <CommonHeader></CommonHeader>
        <Content style={{ overflow: 'auto' }}>
          <StyledPage colorBgContainer={colorBgContainer}>
            <Outlet />
          </StyledPage>
        </Content>
        <CommonFooter />
      </Layout>
    </Layout>
  )
}

export default LayoutPreview

export const LayoutReactNode = <LayoutPreview />
