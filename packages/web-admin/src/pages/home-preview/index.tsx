import { Carousel, Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'

import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'

import { useMount } from 'ahooks'
import { services } from '@af-charizard/sdk-services'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { useLocation, useNavigate } from 'react-router'
import type { IResult } from '@af-charizard/sdk-services/src/services/video$more$classification'
import { getRandomEnumValues } from '~/utils/getRandomEnumValues'
import { FILTER_ENUM } from '@af-charizard/sdk-types'
import { VIDEO_TYPE_ENUM } from '@af-charizard/sdk-types/src/video-type'
import { HomePart } from './components/home-part'
import { HotPart } from './components/hot-part'
import { IHome } from '@af-charizard/sdk-services/src/services/video$home'
import CommonMessage from '~/components/common-message'
import { Loading } from '~/components/loading'
import { CommentWarning } from '~/components/common-warning'
import { useIsMobile } from '~/hooks'
import { SoundFilled } from '@ant-design/icons'
import CommonAdvertising from '~/components/common-advertising'
import { MonthPart } from '../vip-preview/components/month-part'
import PageClassificationStreamer from '../classification-streamer'
import { AnchorGoodsList } from '../classification-streamer/goods'
import { CommonAnchorCard } from '~/components/common-anchor-card'
import { useScreenWidth } from '~/hooks'

export const StyledVideos = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start; /* 在移动端上居中对齐 */
`
export const StyledCarousel = styled(Carousel)`
  height: 360px;
  color: #fff;
  line-height: 360px;
  text-align: center;
  border-radius: 10px;

  /* width: 300px; */
  width: 300px;
  img {
    width: 100%;
    overflow: hidden;

    background-size: cover; /* 根据需要调整背景图像尺寸 */
    background-position: center; /* 根据需要调整背景图像位置 */
  }
`
const StyledBGImg = styled.div`
  /* padding-top: calc((10 / 16) * 100%);  */
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-image: url(${({ bgImg }: { bgImg: string }) => bgImg});
  background-size: cover; /* 根据需要调整背景图像尺寸 */
  background-position: center; /* 根据需要调整背景图像位置 */

  @media (max-width: 768px) {
    border-radius: 3px;
  }
`
const StyledTabs = styled(Tabs)`
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
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #ea7a99;
  }
  .ant-tabs-ink-bar {
    background: #ea7a99;
  }
