import styled from '@emotion/styled'
import { Button, Modal } from 'antd'
import React, { ReactElement } from 'react'
import { useIsMobile } from '~/hooks'

const OuterDiv = styled.div`
  margin-top: 30px;
  @media (max-width: 768px) {
    margin-top: 20px;
  }

  background-color: #fff;
`

interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  oKHandler: any
  childrenPart: ReactElement
  isFooter?: boolean
  width?: number
  isLoading?: boolean
}
export const CommonModal: React.FC<IProps> = ({
  isModalShow,
  setIsModalShow,
  oKHandler,
  title,
  childrenPart,
  isFooter = true,
  width,
  isLoading = false,
}) => {
  const isMobile = useIsMobile()
  return (
    <Modal
      width={width ? width : isMobile ? '300px' : '400px'}
      title={title}
      maskClosable={false}
      destroyOnClose
      open={isModalShow}
      onCancel={() => setIsModalShow(false)}
      footer={
        isFooter && (
          <div style={{ width: '100%', textAlign: 'center', marginTop: 30 }}>
            <Button
              key="back"
              onClick={() => setIsModalShow(false)}
              style={{ marginRight: 30 }}
            >
              取消
            </Button>
            <Button
              key="ok"
              type="primary"
              loading={isLoading}
              onClick={() => oKHandler()}
              style={{ backgroundColor: '#FB7299', color: '#fff' }}
            >
              确认
            </Button>
          </div>
        )
      }
    >
      <OuterDiv>{childrenPart}</OuterDiv>
    </Modal>
  )
}
