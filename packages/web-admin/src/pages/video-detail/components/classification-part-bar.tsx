import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { VIDEO_TYPE_ENUM } from '@af-charizard/sdk-types/src/video-type'
import { useMount } from 'ahooks'
import { services } from '@af-charizard/sdk-services'
import { useIsMobile } from '~/hooks/useIsMobile'
import { useNavigate } from 'react-router'
import { Loading } from '~/components/loading'
import { formatDate, formatDate_M, formatDuration } from '~/utils/date'
import { CommonVideoCard } from '~/components/common-video-card'
import { useScreenWidth } from '~/hooks'
import { YoutubeOutlined } from '@ant-design/icons'
import { formatNumberWithW } from '~/utils/handleUnit'

const StyledRight = styled.div`
  width: 100%;
  /* margin-left: 6px; */
  padding: 10px;
  padding-left: 5px;
  padding-bottom: 7px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    margin-left: 0px;
  }
`
const StyledData = styled.div`
  font-size: 12px;
  color: #96999e;
  margin-bottom: 2px;
`
const StyledBottom = styled.div`
  font-size: 12px;
  color: #96999e;
`
const StyledPage = styled.div`
  margin: 20px;
  font-family: Arial, sans-serif;
  @media (max-width: 768px) {
    margin: 0px;
  }
`
export const StyledRight1 = styled.div`
  /* width: 30%; */
  display: flex;
  flex-direction: column;
  div:nth-of-type(2) {
    margin-top: auto; // 将第二个 div 元素推到容器底部
  }
`
const StyledTitle = styled.div`
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
`

const StyledTitle3 = styled.div`
  @media (max-width: 768px) {
    font-size: 15px;
    font-weight: 400;
    width: 180px;
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
    overflow: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`
const StyledList = styled.div`
  width: 350px;

  overflow-y: auto;
  border-radius: 8px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  padding: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    border-radius: 0px;
    /* min-width: 350px; */
    width: 100%;
    background: linear-gradient(135deg, #fff, #fff);
    padding: 3px;
  }
`
const StyledTitle2 = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const StyledListItem = styled.div<{ isSelected: boolean }>`
  font-size: 16px;
  padding: 15px 20px;
  margin-bottom: 8px;
  border-radius: 6px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  justify-content: space-between;

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#ea7a99' : '#f0f4f8')};
    transform: translateY(-2px);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #666;
  font-size: 16px;
`

interface IProps {
  videoType: VIDEO_TYPE_ENUM
  id: string
  setIsModalVisible?: React.Dispatch<React.SetStateAction<boolean>>
  videoList: any
  isTotal: number
  currentIndex: number
  isClassLoading: boolean
  selectedId: string
  setSelectedId: React.Dispatch<React.SetStateAction<any>>
}