`
export const PageHomePreview = () => {
  const navigate = useNavigate()
  const location = useLocation()
  //用户信息
  const userStore = useStore(UserStore)

  //通知modal
  const [showModal, setShowModal] = useState(false)
  //月包购买modal
  const [monthModalShow, setMonthModalShow] = useState(false)
  //年份选择 - 从URL参数中读取，如果没有则默认为2026
  const getInitialYear = () => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')
    return tab || 'anchor_hot'
    // return tab || '2026'
  }
  const [selectedYear, setSelectedYear] = useState(getInitialYear())

  const [videoList, setVideoList] = useState<IResult[]>([])
  const [homeList, setHomeList] = useState<IHome>()
  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  // 热门/最新主播 goodsId 列表（来自后端）
  const [hotAnchorIds, setHotAnchorIds] = useState<string[]>([])
  const [newAnchorIds, setNewAnchorIds] = useState<string[]>([])
  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 4,
    threshold: 2,
  })

  // allowUpdate 映射（本地 goods.ts）
  const allowUpdateMap = useMemo(() => {
    const map: Record<string, boolean> = {}
    AnchorGoodsList.forEach((item) => {
      map[item.goodsId] = item.allowUpdate !== false
    })
    return map
  }, [])

  const handleYearChange = (key: string) => {
    setSelectedYear(key)
    // 更新URL参数以保存tab状态
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('tab', key)
    navigate({ search: searchParams.toString() }, { replace: true })
  }

  /**
   * 获取视频列表
   * @param values
   */
  const getMoreClassification = async () => {
    //首页随机6个enum
    const randomClassifications = getRandomEnumValues(VIDEO_TYPE_ENUM, 6)
    const resp = await services.video$more$classification({
      classification: randomClassifications,
      take: 6,
    })

    if (resp.data.code === 200) {
      setVideoList(resp.data.resource.list as any)
    } else {
      setVideoList([])
    }
  }
  /**
   * 首页最新视频及点赞+收藏最多
   */
  const getHomeVideos = async () => {
    const resp = await services.video$home()
    if (resp.data.code === 200) {
      setHomeList(resp.data.resource)
      setIsLoading(false)
    } else {
      setHomeList(undefined)
      setIsLoading(false)
    }
  }

  const checkAndShowModal = () => {
    const lastShown = localStorage.getItem('__SHOW_MESSAGE_TIME')
    const now = Date.now()

    if (!lastShown || now - Number(lastShown) > 0.5 * 60 * 60 * 1000) {
      //0.5小时后再次显示通知
      setShowModal(true)
      localStorage.setItem('__SHOW_MESSAGE_TIME', now.toString())
    }
  }

  useMount(() => {
    localStorage.removeItem('__INVITATION_CODE')
    if (!userStore.user) {
      const searchParams = new URLSearchParams(location.search)
      const invitation = searchParams.get('invitation') // 获取查询参数中的邀请码

      invitation && localStorage.setItem('__INVITATION_CODE', invitation)
    }

    // 从URL参数中恢复tab状态
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')
    if (tab) {
      setSelectedYear(tab)
    }

    getMoreClassification()
    getHomeVideos()

    checkAndShowModal()
  })

  // 切到热门/最新主播 Tab 时再拉取数据（避免首页每次都请求）
  useEffect(() => {
    const fetchHotOrNewAnchors = async () => {
      if (selectedYear === 'anchor_hot') {
        try {
          const resp = await services.user$get$hotAnchors({})
          if (resp?.data?.code === 200 && Array.isArray(resp.data.resource)) {
            setHotAnchorIds(resp.data.resource as string[])
          } else {
            setHotAnchorIds([])
          }
        } catch (e) {
          setHotAnchorIds([])
        }
        return
      }
      if (selectedYear === 'anchor_new') {
        try {
          const resp = await services.user$get$newAnchors({})
          if (resp?.data?.code === 200 && Array.isArray(resp.data.resource)) {
            setNewAnchorIds(resp.data.resource as string[])
          } else {
            setNewAnchorIds([])
          }
        } catch (e) {
          setNewAnchorIds([])
        }
      }
    }
    fetchHotOrNewAnchors()
  }, [selectedYear])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <CommentWarning
            style={{ marginBottom: 6, marginTop: 10 }}
            children={
              <>
                {/* <div>
                  <SoundFilled style={{ marginRight: 5 }} />
                  公告：因特殊原因，网站暂不支持在线播放，会员
                </div> */}
                 {/* <div>
                   <SoundFilled style={{ marginRight: 5 }} />
                   网站改制活动来袭：活动期间充值，可获得 8折
                   额外返利！详情见系统邮件～
                   <a
                     onClick={() => {
                       navigate('/web/shop')
                     }}
                   >
                     前往商城
                   </a>
                 </div> */}
                <div>
                  <SoundFilled style={{ marginRight: 5 }} />
                  公告：有任何问题，请联系客服🐧QQ：3768637494
                </div>
                
              </>
              // <>
              //   {!userStore.user && (
              //     <div>
              //       <SoundFilled style={{ marginRight: 5 }} />
              //       公告：
              //       <span>
              //         若无账号，请先
              //         <a
              //           onClick={() => {
              //             navigate('/register')
              //           }}
              //           style={{ margin: '0 5px', fontSize: 14 }}
              //         >
              //           前往注册
              //         </a>
              //       </span>
              //     </div>
              //   )}
              //   {/* 活动相关 */}
              //   <>
              //     {/* <div>
              //       <SoundFilled style={{ marginRight: 5 }} />
              //       周末活动来袭：活动期间充值，可获得 9折
              //       额外返利！详情见系统邮件～
              //       <a
              //         onClick={() => {
              //           navigate('/web/shop')
              //         }}
              //       >
              //         前往商城
              //       </a>
              //     </div> */}
              //   </>
              //   {/* 签到相关 */}
              //   {/* <>
              //     <div>
              //       <SoundFilled style={{ marginRight: 5 }} />
              //       签到即可免费得会员时长～ 前往
              //       <a
              //         style={{ margin: '0 5px', fontSize: 14 }}
              //         onClick={() => navigate('/web/sign-in')}
              //       >
              //         签到
              //       </a>
              //     </div>
              //   </> */}
              //   <div>
              //     <SoundFilled style={{ marginRight: 5 }} />
              //     所有主播： 前往
              //     <a
              //       style={{ margin: '0 5px', fontSize: 14 }}
              //       onClick={() => navigate('/classification')}
              //     >
              //       主播分类
              //     </a>
              //   </div>
              //   {userStore.user && (
              //     <div>
              //       <SoundFilled style={{ marginRight: 5 }} />
              //       公告：需要百度网盘资源，请联系客服QQ3768637494（永久资源，不免费谢谢）
              //     </div>
              //   )}
              //   {/* <div>
              //     <SoundFilled style={{ marginRight: 5 }} />
              //     推广联盟：邀请好友注册成功，即可获得超多返利！{' '}
              //     <a
              //       onClick={() => {
              //         if (!userStore.user) {
              //           // message.warning('请先登录～')
              //           // return
              //           navigate('/login')
              //           return
              //         }
              //         isMobile
              //           ? navigate('/profit/invitation')
              //           : navigate('/vip/buy', {
              //               state: { type: 'invitations' },
              //             })
              //       }}
              //     >
              //       前往推广联盟
              //     </a>
              //   </div> */}
              // </>
            }
          ></CommentWarning>
          {/* <CommonAdvertising height={100} /> */}
          {/* <div style={{ fontSize: 40, textAlign: 'center' }}>
            <div style={{ marginBottom: 20 }}>
              因特殊原因，网站暂时休息，开放时间待定。会员时长后续弥补
            </div>
            <div>
              网盘服务正常运行。需要百度网盘资源，请联系客服QQ3768637494（永久资源，不免费谢谢）
            </div>
          </div> */}
          {showModal && <CommonMessage onClose={() => setShowModal(false)} />}
          {/* <HotPart list={homeList?.newVideos} type={FILTER_ENUM.NEW}></HotPart> */}
          {/* <HotPart
            list={homeList?.popularVideos}
            type={FILTER_ENUM.POPULAR}
          ></HotPart> */}
          {/* <StyledVideos>
            {videoList.length > 0 &&
              videoList.map((item) => (
                <HomePart
                  resultItem={item}
                  key={item.classification}
                ></HomePart>
              ))}
          </StyledVideos> */}

            <StyledTabs activeKey={selectedYear} onChange={handleYearChange}>
            <TabPane tab="热门主播" key="anchor_hot" />
            {/* <TabPane tab="最新主播" key="anchor_new" /> */}
            <TabPane tab="所有主播" key="anchor" />
            <TabPane tab="2026合集" key="2026" />
            <TabPane tab="2025合集" key="2025" />
            <TabPane tab="2024合集" key="2024" />
          
          </StyledTabs>
          {selectedYear === 'anchor' ? (
            <PageClassificationStreamer />
          ) : selectedYear === 'anchor_hot' ? (
            <StyledVideos>
              {hotAnchorIds
                .map((id) => AnchorGoodsList.find((x) => x.goodsId === id))
                .filter(Boolean)
                .map((item: any) => (
                  <CommonAnchorCard
                    item={item}
                    key={item.goodsId}
                    witdhPartNumber={widthPartNumber}
                    allowUpdate={allowUpdateMap[item.goodsId] !== false}
                  />
                ))}
            </StyledVideos>
          ) : selectedYear === 'anchor_new' ? (
            <StyledVideos>
              {newAnchorIds
                .map((id) => AnchorGoodsList.find((x) => x.goodsId === id))
                .filter(Boolean)
                .map((item: any) => (
                  <CommonAnchorCard
                    item={item}
                    key={item.goodsId}
                    witdhPartNumber={widthPartNumber}
                    allowUpdate={allowUpdateMap[item.goodsId] !== false}
                  />
                ))}
            </StyledVideos>
          ) : (
            <MonthPart
              isModalShow={monthModalShow}
              setIsModalShow={setMonthModalShow}
              year={selectedYear}
            />
          )}
        </div>
      )}
    </>
  )
}

export default PageHomePreview
