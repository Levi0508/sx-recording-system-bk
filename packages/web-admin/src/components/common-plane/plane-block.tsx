import React from 'react'
import styled from '@emotion/styled'
import { DataProps } from './index'

const StyledPage = styled.div(
  {
    width: '100%',
    height: '100%',
    padding: '15px 5px 15px 20px',
    backgroundColor: '#fff',
    borderLeft: '3px solid #999',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  (props) => ({ borderLeftColor: props.color }),
)
const StyledCenter = styled.div`
  margin-top: 20px;
  font-size: 14px;
  & > strong {
    font-size: 28px;
  }
`
export const StyledTitle = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 800;
`

export const PagePlaneBlock = (props: DataProps) => {
  return (
    <StyledPage color={props.borderLeftColor}>
      <StyledTitle>{props.title}</StyledTitle>
      <StyledCenter style={{ color: props.borderLeftColor }}>
        <strong>{props.count}</strong>
      </StyledCenter>
    </StyledPage>
  )
}
