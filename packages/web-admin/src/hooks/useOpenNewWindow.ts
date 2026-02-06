import { useCallback } from 'react'
import { useStore } from '@kazura/react-mobx'
import { UserStore, MailStore } from '@af-charizard/sdk-stores'
import { useNavigate } from 'react-router'

export const useOpenNewWindow = () => {
  const userStore = useStore(UserStore)
  const mailStore = useStore(MailStore)

  const navigate = useNavigate()

  return useCallback(
    (item: any) => {
      if (userStore.user) {
        const url = `#/video-detail/${item.id}?classification=${encodeURIComponent(item.classification)}`
        const newWindow = window.open(url, 'newWindow')

        if (newWindow) {
          const mobxData = {
            userStore: {
              user: userStore.user,
              passport: userStore.passport,
              statements: userStore.statements,
            },
            mailStore: {
              unreadMail: mailStore.unreadMail,
              readMail: mailStore.readMail,
              typeMail: mailStore.typeMail,
              totalCount: mailStore.totalCount,
              readTotalCount: mailStore.readTotalCount,
              typeTotalCount: mailStore.typeTotalCount,
            },
          }
          newWindow.sessionStorage.setItem('mobxData', JSON.stringify(mobxData))
        }
      } else {
        navigate(`/video-detail/${item.id}`, {
          state: { video: item },
        })
      }
    },
    [userStore, mailStore],
  )
}
