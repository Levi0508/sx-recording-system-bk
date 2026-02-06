import styled from '@emotion/styled'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'

import { services } from '@af-charizard/sdk-services'

import { useParams } from 'react-router-dom'
import { CommonVideoCard } from '~/components/common-video-card'
import { useOpenNewWindow, useScreenWidth } from '~/hooks'

import { CommonBreadcrumb } from '~/components/common-breadcrumb'
import { CommonPagination } from '~/components/common-pagination'
import { usePagination } from '~/hooks'

import { CommonEmpty } from '~/components/common-empty'
import { Loading } from '~/components/loading'
import { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import { Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { FILTER_ENUM } from '@af-charizard/sdk-types'
import { StyledHidden } from '../video-detail'

import { useUpdateEffect } from 'ahooks'
import CommonAdvertising from '~/components/common-advertising'

export const StyledVideos = styled.div`
  display: flex;
  justify-content: flex-start; /* 左对齐 */
  flex-wrap: wrap; /* 换行 */
`
export const StyledPagination = styled.div`
  width: 100%;
  text-align: center;
  margin: 15px 0 5px 0;
`
export const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    &:hover .ant-tabs-tab-btn {
      color: #ea7a99;
    }
  }
  .ant-tabs-tab:nth-of-type(1) {
    margin-left: 10px !important;
  }
  @media (max-width: 768px) {
    .ant-tabs-tab {
      margin-left: 18px !important;
    }
    .ant-tabs-tab:nth-of-type(1) {
      margin-left: 10px !important;
    }
    /* margin-left: 18px !important; */
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #ea7a99;
  }
  .ant-tabs-ink-bar {
    background: #ea7a99;
  }
`
export interface TableParams {
  currentPage: number
  pageSize: number
}
export const PageClassificationDetail = () => {
  const { type } = useParams()

  const navigate = useNavigate()

  const openNewWindow = useOpenNewWindow()
  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 6,
    threshold: 2,
  })
  const { tableParams, handleTableChange } = usePagination(60)

  const items = [
    {
      title: <a>首页</a>,
      onClick: () => navigate('/'),
    },
    {
      title: <a>全部分类</a>,
      onClick: () => navigate('/classification'),
    },
    {
      title: <StyledHidden>{type}</StyledHidden>,
    },
  ]

  const [videoList, setVideoList] = useState<IlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false) // 增加一个加载状态

  //总数
  const [total, setTotal] = useState(0)
  const [sortType, setSortType] = useState(FILTER_ENUM.NEW) // 新增排序方式的状态

  const handleTabChange = (key: string) => {
    setSortType(key as FILTER_ENUM)
  }
  /**
   * 获取视频列表
   * @param values
   */
  const getClassificationAllVideo = async () => {
    setIsLoading(true)
    const resp = await services.video$classification({
      ...tableParams,
      sortType,
      classification: type!,
    })

    if (resp.data.code === 200) {
      setVideoList(resp.data.resource.list)
      setTotal(resp.data.resource.totalCount)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      setVideoList([])
      setTotal(0)
      setIsLoading(false) // 数据加载完成，更新加
    }
  }

  useUpdateEffect(() => {
    handleTableChange(1, tableParams.pageSize)
  }, [sortType])

  useEffect(() => {
    getClassificationAllVideo()
  }, [tableParams])

  return (
    <>
      {type && <CommonBreadcrumb items={items} />}
      <StyledTabs defaultActiveKey={FILTER_ENUM.NEW} onChange={handleTabChange}>
        <TabPane tab="最新视频" key={FILTER_ENUM.NEW} />
        <TabPane tab="点赞最多" key={FILTER_ENUM.LIKES} />
        <TabPane tab="收藏最多" key={FILTER_ENUM.FAVORITES} />
        <TabPane tab="播放最多" key={FILTER_ENUM.PLAYTIMES} />
      </StyledTabs>
      {/* <CommonAdvertising height={100} /> */}
      <StyledVideos>
        {isLoading ? (
          <Loading />
        ) : videoList.length > 0 ? (
          <>
            {videoList?.map((item) => (
              <CommonVideoCard
                title={item.title}
                type={item.classification}
                bgImg={item.path}
                key={item.id}
                duration={item.duration}
                size={item.size}
                date={item.createdAt}
                witdhPartNumber={widthPartNumber}
                clickHandler={() => {
                  openNewWindow(item)
                }}
              ></CommonVideoCard>
            ))}
            <StyledPagination>
              <CommonPagination
                total={total}
                totalInfo={`共 ${total} 个视频`}
                currentPage={tableParams.currentPage}
                pageSize={tableParams.pageSize}
                onPageChange={handleTableChange}
              />
            </StyledPagination>
          </>
        ) : (
          <CommonEmpty navigateHandler={() => navigate('/')} />
        )}
      </StyledVideos>
    </>
  )
}

export default PageClassificationDetail
