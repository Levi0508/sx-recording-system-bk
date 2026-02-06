import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useStore } from '@kazura/react-mobx'
import { MailStore, UserStore } from '@af-charizard/sdk-stores'
import { Image, CollapseProps, Collapse } from 'antd'

import { useIsMobile } from '~/hooks/useIsMobile'

import { useNavigate } from 'react-router'
import { CommonEmpty } from '~/components/common-empty'
import { StyledTitle, StyledTop } from '~/pages/vip-preview/components/favorite'
import { Extar } from './extar'
import { services } from '@af-charizard/sdk-services'
import { MailCard } from './mail-card'
import { StyledPagination } from '~/pages/classification-detail'
import { CommonPagination } from '~/components/common-pagination'
import { usePagination } from '~/hooks'

import { NOTIFICATION_TYPE_ENUM } from '@af-charizard/sdk-types'

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
const StyledTitle2 = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 768px) {
    max-width: 220px;
  }
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

    border: 1px solid #edeff6;
    border-radius: 0 0 10px 10px;
    min-height: 100px;
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
const titleMap = new Map<string, string>([
  [NOTIFICATION_TYPE_ENUM.USER, '个人私信'],
  [NOTIFICATION_TYPE_ENUM.SYSTEM, '系统通知'],
  [NOTIFICATION_TYPE_ENUM.VIDEO, '评论回复'],
])
interface IProps {
  type: NOTIFICATION_TYPE_ENUM
  setIsClicked?: React.Dispatch<React.SetStateAction<string>>
}
export const TypePage: React.FC<IProps> = ({ setIsClicked, type }) => {
  //用户信息
  const userStore = useStore(UserStore)
  const mailStore = useStore(MailStore)

  const navigate = useNavigate()

  const isMobile = useIsMobile()

  const { tableParams, handleTableChange } = usePagination(10)

  const [isChooseId, setIsChooseId] = useState<number>()

  const [userId, setUserId] = useState<number | undefined>()

  const [emailModal, setEmailModal] = useState(false)

  const items: CollapseProps['items'] = mailStore.typeMail?.map(
    (notification) => ({
      key: notification.id.toString(),
      label: (
        <StyledTitle2
          onClick={() => {
            // removeFavorite(notification.id)
            setIsChooseId(notification.id)
          }}
        >
          {notification.title}
        </StyledTitle2>
      ),
      extra: (
        <div>
          <Extar
            type={notification.type}
            userId={notification.sendByUser.id}
            setUserId={setUserId}
            setEmailModal={setEmailModal}
            videoId={notification.videoId}
            classification={notification.classification}
          ></Extar>
        </div>
      ),
      children: <MailCard notification={notification}></MailCard>,
    }),
  )
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
   * 查询消息
   */
  const getTypeMail = async () => {
    const resp = await services.notification$receive$type({
      type,
      ...tableParams,
    })

    if (resp.data.code === 200) {
      mailStore.setTypeMail(resp.data.resource.list)
      mailStore.setTypeTotalCount(resp.data.resource.totalCount)
    } else {
      mailStore.setTypeMail([])
      mailStore.setTypeTotalCount(0)
    }
  }

  useEffect(() => {
    getTypeMail()
  }, [tableParams])

  useEffect(() => {
    isChooseId && readHandler(isChooseId)
  }, [isChooseId])

  return (
    <StyledPage>
      <div>
        <StyledTop>
          <StyledTitle>{titleMap.get(type)}</StyledTitle>
        </StyledTop>

        <div>
          {mailStore.typeMail.length > 0 ? (
            <Collapse
              items={items}
              bordered={false}
              // defaultActiveKey={mailStore.typeMail[0].id.toString()}
              size={isMobile ? 'middle' : 'large'}
              accordion
            />
          ) : (
            <CommonEmpty title="暂无消息"></CommonEmpty>
          )}
        </div>
        <StyledPagination>
          <CommonPagination
            total={mailStore.typeTotalCount}
            totalInfo={`共 ${mailStore.typeTotalCount} 个消息`}
            currentPage={tableParams.currentPage}
            pageSize={tableParams.pageSize}
            onPageChange={handleTableChange}
            pageSizeOptions={[10, 20]}
          />
        </StyledPagination>
      </div>
      <CommonSendMail
        isModalShow={emailModal}
        setIsModalShow={setEmailModal}
        userId={userId!}
      ></CommonSendMail>
    </StyledPage>
  )
}
