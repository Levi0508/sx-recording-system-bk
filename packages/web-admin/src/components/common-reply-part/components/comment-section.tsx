import React, { useState, useEffect, useRef } from 'react'
import type { ICommentList } from '@af-charizard/sdk-services/src/services/comment$find$videoId'
import styled from '@emotion/styled'
import { Button, Divider, Tag, message } from 'antd'
import { formatDateHM } from '~/utils/date'
import {
  DeleteOutlined,
  LikeFilled,
  LikeOutlined,
  PushpinOutlined,
  SketchOutlined,
} from '@ant-design/icons'
import { ReplyInput } from './reply-input'
import { services } from '@af-charizard/sdk-services'
import { useParams } from 'react-router'
import { formatNumberWithW } from '~/utils/handleUnit'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { CommonModal } from '~/components/common-modal'
import { CommonEmpty } from '~/components/common-empty'
import { checkMembershipStatus } from '~/utils/isVip'
import { useIsMobile } from '~/hooks'
import CommonIdCard from '~/components/common-id-card'
import CommonAvatarFrame from '~/components/common-avatar-frame'
import { signMap } from '~/pages/vip-preview/components/home'

const StyledPage = styled.div`
  margin-top: 10px;
  .ant-divider-horizontal {
    margin: 15px 0;
  }
  .ant-btn-icon {
    margin-inline-end: 2px !important;
  }
  @media (max-width: 768px) {
    margin-left: 0px;
    .ant-divider-horizontal {
      margin: 10px 0;
    }
  }
`

const StyledReply = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 0 0 5px 25px;
  align-items: flex-start;
  position: relative; /* 添加这行 */
  &:hover .delete-icon {
    /* 添加这行 */
    display: block; /* 添加这行 */
  }
  @media (max-width: 768px) {
    margin: 0 0 5px 5px;
  }
`
const DeleteIcon = styled(DeleteOutlined)`
  display: none; /* 添加这行 */
  position: absolute; /* 添加这行 */
  right: 0px; /* 添加这行 */
  bottom: 10px; /* 添加这行 */
  font-size: 16px;
  color: #fb7299;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block; /* 添加这行 */
  }
`
const StyledSign = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  cursor: pointer;
`
const StyledInfo = styled.div<{ expanded: boolean; isPinned: boolean }>`
  margin: 6px 0px 0px 10px;
  flex: 1;
  .email {
    /* cursor: pointer; */
    /* color: #ed7099; */
    font-size: 15px;
    margin-bottom: 8px;
  }

  .content {
    font-size: 13px;
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.5;
    letter-spacing: 0.5px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: ${({ expanded }) => (expanded ? 'unset' : '3')};
    -webkit-box-orient: vertical;
    margin-bottom: 5px;
  }
  .toggle {
    margin: 5px 5px 0 5px;
    color: #1890ff;
    span {
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    margin: 4px 0px 5px 5px;
  }
`

const StyledTL = styled.div`
  color: #9499a0;
  font-weight: 400;
  font-size: 13px;
  margin-top: 5px;
  .createdAt {
    margin-right: 10px;
  }
  .ant-btn {
    padding: 5px !important;
  }
`

const StyledMoreReplies = styled.div`
  margin-top: 10px;
  margin-left: 35px;
  span {
    cursor: pointer;
    color: #9499a0 !important;
  }
`

interface IProps {
  comments: ICommentList[]
  searchCommentList: () => Promise<void>
  setComments: React.Dispatch<React.SetStateAction<ICommentList[]>>
}

