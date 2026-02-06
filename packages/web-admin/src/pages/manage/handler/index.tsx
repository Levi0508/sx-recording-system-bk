import { Button, Space, message, Form, Input, InputNumber, Select } from 'antd'
import { useState } from 'react'
import { services } from '@af-charizard/sdk-services'
import styled from '@emotion/styled'

import { CommonModal } from '~/components/common-modal'

const { TextArea } = Input
const StyledDiv = styled.div`
  width: 100%;
  padding: 15px;
`
const StyledTitle = styled.h2`
  padding: 10px;
  padding-bottom: 5px;
`

export const PageHandler = () => {
  const [formAddVip] = Form.useForm<any>()
  const [formAddVipForAll] = Form.useForm<any>()
  const [formSNForUser] = Form.useForm<any>()
  const [formSNForUsers] = Form.useForm<any>()
  const [formCreateVipCard] = Form.useForm<any>()
  const [formNoUseVipCard] = Form.useForm<any>()
  const [formBan] = Form.useForm<any>()
  const [formBanIP] = Form.useForm<any>()
  const [formUnbanIP] = Form.useForm<any>()
  const [formDeblocking] = Form.useForm<any>()
  const [formConvertVip] = Form.useForm<any>()

  const [isModalShowAddVip, setIsModalShowAddVip] = useState(false)
  const [isModalShowAddVipForAll, setIsModalShowAddVipForAll] = useState(false)
  const [isModalSNForUser, setIsModalShowSNForUser] = useState(false)
  const [isModalSNForUsers, setIsModalShowSNForUsers] = useState(false)
  const [isModalCreateVipCard, setIsModalCreateVipCard] = useState(false)
  const [isModalNoUseVipCard, setIsModalNoUseVipCard] = useState(false)
  const [isModalBan, setIsModalBan] = useState(false)
  const [isModalBanIP, setIsModalBanIP] = useState(false)
  const [isModalUnbanIP, setIsModalUnbanIP] = useState(false)
  const [isModalDeblocking, setIsModalDeblocking] = useState(false)
  const [isModalConvertVip, setIsModalConvertVip] = useState(false)

  const [isLoading, setIsLoading] = useState(false) // 增加一个加载状态

  /**
   * 单人增加vip
   * @param values
   */
  const addVipHandler = async () => {
    const { email, days, type } = formAddVip.getFieldsValue()
    if (!email || !days) {
      message.warning('有必填项没填写')
      return
    }

    setIsLoading(true)
    const resp = await services.user$addVip$forUser({
      days,
      type: type ?? 'day',
      email,
    })

    if (resp.data.code === 200) {
      message.success('单人增加成功')
      setIsModalShowAddVip(false)
      formAddVip.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }
  /**
   * 封号
   */
  const banHandler = async () => {
    const { email, days } = formBan.getFieldsValue()
    if (!email || !days) {
      message.warning('有必填项没填写')
      return
    }
    setIsLoading(true)
    const resp = await services.user$ban$account({
      days,
      email,
    })

    if (resp.data.code === 200) {
      message.success(`封号 ${days} 天成功`)
      setIsModalBan(false)
      formBan.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }
  /**
   * 解封
   */
  const deblockingHandler = async () => {
    const { email } = formDeblocking.getFieldsValue()
    if (!email) {
      message.warning('有必填项没填写')
      return
    }
    setIsLoading(true)
    const resp = await services.user$deblocking$account({
      email,
    })

    if (resp.data.code === 200) {
      message.success(`解封成功`)
      setIsModalDeblocking(false)
      formDeblocking.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }
  /**
   * 全体会员增加vip
   * @param values
   */
  const addVipForAllHandler = async () => {
    const { days } = formAddVipForAll.getFieldsValue()
    if (!days) {
      message.warning('有必填项没填写')
      return
    }
    setIsLoading(true)

    const resp = await services.user$addVip$forVip({
      days,
    })

    if (resp.data.code === 200) {
      message.success('全体增加成功')
      setIsModalShowAddVipForAll(false)
      formAddVipForAll.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }
  /**
   * 群发系统通知
   * @param values
   */
  const snForUsers = async () => {
    setIsLoading(true)
    const { title, message: message2 } = formSNForUsers.getFieldsValue()
    if (!title || !message2) {
      message.warning('有必填项没填写')
      return
    }
    const resp = await services.notification$createSystemNotification({
      title,
      message: message2,
    })

    if (resp.data.code === 200) {
      message.success('群发成功')
      setIsModalShowSNForUsers(false)
      formSNForUsers.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }
  /**
   * 群发系统通知
   * @param values
   */
  const snForUser = async () => {
    setIsLoading(true)
    const { title, message: message2, email } = formSNForUser.getFieldsValue()
    if (!title || !message2 || !email) {
      message.warning('有必填项没填写')
      return
    }
    const resp = await services.notification$createSystemNotification({
      title,
      message: message2,
      email,
    })

    if (resp.data.code === 200) {
      message.success('单发成功')
      setIsModalShowSNForUser(false)
      formSNForUser.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }

  /**
   * 生成兑换卡
   * @returns
   */
  const createVipCard = async () => {
    setIsLoading(true)
    const { count, cardType } = formCreateVipCard.getFieldsValue()
    if (!count || !cardType) {
      message.warning('有必填项没填写')
      return
    }
    const resp = await services.pay$exchange_card$create({
      count,
      cardType,
    })

    if (resp.data.code === 200) {
      message.success('新增成功')
      setIsModalCreateVipCard(false)
      formCreateVipCard.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }
  /**
   * 未使用卡片
   * @returns
   */
  const noUseVipCard = async () => {
    setIsLoading(true)
    const { cardType } = formNoUseVipCard.getFieldsValue()
    if (!cardType) {
      message.warning('有必填项没填写')
      return
    }
    const resp = await services.pay$exchange_card$no_use_by_type({
      cardType,
    })

    if (resp.data.code === 200) {
      const dataArray = JSON.parse(JSON.stringify(resp.data.resource))
        .data.split(',')
        .flatMap((group: any) => group.split(' '))
      let alertMessage = ''
      for (let i = 0; i < dataArray.length; i += 2) {
        alertMessage += `${dataArray[i]} ${dataArray[i + 1] || ''}\n`
      }
      // 创建一个textarea并显示内容
      const textarea = document.createElement('textarea')
      textarea.value = alertMessage
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy') // 复制内容
      document.body.removeChild(textarea) // 移除textarea

      alert('内容已复制到剪贴板！')
      // alert(JSON.parse(JSON.stringify(resp.data.resource)))
      setIsModalNoUseVipCard(false)
      formNoUseVipCard.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }

  /**
   * 封IP
   */
  const banIPHandler = async () => {
    const { ip } = formBanIP.getFieldsValue()
    if (!ip) {
      message.warning('IP地址不能为空')
      return
    }
    setIsLoading(true)
    const resp = await services.user$ban$ip({
      ip,
    })

    if (resp.data.code === 200) {
      message.success(`封禁IP成功`)
      setIsModalBanIP(false)
      formBanIP.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }

  /**
   * 解封IP
   */
  const unbanIPHandler = async () => {
    const { ip } = formUnbanIP.getFieldsValue()
    if (!ip) {
      message.warning('IP地址不能为空')
      return
    }
    setIsLoading(true)
    const resp = await services.user$unban$ip({
      ip,
    })

    if (resp.data.code === 200) {
      message.success(`解封IP成功`)
      setIsModalUnbanIP(false)
      formUnbanIP.resetFields()
      setIsLoading(false)
    } else {
      message.error(resp.data.message)
      setIsLoading(false)
    }
  }

  /**
   * 处理折算：将VIP有效期转换为平台币
   */
  const convertVipHandler = async () => {
    const { email } = formConvertVip.getFieldsValue()
    if (!email) {
      message.warning('邮箱不能为空')
      return
    }
    setIsLoading(true)
    try {
      const resp = await services.user$convert$vip({
        email,
      })

      if (resp.data.code === 200) {
        const { days, platformCoins, moneyAdded } = resp.data.resource
        message.success(
          `折算成功！有效天数：${days}天，平台币：${platformCoins}枚，余额增加：${moneyAdded / 10}元`,
        )
        // setIsModalConvertVip(false)
        formConvertVip.resetFields()
        setIsLoading(false)
      } else {
        message.error(resp.data.message)
        setIsLoading(false)
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '处理失败')
      setIsLoading(false)
    }
  }

  return (
    <StyledDiv>
      <StyledTitle>会员相关</StyledTitle>
      <Space>
        <Button htmlType="button" onClick={() => setIsModalShowAddVip(true)}>
          单人增加vip时长
        </Button>
        <Button
          htmlType="button"
          onClick={() => setIsModalShowAddVipForAll(true)}
        >
          全体会员增加vip天数
        </Button>
        <Button htmlType="button" onClick={() => setIsModalBan(true)}>
          封号
        </Button>
        <Button htmlType="button" onClick={() => setIsModalDeblocking(true)}>
          解封
        </Button>
        <Button htmlType="button" onClick={() => setIsModalBanIP(true)}>
          封IP
        </Button>
        <Button htmlType="button" onClick={() => setIsModalUnbanIP(true)}>
          解封IP
        </Button>
      </Space>
      <StyledTitle>系统通知相关</StyledTitle>
      <Space>
        <Button htmlType="button" onClick={() => setIsModalShowSNForUser(true)}>
          单发系统通知
        </Button>
        <Button
          htmlType="button"
          onClick={() => setIsModalShowSNForUsers(true)}
        >
          群发系统通知
        </Button>
      </Space>
      <StyledTitle>会员卡相关</StyledTitle>
      <Space>
        <Button htmlType="button" onClick={() => setIsModalCreateVipCard(true)}>
          生成新兑换卡
        </Button>
        <Button htmlType="button" onClick={() => setIsModalNoUseVipCard(true)}>
          获取未兑换的兑换卡
        </Button>
      </Space>
      <StyledTitle>处理折算</StyledTitle>
      <Space>
        <Button htmlType="button" onClick={() => setIsModalConvertVip(true)}>
          处理折算
        </Button>
      </Space>

      <CommonModal
        isModalShow={isModalShowAddVip}
        setIsModalShow={setIsModalShowAddVip}
        oKHandler={addVipHandler}
        title={'单人会员增加时长'}
        childrenPart={
          <Form form={formAddVip} name="edit_drawer1_form2" autoComplete="off">
            <Form.Item label="邮箱" name="email" required>
              <Input placeholder="请输入" allowClear />
            </Form.Item>

            <Form.Item label="数量" name="days" required>
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="天/小时" name="type" required>
              <Select
                allowClear
                placeholder="请选择"
                options={[
                  { label: '天', value: 'day' },
                  { label: '小时', value: 'hour' },
                ]}
                defaultValue={'day'}
              />
            </Form.Item>
          </Form>
        }
      ></CommonModal>
      <CommonModal
        isModalShow={isModalShowAddVipForAll}
        setIsModalShow={setIsModalShowAddVipForAll}
        oKHandler={addVipForAllHandler}
        title={'全体会员增加天数'}
        childrenPart={
          <Form
            form={formAddVipForAll}
            name="edit_drawer1_form2"
            autoComplete="off"
          >
            <Form.Item label="天数" name="days">
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="小时数" name="hours">
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        }
      ></CommonModal>
      <CommonModal
        isModalShow={isModalSNForUser}
        setIsModalShow={setIsModalShowSNForUser}
        oKHandler={snForUser}
        title={'单发系统邮件'}
        childrenPart={
          <Form
            form={formSNForUser}
            name="edit_drawer1_form2"
            autoComplete="off"
          >
            <Form.Item label="收件邮箱" name="email" required>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="邮件标题" name="title" required>
              <Input placeholder="请输入" allowClear />
            </Form.Item>

            <Form.Item label="邮件内容" name="message" required>
              <TextArea rows={6} placeholder="请输入" />
            </Form.Item>
          </Form>
        }
        width={550}
        isLoading={isLoading}
      ></CommonModal>
      <CommonModal
        isModalShow={isModalSNForUsers}
        setIsModalShow={setIsModalShowSNForUsers}
        oKHandler={snForUsers}
        title={'群发系统邮件'}
        childrenPart={
          <Form
            form={formSNForUsers}
            name="edit_drawer1_form2"
            autoComplete="off"
          >
            <Form.Item label="邮件标题" name="title" required>
              <Input placeholder="请输入" allowClear />
            </Form.Item>

            <Form.Item label="邮件内容" name="message" required>
              <TextArea rows={6} placeholder="请输入" />
            </Form.Item>
          </Form>
        }
        width={550}
        isLoading={isLoading}
      ></CommonModal>
      <CommonModal
        isModalShow={isModalCreateVipCard}
        setIsModalShow={setIsModalCreateVipCard}
        oKHandler={createVipCard}
        title={'生成新兑换卡'}
        childrenPart={
          <Form
            form={formCreateVipCard}
            name="edit_drawer1_form2"
            autoComplete="off"
          >
            <Form.Item label="生成数量" name="count" required>
              <Select
                allowClear
                placeholder="请选择"
                options={[
                  { label: '100', value: 100 },
                  { label: '200', value: 200 },
                ]}
              />
            </Form.Item>

            <Form.Item label="卡片类型" name="cardType" required>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择"
                options={[
                  { label: '10', value: 10 },
                  { label: '30', value: 30 },
                  { label: '50', value: 50 },
                  { label: '68', value: 68 },
                  { label: '80', value: 80 },
                  { label: '100', value: 100 },
                  { label: '200', value: 200 },
                  { label: '500', value: 500 },
                ]}
              />
            </Form.Item>
          </Form>
        }
        width={550}
        isLoading={isLoading}
      ></CommonModal>
      <CommonModal
        isModalShow={isModalNoUseVipCard}
        setIsModalShow={setIsModalNoUseVipCard}
        oKHandler={noUseVipCard}
        title={'获取未兑换的兑换卡'}
        childrenPart={
          <Form
            form={formNoUseVipCard}
            name="edit_drawer1_form2"
            autoComplete="off"
          >
            <Form.Item label="卡片类型" name="cardType" required>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择"
                options={[
                  { label: '10', value: 10 },
                  { label: '30', value: 30 },
                  { label: '50', value: 50 },
                  { label: '68', value: 68 },
                  { label: '80', value: 80 },
                  { label: '100', value: 100 },
                  { label: '200', value: 200 },
                  { label: '500', value: 500 },
                ]}
              />
            </Form.Item>
          </Form>
        }
        width={550}
        isLoading={isLoading}
      ></CommonModal>

      <CommonModal
        isModalShow={isModalBan}
        setIsModalShow={setIsModalBan}
        oKHandler={banHandler}
        title={'封号'}
        childrenPart={
          <Form form={formBan} name="edit_drawer1_form2" autoComplete="off">
            <Form.Item label="邮箱" name="email" required>
              <Input placeholder="请输入" allowClear />
            </Form.Item>

            <Form.Item label="天数" name="days" required>
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        }
      ></CommonModal>
      <CommonModal
        isModalShow={isModalDeblocking}
        setIsModalShow={setIsModalDeblocking}
        oKHandler={deblockingHandler}
        title={'解封'}
        childrenPart={
          <Form
            form={formDeblocking}
            name="edit_drawer1_form2"
            autoComplete="off"
          >
            <Form.Item label="邮箱" name="email" required>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Form>
        }
      ></CommonModal>
      <CommonModal
        isModalShow={isModalBanIP}
        setIsModalShow={setIsModalBanIP}
        oKHandler={banIPHandler}
        title={'封IP'}
        childrenPart={
          <Form form={formBanIP} name="edit_drawer1_form2" autoComplete="off">
            <Form.Item label="IP地址" name="ip" required>
              <Input placeholder="请输入要封禁的IP地址" allowClear />
            </Form.Item>
          </Form>
        }
      ></CommonModal>
      <CommonModal
        isModalShow={isModalUnbanIP}
        setIsModalShow={setIsModalUnbanIP}
        oKHandler={unbanIPHandler}
        title={'解封IP'}
        childrenPart={
          <Form form={formUnbanIP} name="edit_drawer1_form2" autoComplete="off">
            <Form.Item label="IP地址" name="ip" required>
              <Input placeholder="请输入要解封的IP地址" allowClear />
            </Form.Item>
          </Form>
        }
      ></CommonModal>
      <CommonModal
        isModalShow={isModalConvertVip}
        setIsModalShow={setIsModalConvertVip}
        oKHandler={convertVipHandler}
        title={'处理折算'}
        childrenPart={
          <Form
            form={formConvertVip}
            name="edit_drawer1_form2"
            autoComplete="off"
          >
            <Form.Item label="邮箱" name="email" required>
              <Input placeholder="请输入用户邮箱" allowClear />
            </Form.Item>
          </Form>
        }
        width={550}
        isLoading={isLoading}
      ></CommonModal>
    </StyledDiv>
  )
}

export default PageHandler
