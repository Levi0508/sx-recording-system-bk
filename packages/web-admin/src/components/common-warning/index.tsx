import React, { ReactElement } from 'react'

import styled from '@emotion/styled'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'

const StyledCard = styled(Card)`
  width: calc((100 % - 20px));
  /* margin: 10px 0px 15px 10px; */
  margin-top: 6px;
  background-color: #f8e0e9;
  border-radius: 5px;

  .ant-card-bordered {
    border: 1px solid #f8e0e9;
  }
  .ant-card-body {
    padding: 15px;
  }

  div {
    color: #dd3e6a;
  }
`
interface IProps {
  style?: any
  children: ReactElement
}

export const CommentWarning: React.FC<IProps> = ({ children, style }) => {
  return (
    <StyledCard style={{ ...style }}>
      <Meta description={<div>{children}</div>} />
    </StyledCard>
  )
}
