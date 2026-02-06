import React, { useState } from 'react'
import styled from '@emotion/styled'
import { VIDEO_TYPE_ENUM } from '@af-charizard/sdk-types/src/video-type'
import { useNavigate } from 'react-router'

import { services } from '@af-charizard/sdk-services'
import { useMount } from 'ahooks'
import { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import { CommonVideoCard } from '~/components/common-video-card'
import { useScreenWidth } from '~/hooks'

import { useIsMobile } from '~/hooks'

const StyledVideos = styled.div`
  display: flex;
  justify-content: flex-start; /* 左对齐 */
  flex-wrap: wrap; /* 换行 */
  overflow-y: scroll;
`

const StyledRecommendationsTitle = styled.div`
  margin: 6px;
  padding: 10px;
  font-size: 20px;
  font-weight: 800;
  @media (max-width: 768px) {
    margin: 8px;
    font-size: 16px;
    padding: 5px;
  }
`
const StyledPage = styled.div`
  /* width: 25%; */
  margin-left: 40px;
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0px;
  }
`
interface IProps {
  videoType: VIDEO_TYPE_ENUM
  title: string
  type: boolean //true相关推荐 false其他推荐
}
export const RecommendationsBar: React.FC<IProps> = ({
  videoType,
  title,
  type,
}) => {
  // const openNewWindow = useOpenNewWindow()
  const navigate = useNavigate()

  const isMobile = useIsMobile()

  const [videoList, setVideoList] = useState<IlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 1,
    threshold: 2,
  })
  /**
   * 获取视频列表
   * @param values
   */
  const getClassificationRandom = async () => {
    //首页随机6个enum
    const resp = await services.video$random$classification({
      classification: videoType,
      take: 12,
    })

    if (resp.data.code === 200) {
      setVideoList(resp.data.resource.list as any)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      setVideoList([])
      setIsLoading(false) // 数据加载完成，更新加
    }
  }
  /**
   * 获取视频列表
   * @param values
   */
  const getRandom = async () => {
    const resp = await services.video$random({
      classification: videoType,
      take: 12,
    })

    if (resp.data.code === 200) {
      setVideoList(resp.data.resource.list as any)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      setVideoList([])
      setIsLoading(false) // 数据加载完成，更新加
    }
  }

  useMount(() => {
    if (type) {
      getClassificationRandom()
    } else {
      getRandom()
    }
  })
  return (
    <StyledPage>
      <StyledRecommendationsTitle>{title}</StyledRecommendationsTitle>
      <StyledVideos
        style={{ height: isMobile ? undefined : window.innerHeight + 50 }}
      >
        {
          //   isLoading ? (
          //   <Loading />
          // ) : (
          videoList.length > 0 &&
            videoList.map((item) => (
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
                  navigate(`/video-detail/${item.id}`, {
                    state: { video: item },
                  })
                }}
              ></CommonVideoCard>
            ))
        }
      </StyledVideos>
    </StyledPage>
  )
}
