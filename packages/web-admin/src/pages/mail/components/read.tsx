import React, { useEffect } from 'react'
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

    border: 1px solid #edeff6;
    border-radius: 0 0 10px 10px;
    min-height: 120px;
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
// Styled Components

interface IProps {
  setIsClicked?: React.Dispatch<React.SetStateAction<string>>
}
export const Read: React.FC<IProps> = ({ setIsClicked }) => {
  //用户信息
  const userStore = useStore(UserStore)
  const mailStore = useStore(MailStore)
  const navigate = useNavigate()

  const isMobile = useIsMobile()
  const { tableParams, handleTableChange } = usePagination(10)
  const items: CollapseProps['items'] = mailStore.readMail?.map(
    (notification) => ({
      key: notification.id.toString(),
      label: <div>{notification.title}</div>,
      extra: (
        <Extar
          type={notification.type}
          userId={notification.sendByUser.id}
          videoId={notification.videoId}
          classification={notification.classification}
        ></Extar>
      ),
      children: <MailCard notification={notification}></MailCard>,
    }),
  )
  /**
   * 查询已读消息
   */
  const getReadMail = async () => {
    const resp = await services.notification$receive$read({
      ...tableParams,
    })

    if (resp.data.code === 200) {
      mailStore.setReadMail(resp.data.resource.list)
      mailStore.setReadTotalCount(resp.data.resource.totalCount)
    } else {
      mailStore.setReadMail([])
      mailStore.setReadTotalCount(0)
    }
  }

  useEffect(() => {
    getReadMail()
  }, [tableParams])

  return (
    <StyledPage>
      <div>
        <StyledTop>
          <StyledTitle>已读消息</StyledTitle>
        </StyledTop>

        <div>
          {mailStore.readMail.length > 0 ? (
            <Collapse
              items={items}
              bordered={false}
              defaultActiveKey={mailStore.readMail[0].id.toString()}
              size={isMobile ? 'middle' : 'large'}
              accordion
            />
          ) : (
            <CommonEmpty title="暂无未读消息"></CommonEmpty>
          )}
        </div>
        <StyledPagination>
          <CommonPagination
            total={mailStore.readTotalCount}
            totalInfo={`共 ${mailStore.readTotalCount} 个消息`}
            currentPage={tableParams.currentPage}
            pageSize={tableParams.pageSize}
            onPageChange={handleTableChange}
            pageSizeOptions={[10, 20]}
          />
        </StyledPagination>
      </div>
    </StyledPage>
  )
}
