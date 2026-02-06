import { Button, Drawer, message } from 'antd'
import styled from '@emotion/styled'
import {
  ArrowRightOutlined,
  CalendarOutlined,
  EyeFilled,
  LikeFilled,
  SketchOutlined,
  StarFilled,
} from '@ant-design/icons'

import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
// import Player from 'xgplayer'
import { useParams } from 'react-router-dom'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { useLocation } from 'react-router-dom'
import type { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import type { IExtendedListItem } from '@af-charizard/sdk-services/src/services/video$videoUrl$vip'
import { services } from '@af-charizard/sdk-services'
import { ObscurationPart } from './components/obscuration-part'

import { RecommendationsBar } from './components/recommendations-bar'
import { CommonBreadcrumb } from '~/components/common-breadcrumb'
import { formatDate, formatDate_M } from '~/utils/date'
import { formatNumberWithW } from '~/utils/handleUnit'
import { requireLogin } from '~/utils/requireLogin'
import { Loading } from '~/components/loading'
import { ReplyPart } from '~/components/common-reply-part/index'
import { CommonEmpty } from '~/components/common-empty'
import { useIsMobile, useScrollToTop } from '~/hooks'

import DPlayer from 'dplayer'
import Hls from 'hls.js'
import { ClassificationPartBar } from './components/classification-part-bar'
import { useMount } from 'ahooks'
import CommonAdvertising from '~/components/common-advertising'

const PlayerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* .xgplayer-errornote {
    display: none;
  }
  .xgplayer .btn-text {
    display: none;
  } */
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`
const StyledDrawer = styled(Drawer)``
const StyledVideo = styled.div`
  padding: 10px;

  border: 1px solid #eaecef;
  border-radius: 4px;
  @media (max-width: 768px) {
    padding: 5px;
  }
`
const StyledTitle = styled.div`
  padding: 5px 0 10px 0;
  font-size: 20px;
  line-height: 25px;
  font-weight: 600;
  /* max-width: 300px; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 768px) {
    max-width: 200px;

    padding: 1px 0 5px 0;
    font-size: 12px;
  }
`
const StyledPlayTimes = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 500;

  margin: 0 5px 0 20px !important;
  color: #95999f;
  cursor: pointer;

  /* 设置鼠标悬停时的放大和旋转效果 */
  transition:
    transform 0.3s ease-in-out,
    font-size 0.3s ease-in-out;

  &:hover {
    transform: scale(1.2); /* 鼠标悬停时放大1.2倍 */
  }

  @media (max-width: 768px) {
    padding: 1px 0 5px 0;
    font-size: 20px;
    margin: 0 8px 0 10px !important;
    &:hover {
      transform: scale(1); /* 鼠标悬停时放大1.2倍 */
    }
  }
`

const StyledHandle = styled.div`
  display: flex;
  margin-top: 5px;
  line-height: 40px;

  @media (max-width: 768px) {
    line-height: 10px;
    margin-top: 8px;
    margin-left: 4px;
  }
`
const StyledFFvideo = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 3px;

  @media (max-width: 768px) {
    width: 100% !important;
  }
`
const StyledNumber = styled.span`
  margin-left: 5px;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`
const StyledClass = styled.div`
  padding: 10px;
  padding-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;

  display: flex;
  justify-content: space-between;

  div:nth-of-type(2) {
    color: #96999e;
  }
`
export const StyledHidden = styled.div`
  margin-left: 5px;
  font-size: 16px;

  @media (max-width: 768px) {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
interface IProps {}
export const PageDetail: React.FC<IProps> = () => {
  const { id } = useParams()
  console.log('%c这是锋酱的打印', 'color: green; font-size: 30px;', id)

  const currentDomain = window.location.hostname
  const { search } = useLocation()
  const classification = new URLSearchParams(search).get('classification')

  const navigate = useNavigate()
  const scrollTop = useScrollToTop()
  const isMobile = useIsMobile()

  const posterUrl =
    process.env.NODE_ENV === 'production'
      ? `https://api.${currentDomain}/videos/${isMobile ? 'compressedThumbnailPath' : 'compressedThumbnailPath'}/${id}`
      : `http://localhost:3009/videos/thumbnailPath/${id}`

  //用户信息
  const userStore = useStore(UserStore)

  const location = useLocation()

  const [isVIP, setIsVIP] = useState(true)
  const [videoInfo, setVideoInfo] = useState<IExtendedListItem>()
  console.log('%c这是锋酱的打印', 'color: yellow; font-size: 30px;', videoInfo)

  const { video }: { video: IlistItem } = location.state || {}

  //用于点赞
  const [hasLiked, setHasLiked] = useState(videoInfo?.hasLiked || false)
  // const [likes, setLikes] = useState(videoInfo?.likes || 0)
  const [likes, setLikes] = useState(Number((videoInfo?.likes || 0) * 10))

  //用于收藏
  const [hasFavorited, setHasFavorited] = useState(
    videoInfo?.hasFavorited || false,
  )
  const [favorites, setFavorites] = useState(
    Number((videoInfo?.favorites || 0) * 10),
  )
  // const [favorites, setFavorites] = useState(videoInfo?.favorites || 0)
  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态
  const [isNewLoading, setIsNewLoading] = useState(false) // 增加一个加载状态
  const [isClassLoading, setIsClassLoading] = useState(false) // 增加一个加载状态

  const [videoList, setVideoList] = useState<any[]>([])
  console.log('%c这是锋酱的打印', 'color: red; font-size: 30px;', videoList)

  const [isTotal, setIsTotal] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [selectedId, setSelectedId] = useState(id) // 初始值为父页面传入的 ID

  const currentIndex = videoList.findIndex((item) => item.id === Number(id)) + 1

  const items = [
    {
      title: <a>首页</a>,
      onClick: () => navigate('/'),
    },
    {
      title: <a>{videoInfo?.classification}</a>,
      onClick: () => {
        navigate(`/classification-detail/${videoInfo?.classification}`)
      },
    },
    {
      title: <StyledHidden>{videoInfo?.title}</StyledHidden>,
    },
  ]

  /**
   * 获取视频信息default
   * @returns
   */
  const getVideoUrlDefault = async () => {
    const resp = await services.video$videoUrl$default({
      // userId: userStore.user?.id,
      videoId: Number(id)!,
      classification: classification || video?.classification,
    })

    if (resp.data.code === 200) {
      setVideoInfo(resp.data.resource as IExtendedListItem)
      setHasLiked(resp.data.resource.hasLiked)

      // setLikes(resp.data.resource.likes)
      setLikes(Number((resp.data.resource.likes || 0) * 11))
      setHasFavorited(resp.data.resource.hasFavorited)
      // setFavorites(resp.data.resource.favorites)
      setFavorites(Number((resp.data.resource.favorites || 0) * 13))
      setIsLoading(false) // 数据加载完成，更新加
    } else if (resp.data.code === -666) {
      setHasLiked(false)
      setLikes(0)
      setHasFavorited(false)
      setFavorites(0)
      setIsLoading(false) // 数据加载完成，更新加
    }
    setIsLoading(false) // 数据加载完成，更新加
  }
  /**
   * 获取视频信息vip
   * @returns
   */
  const getVideoUrlVip = async () => {
    const resp = await services.video$videoUrl$vip({
      videoId: Number(id)!,
      classification: classification || video?.classification,
    })
    console.log(
      '%c这是锋酱的打印',
      'color: red; font-size: 30px;',
      resp.data.resource,
    )

    if (resp.data.code === 200) {
      setIsVIP(true)
      setVideoInfo(resp.data.resource as IExtendedListItem)
      setHasLiked(resp.data.resource.hasLiked)

      setLikes(Number((resp.data.resource.likes || 0) * 11))
      // setLikes(resp.data.resource.likes)
      setHasFavorited(resp.data.resource.hasFavorited)
      // setFavorites(resp.data.resource.favorites)
      setFavorites(Number((resp.data.resource.favorites || 0) * 13))
      setIsLoading(false) // 数据加载完成，更新加
    } else if (resp.data.code === -666) {
      setIsVIP(false)
      setHasLiked(false)
      setLikes(0)
      setHasFavorited(false)
      setFavorites(0)
      setIsLoading(false) // 数据加载完成，更新加
    }
    setIsLoading(false) // 数据加载完成，更新加
  }

  /**
   * 播放次数+1
   */
  const incrementPlayCount = async () => {
    const resp = await services.video$play({
      id: Number(id)!,
    })
    if (resp.data.code === 200) {
    } else {
    }
  }
  /**
   * 添加历史记录
   */
  const addVideoToHistory = async () => {
    const resp = await services.video$add$history({
      videoId: Number(id),
    })
    if (resp.data.code === 200) {
    } else {
    }
  }
  /**
   * 取消点赞
   */
  const addUnLikes = async () => {
    setIsNewLoading(true)

    const resp = await services.video$add$unlike({
      videoId: Number(id),
    })
    if (resp.data.code === 200) {
      setHasLiked(false)

      setLikes((prevLikes) => prevLikes - 1)
      setIsNewLoading(false)
    } else {
      setIsNewLoading(false)
    }
  }
  /**
   * 点赞
   */
  const addLikes = async () => {
    setIsNewLoading(true)
    const resp = await services.video$add$like({
      videoId: Number(id),
    })
    if (resp.data.code === 200) {
      setHasLiked(true)
      setLikes((prevLikes) => prevLikes + 1)
      setIsNewLoading(false)
    } else {
      setIsNewLoading(false)
    }
  }
  /**
   * 收藏
   */
  const addfavorite = async () => {
    setIsNewLoading(true)

    const resp = await services.video$add$favorite({
      videoId: Number(id),
    })
    if (resp.data.code === 200) {
      setHasFavorited(true)
      setFavorites((prevFavorites) => prevFavorites + 1)
      setIsNewLoading(false)
    } else {
      setIsNewLoading(false)
    }
  }
  /**
   * 取消收藏
   */
  const removeFavorite = async () => {
    setIsNewLoading(true)

    const resp = await services.video$remove$favorite({
      videoId: Number(id),
    })
    if (resp.data.code === 200) {
      setHasFavorited(false)
      setFavorites((prevFavorites) => prevFavorites - 1)
      setIsNewLoading(false)
    } else {
      setIsNewLoading(false)
    }
  }

  /**
   * 更新访问次数
   */
  const updateVisitCountHandler = () => {
    services.passport$update$visit_count()
  }

  /**
   * 当前Classification的数据
   */
  const getClassificationRandom = async () => {
    setIsClassLoading(true)
    try {
      const resp = await services.video$classification$one({
        classification: classification || video?.classification,
      })

      if (resp.data.code === 200) {
        setVideoList(resp.data.resource.list)
        setIsTotal(resp.data.resource.totalCount)
      } else {
        setVideoList([])
        setIsTotal(0)
      }
    } catch (error) {
      console.error('获取分类数据失败:', error)
      setVideoList([])
    } finally {
      setIsClassLoading(false)
    }
  }

  useMount(() => {
    getClassificationRandom()
  })

  useEffect(() => {
    if (userStore.user?.id) {
      if (isVIP) {
        getVideoUrlVip()
      } else {
        getVideoUrlDefault()
      }
    } else {
      getVideoUrlDefault()
    }

    scrollTop()
  }, [id, isVIP])

  useEffect(() => {
    let player: any
    let currentHls: any

    const destroyPlayer = () => {
      if (player) {
        // 停止视频播放
        if (player.video) {
          player.video.pause()
          player.video.src = ''
          player.video.load()
        }

        // 销毁当前的 HLS 实例
        if (currentHls) {
          currentHls.stopLoad()
          currentHls.detachMedia()
          currentHls.destroy()
          currentHls = null
        }

        // 销毁播放器
        player.destroy()
        player = null
      }
    }

    const createPlayer = () => {
      // 确保在创建新播放器前销毁旧的
      destroyPlayer()

      // const container = document.getElementById('FFvideo')
      // if (!container) {
      //   console.error('Container element not found')
      //   return
      // }

      // player = new DPlayer({
      //   container,
      //   autoplay: false,
      //   video: {
      //     url: videoInfo?.videoPath
      //       ? `https://api.af-share.com/videos/m3u8?pathName=${encodeURIComponent(videoInfo?.videoPath)}`
      //       : '',
      //     type: 'customHls',
      //     pic: posterUrl,
      //     customType: {
      //       customHls: function (video: any) {
      //         // 创建新的 HLS 实例前确保销毁旧的
      //         if (currentHls) {
      //           currentHls.stopLoad()
      //           currentHls.detachMedia()
      //           currentHls.destroy()
      //           currentHls = null
      //         }

      //         currentHls = new Hls({
      //           enableWorker: true,
      //           // 添加额外的 HLS 配置以优化性能
      //           maxBufferLength: 30,
      //           maxMaxBufferLength: 60,
      //           maxBufferSize: 60 * 1000 * 1000, // 60MB
      //           maxBufferHole: 0.5,
      //           lowLatencyMode: true,
      //         })

      //         const videoUrl = videoInfo?.videoPath
      //           ? `https://api.af-share.com/videos/m3u8?pathName=${encodeURIComponent(videoInfo?.videoPath)}`
      //           : ''
      //         currentHls.loadSource(videoUrl)
      //         currentHls.attachMedia(video)
      //       },
      //     },
      //   },
      // })

      // player.on('play', () => {
      //   incrementPlayCount()
      //   addVideoToHistory()
      // })
    }

    if (videoInfo) {
      createPlayer()
    }

    // 组件卸载时清理资源
    return () => {
      destroyPlayer()
    }
  }, [videoInfo])

  return (
    <PlayerContainer>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            {/* <CommonAdvertising height={90} /> */}
            <CommonBreadcrumb items={items} />
            <StyledVideo>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <StyledTitle>{videoInfo?.title}</StyledTitle>
                <Button
                  size={isMobile ? 'small' : 'middle'}
                  disabled={!userStore.user}
                  onClick={() => {
                    if (!userStore.user) {
                      requireLogin()
                      return
                    }
                    if (videoInfo?.nextVideo?.id) {
                      navigate(`/video-detail/${videoInfo.nextVideo.id}`, {
                        state: { video: videoInfo.nextVideo },
                      })
                      updateVisitCountHandler()
                    } else {
                      message.warning('没下一个啦～')
                    }
                  }}
                >
                  切换下一个
                </Button>
              </div>

              {userStore.user ? (
                <>
                  {isVIP ? (
                    <StyledFFvideo
                      id="FFvideo"
                      style={{
                        width: isMobile
                          ? window.innerWidth * 0.9
                          : window.innerWidth * 0.6,
                        height: isMobile
                          ? ((isMobile
                              ? window.innerWidth * 0.9
                              : window.innerWidth * 0.6) *
                              171) /
                            300
                          : ((isMobile
                              ? window.innerWidth * 0.9
                              : window.innerWidth * 0.6) *
                              500) /
                            890,
                      }}
                    ></StyledFFvideo>
                  ) : (
                    <ObscurationPart
                      posterUrl={posterUrl}
                      part={
                        <div>
                          尚未开通VIP
                          <a
                            onClick={() => navigate('/web/shop')}
                            style={{ marginLeft: 10, color: '#FB7299' }}
                          >
                            点击开通
                            <SketchOutlined
                              style={{ fontSize: 16, marginLeft: 3 }}
                            />
                          </a>
                        </div>
                      }
                    ></ObscurationPart>
                  )}
                </>
              ) : (
                <>
                  <ObscurationPart
                    posterUrl={posterUrl}
                    part={
                      <div>
                        用户尚未登录
                        <a
                          onClick={() => navigate('/login')}
                          style={{ marginLeft: '10px', color: 'red' }}
                        >
                          点击登录 / 注册 <ArrowRightOutlined />
                        </a>
                      </div>
                    }
                  ></ObscurationPart>
                </>
              )}
            </StyledVideo>
            {isMobile && (
              <StyledClass onClick={() => setIsModalVisible(true)}>
                <div>合集 · {classification || video?.classification}</div>
                <div>{`${currentIndex} / ${isTotal}`}</div>
              </StyledClass>
            )}
            <StyledHandle>
              <StyledPlayTimes
                style={{
                  color: hasLiked ? '#FB7299' : '#95999f',
                  marginLeft: 3,
                }}
                onClick={() => {
                  if (isNewLoading) {
                    message.warning('动作太快啦')
                    return
                  }
                  if (userStore.user?.id && isVIP) {
                    hasLiked ? addUnLikes() : addLikes()
                  } else {
                    message.warning('您还不是VIP会员用户')
                  }
                }}
              >
                <LikeFilled />
                {/* <StyledNumber>{formatNumberWithW(likes)}</StyledNumber> */}
                <StyledNumber>{formatNumberWithW(likes)}</StyledNumber>
              </StyledPlayTimes>
              <StyledPlayTimes
                style={{ color: hasFavorited ? 'orange' : '#95999f' }}
                onClick={() => {
                  if (isNewLoading) {
                    message.warning('动作太快啦')
                    return
                  }
                  if (userStore.user?.id && isVIP) {
                    hasFavorited ? removeFavorite() : addfavorite()
                  } else {
                    message.warning('您还不是VIP会员用户')
                  }
                }}
              >
                <StarFilled />

                <StyledNumber>{formatNumberWithW(favorites)}</StyledNumber>
              </StyledPlayTimes>

              <StyledPlayTimes style={{ cursor: 'default' }}>
                <EyeFilled />
                <StyledNumber>
                  {/* {formatNumberWithW(videoInfo?.playTimes ?? 0)} */}
                  {formatNumberWithW(
                    Number(
                      (videoInfo?.playTimes ? videoInfo?.playTimes : 0) * 77,
                    ),
                  )}
                </StyledNumber>
              </StyledPlayTimes>
              <StyledPlayTimes style={{ cursor: 'default' }}>
                <CalendarOutlined />
                <StyledNumber>
                  {formatDate_M(videoInfo?.createdAt)}
                </StyledNumber>
              </StyledPlayTimes>
            </StyledHandle>
            {userStore.user ? (
              isVIP ? (
                <ReplyPart></ReplyPart>
              ) : (
                <CommonEmpty title="您还不是会员用户"></CommonEmpty>
              )
            ) : (
              <CommonEmpty title="请登录后查看评论"></CommonEmpty>
            )}
          </div>
          <div>
            {!isMobile && (
              <ClassificationPartBar
                videoType={classification || video?.classification}
                id={id!}
                videoList={videoList}
                isTotal={isTotal}
                currentIndex={currentIndex}
                isClassLoading={isClassLoading}
                selectedId={selectedId!}
                setSelectedId={setSelectedId}
              ></ClassificationPartBar>
            )}
            {/* {isMobile ? (
              <>
                <RecommendationsBar
                  title="相关推荐"
                  videoType={classification || video?.classification}
                  type={true}
                ></RecommendationsBar>
                <RecommendationsBar
                  title="其他推荐"
                  videoType={classification || video?.classification}
                  type={false}
                ></RecommendationsBar>
              </>
            ) : (
              <ClassificationPartBar
                videoType={classification || video?.classification}
                id={id!}
              ></ClassificationPartBar>
            )} */}
          </div>
          <StyledDrawer
            title={`合集 · ${classification || video?.classification} （${currentIndex} / ${isTotal}）`}
            placement="bottom" // 设置Drawer从下方弹出
            onClose={() => setIsModalVisible(false)} // 关闭Drawer
            visible={isModalVisible} // 控制Drawer的显示
            height="70vh" // 设置Drawer的高度
            bodyStyle={{
              padding: 0, // 控制Drawer内部的间距
              overflowY: 'auto', // 添加滚动条
            }}
            style={{
              borderRadius: ' 15px 15px 0 0',
            }}
          >
            <ClassificationPartBar
              videoType={classification || video?.classification}
              id={id!}
              setIsModalVisible={setIsModalVisible}
              videoList={videoList}
              isTotal={isTotal}
              currentIndex={currentIndex}
              isClassLoading={isClassLoading}
              selectedId={selectedId!}
              setSelectedId={setSelectedId}
            />
          </StyledDrawer>
        </>
      )}
    </PlayerContainer>
  )
}
export default PageDetail
