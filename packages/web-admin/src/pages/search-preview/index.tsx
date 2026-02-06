import { services } from '@af-charizard/sdk-services'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { StyledPagination, StyledVideos } from '../classification-detail'
import { useOpenNewWindow, usePagination } from '~/hooks'

import { useScreenWidth } from '~/hooks'

import { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import { CommonPagination } from '~/components/common-pagination'
import { CommonVideoCard } from '~/components/common-video-card'
import { CommonEmpty } from '~/components/common-empty'
import { Loading } from '~/components/loading'
import styled from '@emotion/styled'

const StyledDiv = styled.div`
  padding: 20px 0 20px 10px;
  font-size: 25px;
  @media (max-width: 768px) {
    padding: 10px 0 10px 10px;
    font-size: 15px;
  }
`
const PageSearchPreview = () => {
  const navigate = useNavigate()

  const location = useLocation()
  const openNewWindow = useOpenNewWindow()

  // const { title } = useParams()
  const { value }: { value: string } = location.state || {}
  const [videoList, setVideoList] = useState<IlistItem[]>([])
  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 6,
    threshold: 2,
  })
  const { tableParams, handleTableChange } = usePagination(60)

  //总数
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  /**
   * 搜索
   */
  const searchHandler = async () => {
    const resp = await services.video$search$title({
      title: value ?? '',
      ...tableParams,
    })

    if (resp.data.code === 200) {
      setVideoList(resp.data.resource.list)
      setTotal(resp.data.resource.totalCount)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      setIsLoading(false) // 数据加载完成，更新加
    }
  }

  useEffect(() => {
    searchHandler()
  }, [value, tableParams])

  return (
    <div>
      <StyledDiv>搜索："{value}"</StyledDiv>
      <StyledVideos>
        {isLoading ? (
          <Loading />
        ) : videoList.length > 0 ? (
          videoList?.map((item: any) => (
            <CommonVideoCard
              title={item.title}
              type={item.classification}
              bgImg={item.path}
              key={item.id}
              duration={item.duration}
              size={item.size}
              date={item.createdAt}
              witdhPartNumber={widthPartNumber}
              clickHandler={() => openNewWindow(item)}
            ></CommonVideoCard>
          ))
        ) : (
          <CommonEmpty navigateHandler={() => navigate('/')} type="search" />
        )}
      </StyledVideos>
      <StyledPagination>
        <CommonPagination
          total={total}
          totalInfo={`共 ${total} 个视频`}
          currentPage={tableParams.currentPage}
          pageSize={tableParams.pageSize}
          onPageChange={handleTableChange}
        />
      </StyledPagination>
    </div>
  )
}

export default PageSearchPreview
