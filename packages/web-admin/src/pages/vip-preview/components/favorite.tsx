import React, { useState } from 'react'

import { services } from '@af-charizard/sdk-services'

import type { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import { CommonVideoCard } from '~/components/common-video-card'
import { useOpenNewWindow, useScreenWidth } from '~/hooks'

import { useNavigate } from 'react-router'

import { useIsMobile } from '~/hooks/useIsMobile'
import styled from '@emotion/styled'
import { formatDateHM } from '~/utils/date'
import { message, Tabs } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { CommonEmpty } from '~/components/common-empty'
import { Loading } from '~/components/loading'
import { useMount, useUpdateEffect } from 'ahooks'

const StyledPage = styled.div`
  overflow-y: scroll;

  @media (max-width: 768px) {
    /* width: 120px; */
    overflow-y: visible;
    height: 100%;
  }
`
export const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin-bottom: 10px !important;
    border: none !important;
    border-radius: 8px !important;
  }
  .ant-btn {
    /* color: black; */
    /* width: 150px; */
  }
  .ant-tabs-tab-active {
    background-color: #fb7299 !important;
    .icon {
      color: #fff !important;
    }
  }
  .icon {
    min-width: 50px !important;
    text-align: center;
  }
  .ant-tabs-card {
    border: none !important;
  }
  .ant-tabs-content-holder {
    border: none !important;
  }

  @media (max-width: 768px) {
    .ant-tabs-tab {
      color: black !important;
    }
    .ant-tabs-nav {
      margin: 0 !important;
    }
    .ant-tabs-tab-active {
      background-color: #fff !important;
      .icon {
        color: #fb7299 !important;
      }
    }
  }
`
export const StyledRight = styled.div`
  width: 100%;
  margin-left: 6px;
  padding: 10px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    margin-left: 0px;
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
export const StyledRight2 = styled.div`
  /* width: 70%; */
  position: relative;
  div {
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  @media (max-width: 768px) {
    div {
      font-size: 20px;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    .delete {
      font-size: 17px;
    }
  }
`
const StyledVideos = styled.div`
  justify-content: flex-start;
  flex-wrap: wrap;
`
export const StyledTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  @media (max-width: 768px) {
    display: none;

    font-size: 17px;
    padding-left: 15px;
    padding-bottom: 10px;
    padding-top: 5px;
    color: #ea7a99;
  }
`
const StyledTitle2 = styled.div`
  font-size: 15px;
  font-weight: 600;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 15px;
    font-weight: 600;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
export const StyledTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  @media (max-width: 768px) {
    margin: 0px;
  }
`

export const FavoritePart = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const openNewWindow = useOpenNewWindow()

  //用户信息
  const [videoList, setVideoList] = useState<IlistItem[]>([])

  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态
  //tab
  const [tabItems, setTabItems] = useState<{ key: string; label: any }[]>([])
  //first tab key
  const [fisrtKey, setFisrtKey] = useState('')

  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 3,
    threshold: isMobile ? 1 : 2,
  })

  /**
   * 查询收藏classifications
   */
  const searchFavoriteClassifications = async () => {
    const resp = await services.video$favorite$classifications()

    if (resp.data.code === 200) {
      const data = resp.data.resource.map((item: any) => ({
        key: item,
        label: (
          <div className="icon" style={{ color: 'black' }}>
            {item}
          </div>
        ),
      }))
      setFisrtKey(data[0]?.key)
      setTabItems(data)
    } else {
      setTabItems([])
    }
  }
  /**
   * 查询收藏记录
   */
  const searchFavorite = async () => {
    const resp = await services.video$search$favorite({
      classification: fisrtKey,
    })
    if (resp.data.code === 200) {
      setVideoList(resp.data.resource)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      message.error(resp.data.message)
      setVideoList([])
      setIsLoading(false) // 数据加载完成，更新加
    }
  }

  // /**
  //  *清空收藏记录
  //  */
  // const clearFavorite = async () => {
  //   const resp = await services.video$clear$favorite()
  //   if (resp.data.code === 200) {
  //     message.success('收藏已全部取消')
  //     setIsModalShow(false)
  //     searchFavorite()
  //   } else {
  //     message.error('请重试')
  //   }
  // }
  /**
   *删除收藏记录
   */
  const removeFavorite = async (videoId: number) => {
    const resp = await services.video$remove$favorite({
      videoId,
    })
    if (resp.data.code === 200) {
      message.success('取消收藏成功')
      searchFavorite()
    } else {
      message.error('请重试')
    }
  }
  // /**
  //  * 查询
  //  * @param value
  //  * @returns
  //  */
  // const onSearch: SearchProps['onSearch'] = (value) => searchFavorite(value)

  useMount(() => {
    searchFavoriteClassifications()
  })

  useUpdateEffect(() => {
    searchFavorite()
  }, [fisrtKey])

  return (
    <StyledPage
      style={{ height: isMobile ? '100%' : window.innerHeight - 100 }}
    >
      <StyledTop>
        <StyledTitle>收藏列表</StyledTitle>
      </StyledTop>

      {fisrtKey ? (
        <>
          <StyledTabs
            defaultActiveKey="unread"
            tabPosition={'top'}
            items={tabItems}
            type="card"
            destroyInactiveTabPane
            onTabClick={(key) => {
              setFisrtKey(key)
            }}
          />
          <StyledVideos>
            {isLoading ? (
              <Loading />
            ) : videoList.length > 0 ? (
              videoList.map((item) => (
                <div style={{ display: 'flex' }}>
                  <CommonVideoCard
                    // title={item.title}
                    // type={item.classification}
                    duration={item.duration}
                    size={item.size}
                    bgImg={item.path}
                    key={item.id}
                    date={item.createdAt}
                    witdhPartNumber={widthPartNumber}
                    clickHandler={() => openNewWindow(item)}
                  ></CommonVideoCard>
                  <StyledRight>
                    <StyledRight1>
                      <StyledTitle2
                        onClick={() =>
                          navigate(`/video-detail/${item.id}`, {
                            state: { video: item },
                          })
                        }
                      >
                        {item.title}
                      </StyledTitle2>
                      <div>
                        {isMobile
                          ? formatDateHM(item.createdAt)
                          : `收藏时间：${formatDateHM(item.createdAt)}`}
                      </div>
                    </StyledRight1>
                    <StyledRight2>
                      <div
                        onClick={() => {
                          removeFavorite(item.id)
                        }}
                      >
                        <DeleteOutlined
                          style={{ color: 'red' }}
                          className="delete"
                        />
                      </div>
                    </StyledRight2>
                  </StyledRight>
                </div>
              ))
            ) : (
              <CommonEmpty
                navigateHandler={() => searchFavorite()}
                type="favorite"
              />
            )}
          </StyledVideos>
        </>
      ) : (
        <CommonEmpty />
      )}

      {/* <CommonModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        oKHandler={clearFavorite}
        title={'清空确认'}
        childrenPart={<div>确认清空所有收藏吗</div>}
      ></CommonModal> */}
    </StyledPage>
  )
}
