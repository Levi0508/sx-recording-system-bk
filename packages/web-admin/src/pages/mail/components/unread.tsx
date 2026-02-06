import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { MailStore, UserStore } from '@af-charizard/sdk-stores'
import { Image, CollapseProps, Collapse, Button, message } from 'antd'

import { services } from '@af-charizard/sdk-services'
import { useIsMobile } from '~/hooks/useIsMobile'

import { useMount } from 'ahooks'
import { useNavigate } from 'react-router'
import { CommonEmpty } from '~/components/common-empty'
import { StyledTitle, StyledTop } from '~/pages/vip-preview/components/favorite'
import { Extar } from './extar'
import { MailCard } from './mail-card'
import { StyledPagination } from '~/pages/classification-detail'
import { CommonPagination } from '~/components/common-pagination'
import { usePagination } from '~/hooks'

import CommonSendMail from '~/components/common-send-mail'

export interface IVipCard {
  goodsId: string
  bgIMG: string
  title: string
  price: number
  originalPprice: number
  indate: number
}

export const StyledImage = styled(Image)`
  background-size: cover;
  background-position: center;
  width: 60px !important;
  height: 60px !important;
  border-radius: 50% !important; // 强制圆角
  object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出
`
export const StyledImage2 = styled.img`
  background-size: cover;
  background-position: center;

  border-radius: 50% !important; // 强制圆角
  object-fit: cover !important; // 确保图片覆盖整个容器
  overflow: hidden !important; // 确保内容不溢出
`

const StyledPage = styled.div`
  width: 100%;
  .ant-card-body {
    height: 100%;
    padding: 15px 15px 15px 15px;
  }
  .ant-avatar {
    width: 50px;
    height: 50px;
  }

  .ant-collapse-content-box {
    background-color: #fff;
    border-left: 1px solid #edeff6;
    border-right: 1px solid #edeff6;
    border-bottom: 1px solid #edeff6;
    border-radius: 0 0 10px 10px;
    min-height: 150px;
    padding-bottom: 10px !important;
  }
  .ant-collapse-item {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    .ant-card {
      height: 100%;
    }
  }
  .ant-card-meta-title {
    margin-bottom: 4px !important;
  }
  .ant-collapse-content > .ant-collapse-content-box {
    padding-top: 15px !important;
  }
`

interface IProps {
  setIsClicked?: React.Dispatch<React.SetStateAction<string>>
}
export const UnRead: React.FC<IProps> = ({ setIsClicked }) => {
  //用户信息
  const userStore = useStore(UserStore)
  const mailStore = useStore(MailStore)
  const navigate = useNavigate()

  const [userId, setUserId] = useState<number | undefined>()

  const [emailModal, setEmailModal] = useState(false)

  const isMobile = useIsMobile()
  const { tableParams, handleTableChange } = usePagination(10)

  const [isChooseId, setIsChooseId] = useState<number>()

  const items: CollapseProps['items'] = mailStore.unreadMail?.map(
    (notification) => ({
      key: notification.id.toString(),
      label: (
        <div
          onClick={() => {
            // removeFavorite(notification.id)
            setIsChooseId(notification.id)
          }}
        >
          {notification.title}
        </div>
      ),
      extra: (
        <Extar
          type={notification.type}
          userId={notification.sendByUser.id}
          setUserId={setUserId}
          setEmailModal={setEmailModal}
          videoId={notification.videoId}
          classification={notification.classification}
        ></Extar>
      ),
      children: <MailCard notification={notification}></MailCard>,
    }),
  )

  /**
   * 查询未读消息
   */
  const getUnreadMail = async () => {
    const resp = await services.notification$receive$unread({
      ...tableParams,
    })

    if (resp.data.code === 200) {
      mailStore.setUnreadMail(resp.data.resource.list)
      mailStore.setTotalCount(resp.data.resource.totalCount)
    } else {
      mailStore.setUnreadMail([])
      mailStore.setTotalCount(0)
    }
  }

  /**
   * 已读
   * @param videoId
   */
  const readHandler = async (notificationId: number) => {
    const resp = await services.notification$read({
      notificationId,
    })
    if (resp.data.code === 200) {
      mailStore.setTotalCount(mailStore.totalCount - 1)
    } else {
    }
  }
  /**
   * 一键已读
   * @param videoId
   */
  const readAllHandler = async () => {
    if (mailStore.unreadMail.length === 0) {
      message.warning('目前没有未读信息')
      return
    }

    const resp = await services.notification$read$all()
    if (resp.data.code === 200) {
      message.success('已读成功')

      mailStore.setUnreadMail([])
      mailStore.setTotalCount(0)
    } else {
      message.error(resp.data.message)
    }
  }
  useMount(() => {
    if (mailStore.unreadMail.length > 0) {
      setIsChooseId(mailStore.unreadMail[0].id)
    }
  })

  useEffect(() => {
    isChooseId && readHandler(isChooseId)
  }, [isChooseId])

  useEffect(() => {
    getUnreadMail()
  }, [tableParams])

  return (
    <StyledPage>
      <div>
        <StyledTop>
          <StyledTitle>
            未读消息
            <Button type="link" onClick={readAllHandler}>
              一键已读
            </Button>
          </StyledTitle>
        </StyledTop>

        <div>
          {mailStore.unreadMail.length > 0 ? (
            <Collapse
              items={items}
              bordered={false}
              defaultActiveKey={mailStore.unreadMail[0].id.toString()}
              size={isMobile ? 'middle' : 'large'}
              accordion
            />
          ) : (
            <CommonEmpty title="暂无未读消息"></CommonEmpty>
          )}
        </div>
      </div>
      <StyledPagination>
        <CommonPagination
          total={mailStore.totalCount}
          totalInfo={`共 ${mailStore.totalCount} 个消息`}
          currentPage={tableParams.currentPage}
          pageSize={tableParams.pageSize}
          onPageChange={handleTableChange}
          pageSizeOptions={[10, 20]}
        />
      </StyledPagination>
      <CommonSendMail
        isModalShow={emailModal}
        setIsModalShow={setEmailModal}
        userId={userId!}
      ></CommonSendMail>
    </StyledPage>
  )
}
