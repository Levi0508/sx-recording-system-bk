import {
  CustomerServiceOutlined,
  DashboardOutlined,
  FireFilled,
  FireOutlined,
  HistoryOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  MoneyCollectOutlined,
  ProductOutlined,
  SketchOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Badge, Button, Dropdown, MenuProps, message } from 'antd'

import { defineFunctionComponent } from '@kazura/react-toolkit'
import { useNavigate } from 'react-router'
import { useStore } from '@kazura/react-mobx'
import { MailStore, UserStore } from '@af-charizard/sdk-stores'
import { services } from '@af-charizard/sdk-services'
import React from 'react'
import styled from '@emotion/styled'

export const StyledItems = styled.div`
  height: 30px;
  line-height: 30px;
`
interface IProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const MobileButtonsLeft: React.FC<IProps> = defineFunctionComponent(
  ({ setOpen }) => {
    const navigate = useNavigate()
    const userStore = useStore(UserStore)

    const mailStore = useStore(MailStore)

    /**
     * 登出
     */
    const logoutHandler = async (type?: string) => {
      localStorage.removeItem('__PASSPORT')

      await services.user$logout()
      const resp2 = await services.passport$create({})

      userStore.setPassport(resp2.data.resource.passport)
      userStore.setUser(resp2.data.resource.user)
      userStore.setStatements(resp2.data.resource.statements)

      localStorage.setItem('__PASSPORT', resp2.data.resource.passport.token)
      message.success('退出成功')

      if (type) {
        navigate('/reset/password')
      } else {
        navigate('/')
      }
    }

    //mobile菜单栏
    const mobileSyetem: MenuProps['items'] = [
      {
        key: 'home',
        label: (
          <StyledItems>
            <Button
              icon={<HomeOutlined />}
              type="text"
              style={{ color: '#718dac' }}
              onClick={() => navigate('/')}
            >
              前往首页
            </Button>
          </StyledItems>
        ),
      },

      // {
      //   key: 'classification',
      //   label: (
      //     <StyledItems>
      //       <Button
      //         icon={<ProductOutlined />}
      //         type="text"
      //         style={{ color: '#718dac' }}
      //         onClick={() => navigate('/classification')}
      //       >
      //         所有分类
      //       </Button>
      //     </StyledItems>
      //   ),
      // },
      {
        key: 'shop',
        label: (
          <StyledItems>
            <Button
              icon={<SketchOutlined />}
              type="text"
              style={{ color: '#FB7299' }}
              // onClick={() => navigate('/vip/shop')}
              onClick={() => navigate('/web/shop')}
            >
              会员商城
            </Button>
          </StyledItems>
        ),
      },

      ...(userStore.user
        ? [
            // {
            //   key: 'manage',
            //   label: (
            //     <StyledItems >
            //       <Button
            //         icon={<DesktopOutlined />}
            //         type="text"
            //         style={{ color: '#718dac' }}
            //         onClick={() => window.open('/#/dashboard', '_blank')}
            //       >
            //         后台
            //       </Button>
            //     </StyledItems>
            //   ),
            // },
            {
              key: 'vip',
              label: (
                <StyledItems>
                  <Button
                    icon={<UserOutlined />}
                    type="text"
                    style={{ color: '#718dac' }}
                    onClick={() => navigate('/vip/center')}
                  >
                    会员中心
                  </Button>
                </StyledItems>
              ),
            },
            // {
            //   key: 'sign-in',
            //   label: (
            //     <StyledItems>
            //       <Button
            //         icon={<FireFilled style={{ color: 'red' }} />}
            //         type="text"
            //         style={{ color: '#718dac' }}
            //         onClick={() => navigate('/web/sign-in')}
            //       >
            //         签到系统
            //       </Button>
            //     </StyledItems>
            //   ),
            // },
            // {
            //   key: 'history',
            //   label: (
            //     <StyledItems>
            //       <Button
            //         icon={<HistoryOutlined />}
            //         type="text"
            //         style={{ color: '#718dac' }}
            //         onClick={() => navigate('/vip/history')}
            //       >
            //         历史记录
            //       </Button>
            //     </StyledItems>
            //   ),
            // },
            // {
            //   key: 'favorite',
            //   label: (
            //     <StyledItems>
            //       <Button
            //         icon={<StarOutlined />}
            //         type="text"
            //         style={{ color: '#718dac' }}
            //         onClick={() => navigate('/vip/favorite')}
            //       >
            //         收藏列表
            //       </Button>
            //     </StyledItems>
            //   ),
            // },
            {
              key: 'mail',
              label: (
                <StyledItems>
                  <Button
                    icon={
                      <Badge
                        count={mailStore.totalCount}
                        offset={[-20, 0]}
                        overflowCount={99}
                        size="small"
                      >
                        <MailOutlined style={{ color: '#718dac' }} />
                      </Badge>
                    }
                    type="text"
                    style={{ color: '#718dac' }}
                    onClick={() => navigate('/mail/message')}
                  >
                    消息通知
                  </Button>
                </StyledItems>
              ),
            },
            {
              key: 'invitation',
              label: (
                <StyledItems>
                  <Button
                    icon={<MoneyCollectOutlined />}
                    type="text"
                    style={{ color: '#718dac' }}
                    onClick={() => navigate('/profit/invitation')}
                  >
                    推广联盟
                  </Button>
                </StyledItems>
              ),
            },
            {
              key: 'service',
              label: (
                <StyledItems>
                  <Button
                    icon={<CustomerServiceOutlined />}
                    type="text"
                    style={{ color: '#718dac' }}
                    onClick={() => navigate('/vip/service')}
                  >
                    联系客服
                  </Button>
                </StyledItems>
              ),
            },
            {
              key: 'reset-password',
              label: (
                <StyledItems>
                  <Button
                    icon={<LockOutlined />}
                    type="text"
                    style={{ color: '#718dac' }}
                    onClick={() => {
                      logoutHandler('reset')
                    }}
                  >
                    修改密码
                  </Button>
                </StyledItems>
              ),
            },
            ...(userStore.hasAccess('user:read:all')
              ? [
                  {
                    key: 'manage',
                    label: (
                      <StyledItems>
                        <Button
                          icon={<DashboardOutlined />}
                          type="text"
                          style={{ color: '#718dac' }}
                          onClick={() => {
                            userStore.hasAccess('user:read:all')
                              ? navigate('/dashboard')
                              : navigate('/')
                          }}
                        >
                          后台管理
                        </Button>
                      </StyledItems>
                    ),
                  },
                ]
              : []),
            {
              key: 'exit',
              label: (
                <StyledItems>
                  <Button
                    icon={<LogoutOutlined />}
                    type="text"
                    danger
                    onClick={() => logoutHandler()}
                  >
                    退出
                  </Button>
                </StyledItems>
              ),
            },
          ]
        : [
            {
              key: 'service',
              label: (
                <StyledItems>
                  <Button
                    icon={<CustomerServiceOutlined />}
                    type="text"
                    style={{ color: '#718dac' }}
                    onClick={() => navigate('/vip/service')}
                  >
                    需要客服
                  </Button>
                </StyledItems>
              ),
            },
            {
              key: 'login',
              label: (
                <StyledItems>
                  <Button
                    icon={<LogoutOutlined />}
                    type="text"
                    style={{ color: 'green' }}
                    onClick={() => navigate('/login')}
                  >
                    登录/注册
                  </Button>
                </StyledItems>
              ),
            },
          ]),
    ]

    return (
      <Dropdown
        menu={{ items: mobileSyetem }}
        placement="bottom"
        trigger={['click']}
      >
        <Button
          icon={<MenuOutlined />}
          // onClick={() => setOpen(true)}
          type="text"
        ></Button>
        {/* <MenuOutlined style={{ margin: 10 }} /> */}
      </Dropdown>
    )
  },
)
