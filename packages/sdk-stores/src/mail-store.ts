import { makeAutoObservable } from 'mobx'

export interface IIINotificationList {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  title: string
  videoId: number
  message: string
  isRead: number
  type: any
  classification: any
  sendByUser: {
    id: number
    nickname: string
    avatar: string
  }
}

export class MailStore {
  public unreadMail: IIINotificationList[] = []
  public readMail: IIINotificationList[] = []
  public typeMail: IIINotificationList[] = []
  // public videoMail: IIINotificationList[] = [];
  // public userMail: IIINotificationList[] = [];
  public totalCount: number = 0
  public readTotalCount: number = 0
  public typeTotalCount: number = 0
  // public videoTotalCount: number = 0;
  // public userTotalCount: number = 0;

  constructor() {
    makeAutoObservable(this)
  }

  public setUnreadMail(data: IIINotificationList[]) {
    this.unreadMail = data
  }
  public setReadMail(data: IIINotificationList[]) {
    this.readMail = data
  }
  public setTypeMail(data: IIINotificationList[]) {
    this.typeMail = data
  }
  // public setVideoMail(data: IIINotificationList[]) {
  //   this.videoMail = data;
  // }
  // public setUserMail(data: IIINotificationList[]) {
  //   this.userMail = data;
  // }

  public setTotalCount(data: number) {
    this.totalCount = data
  }
  public setReadTotalCount(data: number) {
    this.readTotalCount = data
  }
  public setTypeTotalCount(data: number) {
    this.typeTotalCount = data
  }
  public setEmpty() {
    this.setUnreadMail([])
    this.setReadMail([])
    this.setTypeMail([])
    this.setTotalCount(0)
    this.setReadTotalCount(0)
    this.setTypeTotalCount(0)
  }

  // public setVideoTotalCount(data: number) {
  //   this.videoTotalCount = data;
  // }
  // public setUserTotalCount(data: number) {
  //   this.userTotalCount = data;
  // }
}
