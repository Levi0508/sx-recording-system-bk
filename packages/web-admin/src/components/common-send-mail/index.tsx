import React, { useEffect, useState } from 'react'

import { Button, Card, Input, Modal, message } from 'antd'
import { useIsMobile } from '~/hooks/useIsMobile'
import styled from '@emotion/styled'
import { services } from '@af-charizard/sdk-services'
import { IUserInfo } from '@af-charizard/sdk-services/src/services/user$find$userId'

import { NOTIFICATION_TYPE_ENUM } from '@af-charizard/sdk-types'
import { UserStore } from '@af-charizard/sdk-stores'
import { useStore } from '@kazura/react-mobx'
import { checkMembershipStatus } from '~/utils/isVip'

const { TextArea } = Input

const StyledModal = styled(Modal)`
  .ant-card-actions {
    span {
      font-size: 20px !important;
    }
  }
  .ant-modal-body {
    margin-top: 15px;
  }
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 20px 15px;
    }
    .ant-modal-content {
      padding: 15px;
    }
    .ant-modal-body {
      margin-top: 15px;
    }
  }
  /* 添加偏移量 */
  top: 200px; /* 调整垂直方向偏移量 */
`

const { Meta } = Card
interface IProps {
  isModalShow: boolean
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>
  userId: number
}
const CommonSendMail: React.FC<IProps> = ({
  isModalShow,
  setIsModalShow,
  userId,
}) => {
  const userStore = useStore(UserStore)

  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const [textAreaValue, setTextAreaValue] = useState('')
  const isMobile = useIsMobile()

  const membershipStatus = checkMembershipStatus(userInfo?.vipDeadLine)

  const onChange = (checked: boolean) => {
    setLoading(!checked)
  }

  const getUserInfo = async () => {
    const resp = await services.user$find$userId({
      userId,
    })

    if (resp.data.code === 200) {
      setLoading(false)
      setUserInfo(resp.data.resource)
    } else {
      message.error(resp.data.message)
    }
  }
  const sendMail = async () => {
    const resp = await services.notification$create({
      userId, //收件人
      message: textAreaValue,
      title: `来自用户 “${userStore.user?.nickname || '默认昵称'}” 的私信`,
      type: NOTIFICATION_TYPE_ENUM.USER,
    })

    if (resp.data.code === 200) {
      message.success('发送成功')
      setIsModalShow(false)
      // setTimeout(() => {
      //   setIsModalShow(false)
      // })
    } else {
      message.error(resp.data.message)
    }
  }

  useEffect(() => {
    if (isModalShow) {
      getUserInfo()
    } else {
      setTextAreaValue('')
    }
  }, [isModalShow])

  return (
    <StyledModal
      width={isMobile ? '300px' : '380px'}
      destroyOnClose
      open={isModalShow}
      title={'发送私信'}
      onCancel={() => setIsModalShow(false)}
      footer={
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
            onClick={sendMail}
            style={{ backgroundColor: '#FB7299', color: '#fff' }}
          >
            确认
          </Button>
        </div>
      }
    >
      <TextArea
        rows={6}
        placeholder="请输入你想说的话"
        maxLength={233}
        showCount
        value={textAreaValue}
        onChange={(e) => {
          setTextAreaValue(e.target.value)
        }}
      />
    </StyledModal>
  )
}

export default CommonSendMail
