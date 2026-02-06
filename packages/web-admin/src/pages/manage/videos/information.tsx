import { Button, Space, Table, Form, Row, Col, Input, Select } from 'antd'
import { useEffect, useState } from 'react'

import { services } from '@af-charizard/sdk-services'

import { css } from '@emotion/css'
import { CommonPagination } from '~/components/common-pagination'
import { StyledPagination } from '../../classification-detail'
import { usePagination } from '~/hooks'

import styled from '@emotion/styled'
import { FILTER_ENUM } from '@af-charizard/sdk-types'
import { Loading } from '~/components/loading'
import { IlistItem } from '@af-charizard/sdk-services/src/services/video$findAll'
import { formatDateHMS, formatDuration } from '~/utils/date'

const StyledDiv = styled.div`
  width: 100%;
  padding: 15px;
`

export const PageVideosInformation = () => {
  const [form] = Form.useForm<any>()
  const { tableParams, handleTableChange } = usePagination(30)

  const [dataSource, setDataSource] = useState<IlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true) // 增加一个加载状态

  //总数
  const [total, setTotal] = useState(0)

  const onReset = () => {
    console.log('onReset')
    form.resetFields()
    getClassificationAllVideo()
  }

  /**
   * 获取视频列表
   * @param values
   */
  const getClassificationAllVideo = async () => {
    const { classification, sortType, title, filename } = form.getFieldsValue()
    const resp = await services.video$classification({
      ...tableParams,
      title,
      sortType: sortType ?? FILTER_ENUM.NEW,
      classification,
      filename,
    })
    console.log(
      '%c这是锋酱的打印',
      'color: red; font-size: 30px;',
      resp.data.resource,
    )

    if (resp.data.code === 200) {
      setDataSource(resp.data.resource.list)
      setTotal(resp.data.resource.totalCount)
      setIsLoading(false) // 数据加载完成，更新加
    } else {
      setDataSource([])
      setTotal(0)
      setIsLoading(false) // 数据加载完成，更新加
    }
  }
  useEffect(() => {
    getClassificationAllVideo()
  }, [tableParams])
  return (
    <StyledDiv>
      <Form
        style={{ padding: '15px' }}
        form={form}
        name="edit_drawer1_form"
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={7}>
            <Form.Item label="视频标题" name="title">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="主播分类" name="classification">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item label="排序类型" name="sortType">
              <Select
                allowClear
                placeholder="请选择"
                defaultValue={FILTER_ENUM.NEW}
                options={[
                  { label: '最新视频', value: FILTER_ENUM.NEW },
                  { label: '点赞最多', value: FILTER_ENUM.LIKES },
                  { label: '收藏最多', value: FILTER_ENUM.FAVORITES },
                  { label: '播放最多', value: FILTER_ENUM.PLAYTIMES },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={7}>
            <Form.Item label="文件名" name="filename">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={getClassificationAllVideo}>
                  查询
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Table
            className={css`
              .ant-table-cell {
                white-space: nowrap;
              }
            `}
            // rowSelection={{
            //   selectedRowKeys,
            //   ...rowSelection,
            // }}
            columns={[
              {
                title: '视频ID',
                dataIndex: 'id',
                align: 'center',
                width: 100,
              },
              {
                title: '主播分类',
                dataIndex: 'classification',
                align: 'center',
                width: 150,
              },
              {
                title: '视频标题',
                dataIndex: 'title',
                align: 'center',
                width: 150,
              },

              {
                title: '文件名',
                dataIndex: 'filename',
                align: 'center',
                width: 300,
              },
              {
                title: '是否可见',
                dataIndex: 'status',
                align: 'center',
                width: 100,
                render: (data) => (data === 0 ? '可见' : '不可见'),
              },

              {
                title: '播放数',
                dataIndex: 'playTimes',
                align: 'center',
                width: 100,
              },
              {
                title: '点赞数',
                dataIndex: 'likes',
                align: 'center',
                width: 100,
              },
              {
                title: '收藏数',
                dataIndex: 'favorites',
                align: 'center',
                width: 100,
              },
              {
                title: '时长',
                dataIndex: 'duration',
                align: 'center',
                width: 100,
                render: formatDuration,
              },
              {
                title: '大小',
                dataIndex: 'size',
                align: 'center',
                width: 100,
                render: (data) => (data / 1000000).toFixed(2) + 'M',
              },
              {
                title: '上传时间',
                dataIndex: 'createdAt',
                align: 'center',
                width: 200,
                render: formatDateHMS,
              },
              // {
              //   title: '审核状态',
              //   dataIndex: 'auditStatus',
              //   render: (data) => {
              //     return <div>{data === 'INIT' ? '待审核' : '审核通过'}</div>
              //   },
              // },
            ]}
            rowKey="id"
            dataSource={dataSource}
            size="middle"
            pagination={false}
            scroll={{
              x: 1600,
              y: window.innerHeight - 140,
            }}
          />
          <StyledPagination>
            <CommonPagination
              total={total}
              totalInfo={`共 ${total} 条`}
              currentPage={tableParams.currentPage}
              pageSize={tableParams.pageSize}
              onPageChange={handleTableChange}
            />
          </StyledPagination>
        </>
      )}
    </StyledDiv>
  )
}

export default PageVideosInformation
