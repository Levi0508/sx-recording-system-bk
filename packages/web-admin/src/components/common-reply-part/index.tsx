import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { message } from 'antd'

import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import CommentSection from './components/comment-section'
import { usePagination } from '~/hooks'

import { services } from '@af-charizard/sdk-services'
import { useParams } from 'react-router'
import { ICommentList } from '@af-charizard/sdk-services/src/services/comment$find$videoId'
import { StyledPagination } from '~/pages/classification-detail'
import { CommonPagination } from '../common-pagination'
import { ReplyInput } from './components/reply-input' // 引入新的组件

const StyledPage = styled.div`
  margin-top: 10px;
  @media (max-width: 768px) {
  }
`

interface IProps {}

export const ReplyPart: React.FC<IProps> = () => {
  const userStore = useStore(UserStore)

  const { id } = useParams()

  const [comments, setComments] = useState<ICommentList[]>([])
  const { tableParams, handleTableChange } = usePagination(5)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const [inputValue, setInputValue] = useState('')

  /**
   * 查询评论
   */
  const searchCommentList = async () => {
    const resp = await services.comment$find$videoId({
      videoId: Number(id),
      ...tableParams,
    })
    if (resp.data.code === 200) {
      setComments(resp.data.resource.list)
      setTotal(resp.data.resource.totalCount)
    } else {
      setComments([])
      setTotal(0)
    }
  }

  /**
   * 发布一级评论
   * @returns
   */
  const handleSubmit = async () => {
    if (!inputValue) {
      message.warning('请先输入内容')
      return
    }
    setLoading(true)
    const resp = await services.comment$create({
      videoId: Number(id),
      content: inputValue,
    })

    setTimeout(() => {
      if (resp.data.code === 200) {
        message.success('发布成功')
        searchCommentList()
        setInputValue('')
        setLoading(false)
        setIsFocused(false)
      } else {
        message.error('评论失败请重试')
        setLoading(false)
        setIsFocused(false)
      }
    }, 1000)
  }

  useEffect(() => {
    searchCommentList()
  }, [tableParams, id])

  return (
    userStore.user && (
      <StyledPage>
        <h2 style={{ marginBottom: 20 }}>
          评论
          <span style={{ marginLeft: 5, color: '#95999f', fontSize: 15 }}>
            {total}
          </span>
        </h2>

        <ReplyInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <CommentSection
          comments={comments}
          setComments={setComments}
          searchCommentList={searchCommentList}
        />
        <StyledPagination>
          <CommonPagination
            total={total}
            totalInfo={`共 ${total} 条评论`}
            currentPage={tableParams.currentPage}
            pageSize={tableParams.pageSize}
            onPageChange={handleTableChange}
            pageSizeOptions={[5, 10, 20]}
          />
        </StyledPagination>
      </StyledPage>
    )
  )
}

export default ReplyPart
