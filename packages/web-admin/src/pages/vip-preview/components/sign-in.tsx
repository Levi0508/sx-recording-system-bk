import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

import {
  Calendar,
  Button,
  message,
  Card,
  Col,
  Row,
  Statistic,
  StatisticProps,
} from 'antd'
import { services } from '@af-charizard/sdk-services'

import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import moment from 'moment'

import { StyledTitle, StyledTop } from './favorite'
import dayjs from 'dayjs'
import { useIsMobile } from '~/hooks/useIsMobile'
import { CommentWarning } from '~/components/common-warning'
import { CommonModal } from '~/components/common-modal'
import CountUp from 'react-countup'
import { useStore } from '@kazura/react-mobx'
import { UserStore } from '@af-charizard/sdk-stores'
import { useLocation } from 'react-router'

const StyledPage = styled.div`
  width: 100%;

  .ant-card-body {
    height: 100%;
    padding: 15px 15px 15px 15px;

    .ant-card-meta-avatar {
      padding-inline-end: 10px;
    }

    @media (max-width: 768px) {
      padding: 15px 15px 15px 15px;
    }
  }
  .avatar_ff {
    .ant-card-body {
      height: 100%;
      padding: 27px 15px 25px 28px;

      .ant-card-meta-avatar {
        padding-inline-end: 26px;
      }

      @media (max-width: 768px) {
        .ant-card-meta-avatar {
          padding-inline-end: 16px;
        }
        padding: 20px 10px 15px 20px;
      }
    }
  }
  .ant-avatar {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 768px) {
    .ant-card {
      height: 100%;
    }
    .ant-table-cell {
      padding: 10px 10px !important;
    }
    .ant-picker-calendar.ant-picker-calendar-full
      .ant-picker-calendar-date-content {
      height: 50px !important;
    }
  }
  .ant-card-meta-title {
    margin-bottom: 4px !important;
  }
`
export const SignInPart = () => {
  const isMobile = useIsMobile()
  const userStore = useStore(UserStore)
  const location = useLocation()

  const [signInDates, setSignInDates] = useState<string[]>([])
  const [signInStatsDates, setSignStatsInDates] = useState({
    totalCheckins: 0,
    currentStreak: 0,
    currentSignInMonth: 0,
  })
  const [isModalShow, setIsModalShow] = useState(false)

  const [today, setToday] = useState(moment().format('YYYY-MM-DD'))
  const [loading, setLoading] = useState(false)

  const isSignedToday = signInDates.includes(today)

  const handleSignIn = async () => {
    setLoading(true)
    window.open('https://shunkangbjyp.tmall.com')
    await services.signIn$handle({
      userId: userStore.user.id,
      referrer: location.pathname,
    })
    const resp = await services.signIn$checkin()
    if (resp.data.code === 200) {
      message.success(resp.data.resource.message)
      getSignInCheckinInfo()
      setLoading(false)
      setIsModalShow(false)
    } else {
      message.error(resp.data.message)
      setLoading(false)
      setIsModalShow(false)
    }
  }

  const getSignInCheckinInfo = async () => {
    const resp = await services.signIn$checkinInfo()
    if (resp.data.code === 200) {
      setSignInDates(resp.data.resource.signInRecords)
      setSignStatsInDates(resp.data.resource.signInStatsRecords)
    } else {
      message.error(resp.data.message)
    }
  }
  useEffect(() => {
    getSignInCheckinInfo()
  }, [])

  const dateCellRenderPC = (value: any) => {
    const date = value.format('YYYY-MM-DD')
    const today = moment().format('YYYY-MM-DD')
    const currentMonth = moment().format('YYYY-MM')

    // 过滤非本月日期，不显示任何内容
    if (!value.format('YYYY-MM').includes(currentMonth)) {
      return <div></div>
    }

    if (date > today) {
      // 未来日期置灰
      return (
        <div style={{ color: 'gray', textAlign: 'center' }}>
          {/* <ClockCircleOutlined style={{ fontSize: 20 }} /> */}
          <div>未到日期</div>
        </div>
      )
    } else if (date === today) {
      // 当前日期，检查是否已签到
      if (signInDates.includes(date)) {
        // 已签到
        return (
          <div style={{ color: 'green', textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 20 }} />
            <div>已签到</div>
          </div>
        )
      } else {
        // 待签到
        return (
          <div
            style={{ textAlign: 'center', color: 'blue', cursor: 'pointer' }}
          >
            <ClockCircleOutlined style={{ fontSize: 20 }} />

            <div>
              <button style={{ border: 'none', background: 'transparent' }}>
                待签到
              </button>
            </div>
          </div>
        )
      }
      // 当前日期，显示点击签到
      // return (
      //   <div style={{ textAlign: 'center', color: 'blue', cursor: 'pointer' }}>
      //     <ClockCircleOutlined style={{ fontSize: 20 }} />

      //     <div>
      //       <button style={{ border: 'none', background: 'transparent' }}>
      //         待签到
      //       </button>
      //     </div>
      //   </div>
      // )
    } else if (signInDates.includes(date)) {
      // 过去已签到
      return (
        <div style={{ color: 'green', textAlign: 'center' }}>
          <CheckCircleOutlined style={{ fontSize: 20 }} />
          <div>已签到</div>
        </div>
      )
    } else {
      // 过去未签到
      return (
        <div style={{ color: 'red', textAlign: 'center' }}>
          <CloseCircleOutlined style={{ fontSize: 20 }} />
          <div>未签到</div>
        </div>
      )
    }
  }
  const dateCellRenderMobile = (value: any) => {
    const date = value.format('YYYY-MM-DD')
    const today = dayjs().format('YYYY-MM-DD')
    const currentMonth = dayjs().format('YYYY-MM')

    if (!value.format('YYYY-MM').includes(currentMonth)) {
      return <div></div> // 非本月日期，不显示内容
    }

    return (
      <div
        style={{
          height: '40px', // 调整单元格高度
          // width: '40px', // 让单元格不会被挤压
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {date > today ? (
          <ClockCircleOutlined style={{ fontSize: 18, color: 'gray' }} />
        ) : date === today ? (
          signInDates.includes(date) ? (
            <CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} />
          ) : (
            <ClockCircleOutlined
              style={{ fontSize: 18, color: 'blue' }}
              onClick={() => setIsModalShow(true)}
            />
          )
        ) : signInDates.includes(date) ? (
          <CheckCircleOutlined style={{ fontSize: 18, color: 'green' }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: 18, color: 'red' }} />
        )}
      </div>
    )
  }

  return (
    <StyledPage>
      <div>
        {!isMobile && (
          <CommentWarning
            style={{ marginLeft: 5, marginBottom: 15 }}
            children={
              <>
                <div>
                  1、点击签到按钮，将打开淘宝店铺窗口，关注店铺后才视为签到成功！
                </div>
                <div>2、 签到天数累计后可兑换会员天数（每日8点更新签到）</div>
              </>
            }
          ></CommentWarning>
        )}
        <StyledTop>
          <StyledTitle>签到页面</StyledTitle>
        </StyledTop>
        {isMobile ? (
          <div>
            <Card>
              <div style={{ display: 'flex' }}>
                <Statistic
                  title="当月连续签到天数"
                  value={signInStatsDates.currentStreak}
                />

                <Statistic
                  title="当月累计签到天数"
                  value={signInStatsDates.totalCheckins}
                  style={{ marginLeft: 20 }}
                />
              </div>
              <Button
                type="primary"
                block
                style={{ marginTop: 10 }}
                onClick={() => setIsModalShow(true)}
                loading={loading}
                disabled={isSignedToday}
              >
                {isSignedToday ? '今日已签到' : '签到'}
              </Button>
            </Card>
            <Calendar
              headerRender={() => <div></div>}
              cellRender={dateCellRenderMobile}
              disabledDate={(date) => !dayjs(date).isSame(dayjs(), 'day')}
              style={{
                width: '100%',
                maxWidth: '100%',
                minHeight: '400px', // 适配移动端
                overflowX: 'auto', // 允许横向滚动
              }}
            />
          </div>
        ) : (
          <Row gutter={24} style={{ padding: 20 }}>
            <Col span={16}>
              <Calendar
                headerRender={() => <div></div>}
                cellRender={dateCellRenderPC}
                disabledDate={(date) => !dayjs(date).isSame(dayjs(), 'day')}
              />
            </Col>

            {/* 右侧信息栏 */}
            <Col span={7} style={{ marginLeft: 10 }}>
              <Card>
                <Statistic
                  title="当月连续签到天数"
                  value={signInStatsDates.currentStreak}
                />

                <Statistic
                  title="当月累计签到天数"
                  value={signInStatsDates.totalCheckins}
                  style={{ marginTop: 16 }}
                />
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 20 }}
                  onClick={() => setIsModalShow(true)}
                  loading={loading}
                  // disabled
                  disabled={isSignedToday}
                >
                  {isSignedToday ? '今日已签到' : '签到'}
                  {/* 签到功能关闭 */}
                </Button>
                {/* <Button
                  type="primary"
                  block
                  style={{ marginTop: 20 }}
                  loading={loading}
                  disabled
                >
                  签到功能关闭
                </Button> */}
              </Card>
            </Col>
          </Row>
        )}
        <CommonModal
          isModalShow={isModalShow}
          setIsModalShow={setIsModalShow}
          oKHandler={handleSignIn}
          title={'签到确认'}
          childrenPart={
            <>
              {/* <div>
                1、签到将于本月25号进行关闭，届时不能继续签到，但能继续兑换奖励～
              </div> */}
              <div>签到天数累计后可兑换会员天数（每日8点更新签到）</div>
              {/* <div>
                1、点击签到按钮，将打开淘宝店铺窗口，
                <span style={{ color: 'red' }}> 关注店铺 </span>
                后才视为签到成功！
              </div>
              <div>2、签到天数累计后可兑换会员天数（每日8点更新签到）</div> */}
            </>
          }
        ></CommonModal>
      </div>
    </StyledPage>
  )
}
