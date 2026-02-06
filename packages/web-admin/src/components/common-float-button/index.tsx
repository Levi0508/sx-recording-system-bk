import { UpOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd'
import { useIsMobile } from '~/hooks'
import ListIMG from '/list.svg'
import styled from '@emotion/styled'
import { useState } from 'react'
import CommonRanking from '../common-ranking'

const StyledRankFloatButton = styled(FloatButton)`
  .ant-float-btn-body {
    background-color: #ffd700;
    :hover {
      background-color: #ffd700;
    }
  }
`

export const CommonFloatButton = () => {
  const isMobile = useIsMobile()

  const [isShowModal, setIsShowModal] = useState(false)

  return (
    <>
      {/* <FloatButton.Group
        trigger={isMobile ? 'click' : 'click'}
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton icon={<img width={18} height={18} src={ListIMG}></img>} />

      </FloatButton.Group> */}

      <StyledRankFloatButton
        type="primary"
        icon={<img width={18} height={18} src={ListIMG}></img>}
        onClick={() => {
          setIsShowModal(true)
        }}
      />

      <FloatButton.BackTop
        icon={<UpOutlined />}
        type="default"
        style={{ right: 24 }}
        visibilityHeight={200}
      />
      <CommonRanking
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
      ></CommonRanking>
    </>
  )
}