export const ClassificationPartBar: React.FC<IProps> = ({
  videoType,
  id,
  setIsModalVisible,
  videoList,
  isTotal,
  currentIndex,
  isClassLoading,
  selectedId,
  setSelectedId,
}) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  console.log('%c这是锋酱的打印', 'color: red; font-size: 30px;', videoList)

  // const [videoList, setVideoList] = useState<any[]>([])
  // const [isTotal, setIsTotal] = useState(0)
  // const [isLoading, setIsLoading] = useState(true)

  // const [selectedId, setSelectedId] = useState<string | null>(id) // 初始值为父页面传入的 ID
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({}) // 存储列表项的 refs
  const containerRef = useRef<HTMLDivElement | null>(null) // 整个容器的 ref

  // 动态更新 selectedId
  useEffect(() => {
    if (videoList.length > 0) {
      setSelectedId(id) // 初始化时设置选中 ID
    }
  }, [id, videoList])

  useEffect(() => {
    if (videoList.length > 0 && selectedId && itemRefs.current[selectedId]) {
      const target = itemRefs.current[selectedId]
      const container = containerRef.current

      if (target && container) {
        const targetOffset = target.offsetTop
        const containerHeight = container.clientHeight
        const containerScroll = container.scrollTop

        // 如果目标项不在视口内，则滚动到目标项
        if (
          targetOffset < containerScroll ||
          targetOffset > containerScroll + containerHeight
        ) {
          container.scrollTo({
            top: targetOffset - containerHeight / 2,
            behavior: 'smooth', // 平滑滚动
          })
        }
      }
    }
  }, [videoList, selectedId]) // 监听 videoList 和 selectedId

  // const handleSelect = (id: string) => {
  //   setSelectedId((prev) => (prev === id ? null : id)) // 再次点击取消选中
  // }
  const handleSelect = (id: string) => {
    setSelectedId(id) // 直接设置为选中项
  }

  /**
   * 当前Classification的数据
   */
  // const getClassificationRandom = async () => {
  //   setIsLoading(true)
  //   try {
  //     const resp = await services.video$classification$one({
  //       classification: videoType,
  //     })
  //     console.log(
  //       '%c这是锋酱的打印',
  //       'color: red; font-size: 30px;',
  //       resp.data.resource.list,
  //     )

  //     if (resp.data.code === 200) {
  //       setVideoList(resp.data.resource.list)
  //       setIsTotal(resp.data.resource.totalCount)
  //     } else {
  //       setVideoList([])
  //       setIsTotal(0)
  //     }
  //   } catch (error) {
  //     console.error('获取分类数据失败:', error)
  //     setVideoList([])
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // useMount(() => {
  //   getClassificationRandom()
  // })
  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 3,
    threshold: isMobile ? 1 : 2,
  })
  return (
    <StyledPage>
      {!isMobile && (
        <StyledTitle>
          {`${videoType} · 合集`}

          <span
            style={{ fontSize: 15, color: '#96999e' }}
          >{`（${currentIndex} / ${isTotal}）`}</span>
        </StyledTitle>
      )}
      <StyledList
        ref={containerRef}
        style={{ height: isMobile ? '100%' : window.innerHeight - 140 }}
      >
        {isClassLoading ? (
          <Loading></Loading>
        ) : videoList.length > 0 ? (
          videoList.map((item: any) =>
            isMobile ? (
              <div
                style={{ display: 'flex' }}
                onClick={() => {
                  setIsModalVisible && setIsModalVisible(false)
                  handleSelect(item.id)
                  navigate(`/video-detail/${item.id}`, {
                    state: { video: item },
                  })
                }}
              >
                <CommonVideoCard
                  // title={item.title}
                  // type={item.classification}
                  duration={item.duration}
                  size={item.size}
                  bgImg={item.path}
                  key={item.id}
                  date={item.createdAt}
                  witdhPartNumber={widthPartNumber}
                  clickHandler={() => {}}
                ></CommonVideoCard>
                <StyledRight>
                  <StyledRight1>
                    <StyledTitle3
                      style={{
                        color: selectedId
                          ? selectedId == item.id
                            ? '#ea7a99'
                            : undefined
                          : id === item.id
                            ? '#ea7a99'
                            : undefined,
                        fontWeight: selectedId
                          ? selectedId == item.id
                            ? 600
                            : undefined
                          : id === item.id
                            ? 600
                            : undefined,
                      }}
                      onClick={() =>
                        navigate(`/video-detail/${item.id}`, {
                          state: { video: item },
                        })
                      }
                    >
                      {item.title}
                    </StyledTitle3>
                    <div>
                      <StyledData>{formatDate_M(item.createdAt)}</StyledData>
                      <StyledBottom>
                        <div>
                          <YoutubeOutlined
                            style={{
                              marginRight: 3,
                              fontSize: 13,
                            }}
                          />
                          {formatNumberWithW(
                            Number((item.playTimes ? item.playTimes : 0) * 77),
                          )}
                          <span style={{ marginLeft: 7 }}>
                            {formatDuration(item.duration)}
                          </span>
                        </div>
                      </StyledBottom>
                    </div>
                  </StyledRight1>
                </StyledRight>
              </div>
            ) : (
              <StyledListItem
                key={item.id}
                style={{
                  backgroundColor: selectedId
                    ? selectedId == item.id
                      ? '#ea7a99'
                      : '#ffffff'
                    : id === item.id
                      ? '#ea7a99'
                      : '#ffffff',

                  color: selectedId
                    ? selectedId == item.id
                      ? '#ffffff'
                      : '#333'
                    : id === item.id
                      ? '#ffffff'
                      : '#333',
                }}
                isSelected={selectedId === item.id}
                onClick={() => {
                  setIsModalVisible && setIsModalVisible(false)
                  handleSelect(item.id)
                  navigate(`/video-detail/${item.id}`, {
                    state: { video: item },
                  })
                }}
                ref={(el) => (itemRefs.current[item.id] = el)}
              >
                <StyledTitle2> {item.title}</StyledTitle2>
                <div
                  style={{
                    color: selectedId
                      ? selectedId == item.id
                        ? '#ffffff'
                        : '#96999e'
                      : id === item.id
                        ? '#ffffff'
                        : '#96999e',
                    paddingLeft: 5,
                  }}
                >
                  {formatDuration(item.duration)}
                </div>
              </StyledListItem>
            ),
          )
        ) : (
          <EmptyState>暂无数据</EmptyState>
        )}
      </StyledList>
    </StyledPage>
  )
}
