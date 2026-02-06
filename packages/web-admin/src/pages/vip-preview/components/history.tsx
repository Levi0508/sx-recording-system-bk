import React, { useEffect, useState } from 'react'

import { services } from '@af-charizard/sdk-services'

import type { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import { CommonVideoCard } from '~/components/common-video-card'
import { useOpenNewWindow, useScreenWidth } from '~/hooks'

import { useNavigate } from 'react-router'

import { useIsMobile } from '~/hooks/useIsMobile'
import styled from '@emotion/styled'
import { formatDateHM } from '~/utils/date'
import { Button, Input, message } from 'antd'
import { SearchProps } from 'antd/es/input'
import { CommonModal } from '~/components/common-modal'
import { CommonEmpty } from '~/components/common-empty'
import { Loading } from '~/components/loading'
import { StyledTitle, StyledTop } from './favorite'
import { SearchOutlined } from '@ant-design/icons'

const { Search } = Input

const StyledPage = styled.div`
  overflow-y: scroll;

  @media (max-width: 768px) {
    /* width: 120px; */
    overflow-y: visible;
    height: 100%;
  }
`
export const StyledSearch = styled(Search)`
  /* .ant-input-search-button {
    display: none;
  } */
  .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
    height: 36px;
    border-radius: 20px 0 0 20px !important;
  }
  .ant-input-search-button {
    height: 36px;
    border-radius: 0 18px 18px 0 !important;
    border: 1px solid #d9d9d9;
    box-shadow: none !important;
    margin-left: 0px;
  }
  .ant-btn-primary {
    background-color: #fff !important;
    line-height: 40px;
  }
  .ant-input-affix-wrapper-focused {
    border-color: #d9d9d9 !important;
    box-shadow: none !important;
  }
  .ant-input-affix-wrapper:hover {
    border-color: #d9d9d9 !important;
  }
  max-width: 300px;
  @media (max-width: 768px) {
    /* width: 120px; */
    min-width: 240px;
    max-width: 98%;

    width: 100%;
  }
`
export const StyledSearchDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  margin-bottom: 10px;

  width: 100%;
  @media (max-width: 768px) {
    width: 100%;

    padding-right: 0px;
    margin-top: 5px;
  }
`
const StyledRight = styled.div`
  margin-left: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  div:nth-of-type(2) {
    margin-top: auto; // 将第二个 div 元素推到容器底部
  }
  @media (max-width: 768px) {
    margin-left: 0px;
  }
`
const StyledVideos = styled.div`
  /* display: flex; */
  justify-content: flex-start;
  flex-wrap: wrap;
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

const StyledButton = styled(Button)`
  margin-left: 20px;
  margin-top: 2px;
  color: #fff !important;
  background-color: #fb7299 !important;
  /* padding: 10px; */
  .ant-btn {
    color: #fff !important;
  }
  @media (max-width: 768px) {
    margin-left: 5px;
  }
`
export const HistoryPart = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const openNewWindow = useOpenNewWindow()

  const [videoList, setVideoList] = useState<IlistItem[]>([])
  // const { tableParams, handleTableChange } = usePagination(30)
  // const [total, setTotal] = useState(0)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  const widthPartNumber = useScreenWidth({
    defaultWidthPartNumber: 4,
    threshold: 2,
  })
  /**
   * 查询历史记录
   */
  const searchHistory = async (title = '') => {
    const resp = await services.video$search$history({
      // ...tableParams,
      title,
    })
    if (resp.data.code === 200) {
      setVideoList(resp.data.resource)
      // setTotal(resp.data.resource.totalCount)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      setVideoList([])
      // setTotal(0)
      setIsLoading(false) // 数据加载完成，更新加
    }
  }
  /**
   *清空历史记录
   */
  const clearHistory = async () => {
    const resp = await services.video$clear$history()
    if (resp.data.code === 200) {
      message.success('历史记录已全部清除')
      setIsModalShow(false)
      searchHistory()
    } else {
      message.error('请重试')
    }
  }
  /**
   * 查询
   * @param value
   * @returns
   */
  const onSearch: SearchProps['onSearch'] = (value) => searchHistory(value)

  useEffect(() => {
    searchHistory()
  }, [])
  return (
    <StyledPage
      style={{ height: isMobile ? '100%' : window.innerHeight - 100 }}
    >
      <StyledTop>
        <StyledTitle>
          历史记录<span style={{ fontSize: 15 }}>（显示最近100条）</span>
        </StyledTitle>
      </StyledTop>
      <StyledSearchDiv>
        <StyledSearch
          placeholder={`${isMobile ? '搜索历史记录' : '搜索历史记录'}`}
          onSearch={onSearch}
          allowClear
          enterButton={
            <SearchOutlined style={{ color: '#1f1f1f', fontSize: 20 }} />
          }
          style={{ borderRadius: '18px' }}
        />
        <StyledButton
          type="primary"
          danger
          onClick={() => {
            if (videoList.length === 0) {
              message.warning('没有历史记录需要清理')
              return
            }
            setIsModalShow(true)
          }}
        >
          清空历史
        </StyledButton>
      </StyledSearchDiv>

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
                    : `观看时间：${formatDateHM(item.createdAt)}`}
                </div>
              </StyledRight>
            </div>
          ))
        ) : (
          <CommonEmpty
            navigateHandler={() => searchHistory('')}
            type="history"
          />
        )}
      </StyledVideos>

      {/* <StyledPagination>
        <CommonPagination
          total={total}
          totalInfo={`共 ${total} 个视频`}
          currentPage={tableParams.currentPage}
          pageSize={tableParams.pageSize}
          onPageChange={handleTableChange}
        />
      </StyledPagination> */}
      <CommonModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        oKHandler={clearHistory}
        title={'删除确认'}
        childrenPart={<div>确认删除所有历史记录</div>}
      ></CommonModal>
    </StyledPage>
  )
}