const CommentSection: React.FC<IProps> = ({
  comments,
  searchCommentList,
  setComments,
}) => {
  console.log('%c这是锋酱的打印', 'color: red; font-size: 30px;', comments)

  const { id } = useParams()
  const userStore = useStore(UserStore)

  const [expandedComments, setExpandedComments] = useState<{
    [key: number]: boolean
  }>({})
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: number | string]: boolean
  }>({})
  const [isOverflowed, setIsOverflowed] = useState<{ [key: number]: boolean }>(
    {},
  )
  const [isReplyOverflowed, setIsReplyOverflowed] = useState<{
    [key: string]: boolean
  }>({})
  const contentRefs: React.MutableRefObject<{
    [key: number]: HTMLDivElement | null
  }> = useRef({})
  const replyContentRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null
  }> = useRef({})

  const isMobile = useIsMobile()

  const [isModalShow, setIsModalShow] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState(0)
  const [isReply, setIsReply] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const [commentId, setCommentId] = useState<number | undefined>()

  const [isUserModalShow, setIsUserModalShow] = useState(false)
  const [userId, setUserId] = useState<number | undefined>()

  const [replyInputVisible, setReplyInputVisible] = useState<{
    [key: number]: boolean
  }>({})

  const [pinnedComments, setPinnedComments] = useState<{
    [key: number]: boolean
  }>({})

  const handleSubmit = async (
    commentIndex: number,
    commentId: number,
    isReply: number,
  ) => {
    if (!inputValue) {
      message.warning('请先输入内容')
      return
    }
    setLoading(true)
    const resp = await services.comment$reply({
      content: inputValue,
      commentId,
      isReply,
    })

    setTimeout(() => {
      if (resp.data.code === 200) {
        message.success('发布成功')
        setInputValue('')
        searchCommentList()
        setReplyInputVisible({ ...replyInputVisible, [commentIndex]: false })
      } else {
        message.error('评论失败请重试')
      }
      setLoading(false)
    }, 1000)
  }
  useEffect(() => {
    const initialPinnedComments: { [key: number]: boolean } = {}
    comments.forEach((comment, index) => {
      initialPinnedComments[index] = comment.isTop === 1
    })
    setPinnedComments(initialPinnedComments)
  }, [comments])

  useEffect(() => {
    const newIsOverflowed: { [key: number]: boolean } = {}
    comments.forEach((comment, index) => {
      if (contentRefs.current[index]) {
        newIsOverflowed[index] =
          contentRefs.current[index]!.scrollHeight >
          contentRefs.current[index]!.clientHeight
      }
    })
    setIsOverflowed(newIsOverflowed)
  }, [comments])

  useEffect(() => {
    const newIsReplyOverflowed: { [key: string]: boolean } = {}
    comments.forEach((comment, commentIndex) => {
      comment.replies.list.forEach((reply: any, replyIndex: number) => {
        const key = `${commentIndex}-${replyIndex}`
        if (replyContentRefs.current[key]) {
          newIsReplyOverflowed[key] =
            replyContentRefs.current[key]!.scrollHeight >
            replyContentRefs.current[key]!.clientHeight
        }
      })
    })
    setIsReplyOverflowed(newIsReplyOverflowed)
  }, [comments, expandedReplies])

  const handleCommentToggle = (index: number) => {
    setExpandedComments({
      ...expandedComments,
      [index]: !expandedComments[index],
    })
  }

  const handleReplyToggle = (commentIndex: number) => {
    setExpandedReplies({
      ...expandedReplies,
      [commentIndex]: !expandedReplies[commentIndex],
    })
  }

  const handleReplyContentToggle = (
    commentIndex: number,
    replyIndex: number,
  ) => {
    const key = `${commentIndex}-${replyIndex}`
    setExpandedReplies({
      ...expandedReplies,
      [key]: !expandedReplies[key as any],
    })
  }

  const toggleReplyInput = (commentIndex: number) => {
    // Close previously open ReplyInput
    const updatedReplyInputVisible = { ...replyInputVisible }
    Object.keys(updatedReplyInputVisible).forEach((key) => {
      updatedReplyInputVisible[key as any] = false
    })

    // Toggle the current ReplyInput
    updatedReplyInputVisible[commentIndex] = !replyInputVisible[commentIndex]

    setReplyInputVisible(updatedReplyInputVisible)
    setInputValue('') // Clear input value when toggling
    setIsFocused(true) // Set focus when showing input
  }

  const [loadingLike, setLoadingLike] = useState(false)

  const handleLikeComment = async (
    commentIndex: number,
    commentId: number,
    isReply: number,
    hasLiked: boolean,
  ) => {
    setLoadingLike(true)
    try {
      let resp
      if (hasLiked) {
        resp = await services.comment$like$remove({
          videoId: Number(id),
          commentId,
          isReply,
        })
      } else {
        resp = await services.comment$like$add({
          videoId: Number(id),
          commentId,
          isReply,
        })
      }

      if (resp.data.code === 200) {
        const updatedComments = [...comments]
        const updatedComment = updatedComments[commentIndex]
        updatedComment.hasLiked = !hasLiked
        updatedComment.likeNum = hasLiked
          ? updatedComment.likeNum - 1
          : updatedComment.likeNum + 1

        setComments(updatedComments)
      } else {
        message.error(resp.data.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingLike(false)
    }
  }
  const handleLikeReply = async (
    commentIndex: number,
    replyIndex: number,
    replyId: number,
    hasLiked: boolean,
  ) => {
    setLoadingLike(true)
    const key = `${commentIndex}-${replyIndex}`
    try {
      let resp
      if (hasLiked) {
        resp = await services.comment$like$remove({
          videoId: Number(id),
          commentId: replyId,
          isReply: 1,
        })
      } else {
        resp = await services.comment$like$add({
          videoId: Number(id),
          commentId: replyId,
          isReply: 1,
        })
      }

      if (resp.data.code === 200) {
        const updatedComments = [...comments]
        const updatedComment = updatedComments[commentIndex]
        const updatedReply = updatedComment.replies.list[replyIndex]
        updatedReply.hasLiked = !hasLiked
        updatedReply.likeNum = hasLiked
          ? updatedReply.likeNum - 1
          : updatedReply.likeNum + 1

        setComments(updatedComments)
      } else {
        message.error(resp.data.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingLike(false)
    }
  }
  const handleDeleteComment = async () => {
    try {
      const resp = await services.comment$delete({
        // videoId: Number(id),
        commentId: deleteCommentId,
        isReply,
      })

      if (resp.data.code === 200) {
        message.success('删除成功')
        searchCommentList()
        setIsModalShow(false)
      } else {
        message.error(resp.data.message)
        setIsModalShow(false)
      }
    } catch (error) {
      console.error(error)
      message.error('删除失败')
      setIsModalShow(false)
    }
  }

  const handlePinComment = async (commentId: number, commentIndex: number) => {
    if (!pinnedComments[commentIndex]) {
      const resp = await services.comment$top$add({
        commentId,
      })
      if (resp.data.code === 200) {
        message.success('置顶成功')
        setPinnedComments({
          ...pinnedComments,
          [commentIndex]: !pinnedComments[commentIndex],
        })
        searchCommentList()
      } else {
        message.error(resp.data.message)
      }
    } else {
      const resp = await services.comment$top$remove({
        commentId,
      })
      if (resp.data.code === 200) {
        message.success('取消成功')
        setPinnedComments({
          ...pinnedComments,
          [commentIndex]: !pinnedComments[commentIndex],
        })
        searchCommentList()
      } else {
        message.error(resp.data.message)
      }
    }
  }

  return comments.length > 0 ? (
    <StyledPage>
      {comments.map((comment, commentIndex) => (
        <div key={commentIndex}>
          <StyledReply>
            <div
              onClick={() => {
                setIsUserModalShow(true)
                setUserId(comment.user.id)
              }}
            >
              <CommonAvatarFrame
                avatar={comment.user.avatar}
                selectedFrame={comment.user.avatarFrame}
                useAntdImage={false}
                // size={isMobile ? 60 : 70}
                size={isMobile ? 40 : 40}
              ></CommonAvatarFrame>
              {/* {isMobile
                ? AvatarCpn(comment.user?.avatar, 40)
                : AvatarCpn(comment.user?.avatar, 40)} */}
            </div>
            <StyledInfo
              expanded={expandedComments[commentIndex] || false}
              isPinned={pinnedComments[commentIndex] || false}
            >
              <div
                className="email"
                style={{
                  color:
                    checkMembershipStatus(comment.user.vipDeadLine).status ===
                    'valid'
                      ? '#ed7099'
                      : 'black',
                }}
              >
                <StyledSign
                  onClick={() => {
                    setIsUserModalShow(true)
                    setUserId(comment.user.id)
                  }}
                >
                  {checkMembershipStatus(comment.user.vipDeadLine).status ===
                    'valid' && (
                    <>
                      <div style={{ marginBottom: 3 }}>
                        {signMap.get(comment.user.vipType)}
                      </div>
                      <SketchOutlined
                        style={{
                          fontSize: 16,
                          marginRight: 3,
                        }}
                      />
                    </>
                  )}

                  {comment.user.nickname || '默认昵称'}
                </StyledSign>
              </div>
              <div
                className="content"
                ref={(el) => (contentRefs.current[commentIndex] = el)}
              >
                {comment.isTop ? <Tag color="red">置顶</Tag> : ''}
                {comment.content}
              </div>
              {isOverflowed[commentIndex] && (
                <div className="toggle">
                  <span onClick={() => handleCommentToggle(commentIndex)}>
                    {expandedComments[commentIndex] ? '收起' : '展开'}
                  </span>
                </div>
              )}
              <StyledTL>
                <span className="createdAt">
                  {formatDateHM(comment.createdAt)}
                </span>
                <span
                  onClick={() =>
                    loadingLike
                      ? message.warning('动作太快啦')
                      : handleLikeComment(
                          commentIndex,
                          comment.id,
                          comment.isReply,
                          comment.hasLiked,
                        )
                  }
                  style={{
                    color: comment.hasLiked ? '#FB7299' : '#95999f',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ marginLeft: 6 }}>
                    {comment.hasLiked ? (
                      <LikeFilled
                        style={{
                          marginRight: 2,
                          color: '#FB7299',
                          fontSize: 15,
                        }}
                      />
                    ) : (
                      <LikeOutlined
                        style={{
                          marginRight: 2,
                          color: '#95999f',
                          fontSize: 15,
                        }}
                      />
                    )}
                  </span>
                  <span>{formatNumberWithW(comment.likeNum)}</span>
                </span>

                <Button
                  type="link"
                  style={{ color: '#9499a0', margin: '0 6px' }}
                  onClick={() => {
                    setIsReply(0)
                    toggleReplyInput(commentIndex)
                    setCommentId(comment.id)
                  }}
                >
                  回复
                </Button>
                {userStore.hasAccess('user:read:all') && (
                  <PushpinOutlined
                    className="pin-icon"
                    onClick={() => handlePinComment(comment.id, commentIndex)}
                  />
                )}

                {(comment.user.id === userStore.user?.id ||
                  userStore.hasAccess('user:delete:comment')) && ( // 修改
                  <div style={{ position: 'absolute', right: 10 }}>
                    <DeleteIcon
                      className="delete-icon"
                      onClick={() => {
                        setIsModalShow(true)
                        setDeleteCommentId(comment.id)
                        setIsReply(0)
                      }}
                    />
                  </div>
                )}
              </StyledTL>
              {isReply === 0 && replyInputVisible[commentIndex] && (
                <ReplyInput
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  isFocused={isFocused}
                  setIsFocused={setIsFocused}
                  handleSubmit={() =>
                    handleSubmit(commentIndex, comment.id, comment.isReply)
                  }
                  loading={loading}
                />
              )}
            </StyledInfo>
          </StyledReply>

          <div style={{ marginLeft: 45 }}>
            {comment.replies.list
              .slice(
                0,
                expandedReplies[commentIndex] ? comment.replies.list.length : 3,
              )
              .map((reply: any, replyIndex: number) => (
                <StyledReply key={replyIndex}>
                  <span
                    onClick={() => {
                      setIsUserModalShow(true)
                      setUserId(reply.user.id)
                    }}
                  >
                    <CommonAvatarFrame
                      avatar={reply.user.avatar}
                      selectedFrame={reply.user.avatarFrame}
                      useAntdImage={false}
                      // size={isMobile ? 60 : 70}
                      size={isMobile ? 40 : 40}
                    ></CommonAvatarFrame>
                    {/* {isMobile
                      ? AvatarCpn(reply.user?.avatar, 40)
                      : AvatarCpn(reply.user?.avatar, 40)} */}
                  </span>

                  <StyledInfo
                    expanded={
                      expandedReplies[`${commentIndex}-${replyIndex}` as any] ||
                      false
                    }
                    isPinned={false}
                  >
                    <div
                      className="email"
                      style={{
                        color:
                          checkMembershipStatus(reply.user.vipDeadLine)
                            .status === 'valid'
                            ? '#ed7099'
                            : 'black',
                      }}
                    >
                      <StyledSign
                        onClick={() => {
                          setIsUserModalShow(true)
                          setUserId(reply.user.id)
                        }}
                      >
                        {checkMembershipStatus(reply.user.vipDeadLine)
                          .status === 'valid' && (
                          <>
                            <div style={{ marginBottom: 3 }}>
                              {signMap.get(reply.user.vipType)}
                            </div>
                            <SketchOutlined
                              style={{
                                fontSize: 16,
                                marginRight: 3,
                              }}
                            />
                          </>
                        )}
                        {reply.user.nickname || '默认昵称'}
                      </StyledSign>
                    </div>
                    <div
                      className="content"
                      ref={(el) =>
                        (replyContentRefs.current[
                          `${commentIndex}-${replyIndex}`
                        ] = el)
                      }
                    >
                      {reply.replyIsReply === 1
                        ? `回复 @${reply.replyUser?.nickname || '默认昵称'}：${reply.content}`
                        : reply.content}
                    </div>
                    {isReplyOverflowed[`${commentIndex}-${replyIndex}`] && (
                      <div className="toggle">
                        <span
                          onClick={() =>
                            handleReplyContentToggle(commentIndex, replyIndex)
                          }
                        >
                          {expandedReplies[
                            `${commentIndex}-${replyIndex}` as any
                          ]
                            ? '收起'
                            : '展开'}
                        </span>
                      </div>
                    )}
                    <StyledTL>
                      <span className="createdAt">
                        {formatDateHM(reply.createdAt)}
                      </span>

                      <span
                        onClick={() =>
                          loadingLike
                            ? message.warning('动作太快啦')
                            : handleLikeReply(
                                commentIndex,
                                replyIndex,
                                reply.id,
                                reply.hasLiked,
                              )
                        }
                        style={{
                          color: reply.hasLiked ? '#FB7299' : '#95999f',
                          cursor: 'pointer',
                          marginLeft: 6,
                        }}
                      >
                        {reply.hasLiked ? (
                          <LikeFilled
                            style={{
                              marginRight: 2,
                              color: '#FB7299',
                              fontSize: 15,
                            }}
                          />
                        ) : (
                          <LikeOutlined
                            style={{
                              marginRight: 2,
                              color: '#95999f',
                              fontSize: 15,
                            }}
                          />
                        )}
                        {formatNumberWithW(reply.likeNum)}
                      </span>
                      <Button
                        type="link"
                        style={{
                          color: '#9499a0',
                          position: 'relative',
                          margin: '0 6px',
                        }}
                        onClick={() => {
                          setIsReply(1)
                          toggleReplyInput(replyIndex)
                          setCommentId(comment.id)
                        }}
                      >
                        回复
                      </Button>
                      <div style={{ position: 'absolute', right: 10 }}>
                        {(reply.user.id === userStore.user?.id ||
                          userStore.hasAccess('user:delete:comment')) && ( // 修改
                          <DeleteIcon
                            className="delete-icon"
                            onClick={() => {
                              setIsModalShow(true)
                              setDeleteCommentId(reply.id)
                              setIsReply(1)
                            }}
                          ></DeleteIcon>
                        )}
                      </div>
                      {isReply === 1 &&
                        commentId === comment.id &&
                        replyInputVisible[replyIndex] && (
                          <ReplyInput
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            isFocused={isFocused}
                            setIsFocused={setIsFocused}
                            handleSubmit={() =>
                              handleSubmit(replyIndex, reply.id, reply.isReply)
                            }
                            loading={loading}
                          />
                        )}
                    </StyledTL>
                  </StyledInfo>
                </StyledReply>
              ))}
            {comment.replies.list.length > 3 && (
              <StyledMoreReplies>
                <span onClick={() => handleReplyToggle(commentIndex)}>
                  {expandedReplies[commentIndex]
                    ? '收起回复'
                    : `共${comment.replies.list.length}条回复, 点击查看`}
                </span>
              </StyledMoreReplies>
            )}
          </div>
          <Divider />
        </div>
      ))}
      <CommonModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        oKHandler={handleDeleteComment}
        title={'删除确认'}
        childrenPart={<div>确认删除该评论？</div>}
      ></CommonModal>
      <CommonIdCard
        isModalShow={isUserModalShow}
        setIsModalShow={setIsUserModalShow}
        userId={userId!}
      ></CommonIdCard>
    </StyledPage>
  ) : (
    <CommonEmpty title="快来发表第一条评论吧"></CommonEmpty>
  )
}

export default CommentSection
