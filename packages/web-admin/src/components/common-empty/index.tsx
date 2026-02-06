import React from 'react'
import styled from '@emotion/styled'
import { Button, Empty, Typography } from 'antd'
import { useNavigate } from 'react-router'
import { useIsMobile } from '~/hooks'

const StyledEmpty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .ant-typography {
    color: #808080;
  }
  .ant-btn-primary {
    background-color: #3875f6 !important;
  }
`

interface IProps {
  navigateHandler?: () => void
  type?: string
  title?: string
}
export const CommonEmpty: React.FC<IProps> = ({
  navigateHandler,
  type,
  title,
}) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <StyledEmpty style={{ height: isMobile ? 200 : window.innerHeight - 140 }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Typography.Text>{title || '暂无数据'}</Typography.Text>}
      >
        {navigateHandler && (
          <Button
            type="primary"
            onClick={() => {
              type ? navigateHandler() : navigate(-1)
            }}
          >
            返回
          </Button>
        )}
      </Empty>
    </StyledEmpty>
  )
}
