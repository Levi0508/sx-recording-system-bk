import { Navigate, RouteObject } from 'react-router-dom'

import LayoutDashboard from '~/pages/manage/dashboard/_layout'
import LayoutPreview from '~/pages/home-preview/_layout'
import PageDashboard from '~/pages/manage/dashboard'
import PageHomePreview from '~/pages/home-preview'
import PageDetail from '~/pages/video-detail'
import PageLogin from '~/pages/login'
import PageRegister from '~/pages/register'
import PageResetPassword from '~/pages/reset-password'
import LayoutPermissions from '~/pages/permissions/_layout'

import PageClassificationPreview from '~/pages/classification-preview'
import PageVipPreview from '~/pages/vip-preview'
import PageMailPreview from '~/pages/mail'
import PageInvitationPreview from '~/pages/invitation'
import PageSearchPreview from '~/pages/search-preview'

import { HistoryPart } from '~/pages/vip-preview/components/history'
import { FavoritePart } from '~/pages/vip-preview/components/favorite'
import { VipCenter } from '~/pages/vip-preview/components/vip-center'
import { Invitation } from '~/pages/invitation/components/invitation'
import { Record } from '~/pages/invitation/components/record'
import { PageClassificationDetail } from '~/pages/classification-detail'
import { ServicePart } from '~/pages/vip-preview/components/service'
import PageVideosInformation from '~/pages/manage/videos/information'
import PageUsersInformation from '~/pages/manage/users/information'
import PageMoneyInformation from '~/pages/manage/money/information'
import PageHandler from '~/pages/manage/handler'
import PageExchangeQuery from '~/pages/manage/exchange-query/information'
import PageWebShop from '~/pages/vip-preview/components/web-shop'
import PageDailyData from '~/pages/manage/daily-data/information'
import PageWebSignIn from '~/pages/vip-preview/components/web-sign-in'
import PageSignIn from '~/pages/sign-in'
import PageMonthDetail from '~/pages/month-detail'
import PageAnchorDetail from '~/pages/anchor-detail'

const routes: RouteObject[] = [
  {
    path: '*',
    element: undefined,
    children: [
      // LayoutPreview
      {
        path: '*',
        element: <LayoutPreview />,
        children: [
          {
            path: '',
            element: <PageHomePreview />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'daily-data/*',
        element: <LayoutDashboard />,
        children: [
          {
            path: '',
            element: <PageDailyData />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'dashboard/*',
        element: <LayoutDashboard />,
        children: [
          {
            path: '',
            element: <PageDashboard />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'handler/*',
        element: <LayoutDashboard />,
        children: [
          {
            path: '',
            element: <PageHandler />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'login/*',
        element: undefined,
        children: [
          {
            path: '',
            element: <PageLogin />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'register/*',
        element: undefined,
        children: [
          {
            path: '',
            element: <PageRegister />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'reset/*',
        element: undefined,
        children: [
          {
            path: 'password',
            element: <PageResetPassword />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'videos/*',
        element: <LayoutPermissions />,
        children: [
          {
            path: 'information/*',
            element: undefined,
            children: [
              {
                path: '',
                element: <PageVideosInformation />,
                children: [],
              },
              {
                path: '*',
                element: <Navigate to="" replace />,
                children: [],
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to="policies" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'money/*',
        element: <LayoutPermissions />,
        children: [
          {
            path: 'information/*',
            element: undefined,
            children: [
              {
                path: '',
                element: <PageMoneyInformation />,
                children: [],
              },
              {
                path: '*',
                element: <Navigate to="" replace />,
                children: [],
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to="policies" replace />,
            children: [],
          },
        ],
      },

      {
        path: 'users/*',
        element: <LayoutPermissions />,
        children: [
          {
            path: 'information/*',
            element: undefined,
            children: [
              {
                path: '',
                element: <PageUsersInformation />,
                children: [],
              },
              {
                path: '*',
                element: <Navigate to="" replace />,
                children: [],
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to="policies" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'exchange-query/*',
        element: <LayoutDashboard />,
        children: [
          {
            path: '',
            element: <PageExchangeQuery />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      // {
      //   path: 'video-detail/*',
      //   element: <LayoutPreview />,

      //   children: [
      //     {
      //       path: ':id',
      //       element: <PageDetail />, // 显示DetailPage组件
      //     },
      //     {
      //       path: '*',
      //       element: <Navigate to="" replace />,
      //     },
      //   ],
      // },

      // {
      //   path: 'classification-detail/*',
      //   element: <LayoutPreview />,

      //   children: [
      //     {
      //       path: ':type',
      //       element: <PageClassificationDetail />,
      //     },
      //     {
      //       path: '',
      //       element: <PageClassificationDetail />,
      //     },
      //     {
      //       path: '*',
      //       element: <Navigate to="" replace />,
      //     },
      //   ],
      // },

      // {
      //   path: 'classification/*',
      //   element: <LayoutPreview />,

      //   children: [
      //     {
      //       path: '',
      //       element: <PageClassificationPreview />,
      //       children: [],
      //     },
      //     {
      //       path: '*',
      //       element: <Navigate to="" replace />,
      //       children: [],
      //     },
      //   ],
      // },
      // {
      //   path: 'search/*',
      //   element: <LayoutPreview />,

      //   children: [
      //     {
      //       path: 'title',
      //       element: <PageSearchPreview />,
      //       children: [],
      //     },
      //     {
      //       path: '*',
      //       element: <Navigate to="" replace />,
      //       children: [],
      //     },
      //   ],
      // },
      {
        path: 'vip/*',
        element: <LayoutPreview />,

        children: [
          {
            path: 'buy',
            element: <PageVipPreview />,
          },
          // {
          //   path: 'history',
          //   element: <HistoryPart />,
          // },
          // {
          //   path: 'favorite',
          //   element: <FavoritePart />,
          // },
          {
            path: 'center',
            element: <VipCenter />,
          },

          // {
          //   path: 'shop',
          //   element: <ShopCenter />,
          // },
          {
            path: 'invitation',
            element: <Invitation />,
          },
          {
            path: 'record',
            element: <Record />,
          },
          {
            path: 'service',
            element: <ServicePart />,
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
          },
        ],
      },
      {
        path: 'mail/*',
        element: <LayoutPreview />,

        children: [
          {
            path: 'message',
            element: <PageMailPreview />,
          },

          {
            path: '*',
            element: <Navigate to="" replace />,
          },
        ],
      },
      {
        path: 'web/*',
        element: <LayoutPreview />,

        children: [
          {
            path: 'shop',
            element: <PageWebShop />,
          },
          {
            path: 'sign-in',
            element: <PageWebSignIn />,
          },

          {
            path: '*',
            element: <Navigate to="" replace />,
          },
        ],
      },
      {
        path: 'profit/*',
        element: <LayoutPreview />,

        children: [
          {
            path: 'invitation',
            element: <PageInvitationPreview />,
          },

          {
            path: '*',
            element: <Navigate to="" replace />,
          },
        ],
      },
      {
        path: 'sign-in/*',
        children: [
          {
            path: '',
            element: <PageSignIn />,
            children: [],
          },
          {
            path: '*',
            element: <Navigate to="" replace />,
            children: [],
          },
        ],
      },
      {
        path: 'month/:goodsId',
        element: <LayoutPreview />,
        children: [
          {
            path: '',
            element: <PageMonthDetail />,
            children: [],
          },
        ],
      },
      {
        path: 'anchor/:goodsId',
        element: <LayoutPreview />,
        children: [
          {
            path: '',
            element: <PageAnchorDetail />,
            children: [],
          },
        ],
      },
    ],
  },
]

export default routes
