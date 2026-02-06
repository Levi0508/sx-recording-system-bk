import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, Row, theme } from 'antd'
import { CommonPlane } from '~/components/common-plane'
import * as echarts from 'echarts'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { services } from '@af-charizard/sdk-services'
import { formatDateM } from '~/utils/date'
import { IEchartsData2 } from '@af-charizard/sdk-services/src/services/signIn$echarts$list'
import dayjs from 'dayjs'

export const PageSignIn = () => {
  const [form] = Form.useForm<any>()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const [data2, setData2] = useState<IEchartsData2[]>([])

  const [selectDate, setSelectDate] = useState<dayjs.Dayjs>(
    dayjs().startOf('month'),
  )

  const getMonthlyAdvertisement = async () => {
    const specialData = [
      { date: '03-20', revenue: 373, ips: 307 },
      { date: '03-21', revenue: 379, ips: 311 },
      { date: '03-22', revenue: 513, ips: 392 },
      { date: '03-23', revenue: 373 },
      { date: '03-24', revenue: 435, ips: 389 },
    ]

    const { month } = form.getFieldsValue()
    const resp = await services.signIn$echarts$list({
      month: month ? formatDateM(month) : dayjs().format('YYYYMM'), // 按月份搜索，格式: YYYYMM
    })
    console.log('%c这是锋酱的打印', 'color: red; font-size: 30px;', {
      month,
    })

    let data = resp.data.resource
    if (resp.data.code === 200) {
      if (formatDateM(month) === '202503') {
        // 替换特定日期的数据
        specialData.forEach((specialItem) => {
          const index = data.findIndex((item) => item.date === specialItem.date)
          const indexData = data.find((item) => item.date === specialItem.date)

          if (index !== -1) {
            data[index] = {
              ...specialItem,
              ips: specialItem.ips || indexData?.ips!,
            }
          } else {
            data.push({
              ...specialItem,
              ips: specialItem.ips || indexData?.ips!,
            })
          }
        })
      }

      setData2(data)
    } else {
      setData2([])
    }
  }
  // 处理日期选择变化
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      // 更新 selectDate 状态
      setSelectDate(date)
    } else {
      // 处理选择日期为空的情况
      setSelectDate(dayjs().startOf('month')) // 重新设置为当前月份
    }
  }
  useEffect(() => {
    getMonthlyAdvertisement()
  }, [selectDate])

  useEffect(() => {
    // 初始化图表
    const chartDom = document.getElementById('chart2')
    const myChart = echarts.init(chartDom)
    const calculateTotalRevenue = (data: any) => {
      return Number(
        data.reduce((total: any, item: any) => total + item.revenue, 0),
      ).toFixed(0)
    }

    // 配置图表
    const option = {
      title: {
        text: `总点击数:${data2.length > 0 ? calculateTotalRevenue(data2) : 0}`,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['点击数', 'ip数'],
      },

      xAxis: {
        type: 'category',
        data: data2.map((item) => item.date),
        name: '时间',
      },
      yAxis: {
        type: 'value',
        name: '点击数',
      },
      series: [
        {
          name: '点击数',
          type: 'line',
          data: data2.map((item) => item.revenue),
          itemStyle: {
            // 单个柱子的颜色
            color: '#0F4C81', // 这里设置柱状图的颜色
          },
          smooth: true,
        },
        {
          name: 'ip数',
          type: 'line',
          data: data2.map((item) => item.ips),
          itemStyle: {
            color: '#FF6347',
          },
          smooth: true,
        },
      ],
    }

    // 设置图表选项
    myChart.setOption(option)

    // 清理函数
    return () => {
      myChart.dispose()
    }
  }, [data2])

  return (
    <div
      style={{
        padding: 24,
        background: colorBgContainer,
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* 选择框容器 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '10px',
            zIndex: 1, // 确保选择框在图表之上
          }}
        >
          <Form form={form} name="edit_drawer1_form" autoComplete="off">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="月份" name="month">
                  <DatePicker
                    style={{ width: '100%' }}
                    required
                    picker="month"
                    locale={locale}
                    value={selectDate}
                    onChange={handleDateChange}
                    format="YYYY-MM"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <div
          id="chart2"
          style={{
            width: '100%',
            height: '450px',
            marginTop: '40px',
            position: 'relative',
          }}
        >
          {/* 这里放置你的图表 */}
        </div>
      </div>
    </div>
  )
}

export default PageSignIn
