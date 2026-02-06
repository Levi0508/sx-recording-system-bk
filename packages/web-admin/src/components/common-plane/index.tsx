import React, { useEffect, useState } from 'react'
import { Card, Col, message, Row, Statistic, StatisticProps } from 'antd'
import styled from '@emotion/styled'

import { services } from '@af-charizard/sdk-services'
import CountUp from 'react-countup'
import { ArrowUpOutlined } from '@ant-design/icons'

const StyledPage = styled.div`
  width: calc(100% - 12px);
  height: 100%;
`
const StyledRow = styled(Row)`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 50%;
  &:first-of-type {
    height: calc(50% - 10px);
    margin-bottom: 10px;
  }
  @media (max-width: 768px) {
    flex-direction: column; /* 设置子元素竖直排列 */
  }
  .ant-card {
    @media (max-width: 768px) {
      width: 200px;
      margin-bottom: 10px;
    }
  }
`

const StyledCol = styled.div`
  width: calc(100% - 10px);
  height: 100%;
  margin-right: 10px;
`
const StyledTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  /* color: black; */
`

export interface DataProps {
  title: string
  count: number
  borderLeftColor?: string
}
export const CommonPlane = () => {
  const [listArr, setListArr] = useState<DataProps[]>([])

  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
  )

  const incomeAndProfitData = async () => {
    const resp = await services.user$register$info()

    if (resp.data.code === 200) {
      const result: any = resp.data.resource
      const arr = [
        {
          count: result.registeredUserCount,
          title: '注册总人数',
          borderLeftColor: '#cf1322',
        },
        {
          count: result.visitCount,
          title: '今日访问量',
          borderLeftColor: '#3f8600',
        },
        {
          count: result.dailyRegisteredUsers,
          title: '今日注册人数',
          borderLeftColor: '#3f8600',
        },
      ]

      setListArr(arr)
    } else {
      message.error(resp.data.message)
    }
  }

  useEffect(() => {
    // 初次加载时调用一次
    incomeAndProfitData()

    // 设置定时器，每隔 60 秒调用一次
    const interval = setInterval(() => {
      incomeAndProfitData()
    }, 60000) // 60000 毫秒 = 1 分钟

    // 清除定时器，防止内存泄漏
    return () => clearInterval(interval)
  }, [])
  return (
    <StyledPage>
      <StyledRow>
        {listArr.map((item, index) => {
          return (
            <Col span={6}>
              <Card bordered={true}>
                <Statistic
                  title={<StyledTitle>{item.title}</StyledTitle>}
                  value={item.count}
                  precision={2}
                  valueStyle={{
                    color: item.borderLeftColor,
                    fontSize: 35,
                    fontWeight: 600,
                  }}
                  prefix={
                    item.title !== '注册总人数' && (
                      <ArrowUpOutlined style={{ color: '#3f8600' }} />
                    )
                  }
                  // suffix="%"
                  formatter={formatter}
                />
              </Card>
            </Col>
          )
        })}
        {/* {listArr.map((item, index) => {
          return (
            <Col xs={{ span: 8 }} key={index}>
              <StyledCol>
                <PagePlaneBlock {...item} />
              </StyledCol>
            </Col>
          )
        })} */}
      </StyledRow>
    </StyledPage>
  )
}
