import React from 'react'
import styled from '@emotion/styled'
import { Layout } from 'antd'

const { Footer } = Layout

const StyledFooter = styled(Footer)`
  text-align: center;
  padding: 15px;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 8px;
  }
`
export const CommonFooter: React.FC = () => {
  return (
    <StyledFooter style={{ textAlign: 'center', padding: 15 }}>
      Copyright © 2020 - {new Date().getFullYear()} AF-Share. All Rights
      Reserved.
    </StyledFooter>
  )
}

export default CommonFooter
