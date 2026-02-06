import styled from '@emotion/styled'
import { Breadcrumb } from 'antd'
import React from 'react'
const StyledBreadcrumb = styled(Breadcrumb)`
  padding: 10px;
  background-color: #eaecef;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 15px;

  a {
    color: #2f6bf6;
  }
  @media (max-width: 768px) {
    padding: 5px;
    padding-left: 10px;
  }
`

interface IProps {
  items: { title?: any; onClick?: () => void }[]
}
export const CommonBreadcrumb: React.FC<IProps> = ({ items }) => {
  return <StyledBreadcrumb items={items} />
}
