import { IPolicyDocument, PolicyDocument, PolicyStatement } from '@af-charizard/sdk-utils'
import { makeAutoObservable } from 'mobx'

export class UserStore {
  public user: any = null
  public passport: any = null
  public statements: any[] = []
  public purchasedMonthGoods: Record<string, string> = {} // goodsId -> url 的映射
  public purchasedAnchorGoods: Record<string, string> = {} // goodsId -> url 的映射（主播合集）
  // 主播合集：是否已购买后续更新包（用于列表页展示“已包更新”）
  public purchasedAnchorUpdatePackages: Record<string, boolean> = {} // goodsId -> hasUpdatePackage

  constructor() {
    makeAutoObservable(this)
  }

  public setUser(user: any) {
    this.user = user
  }

  public setPassport(passport: any) {
    this.passport = passport
  }

  public setStatements(statements: any[]) {
    this.statements = statements
  }

  public setPurchasedMonthGoods(purchasedMonthGoods: Record<string, string>) {
    this.purchasedMonthGoods = purchasedMonthGoods
  }

  public setPurchasedAnchorGoods(purchasedAnchorGoods: Record<string, string>) {
    this.purchasedAnchorGoods = purchasedAnchorGoods
  }

  public setPurchasedAnchorUpdatePackages(
    purchasedAnchorUpdatePackages: Record<string, boolean>,
  ) {
    this.purchasedAnchorUpdatePackages = purchasedAnchorUpdatePackages
  }

  public clear() {
    this.user = null
    this.passport = null
    this.statements = []
    this.purchasedMonthGoods = {}
    this.purchasedAnchorGoods = {}
    this.purchasedAnchorUpdatePackages = {}
  }

  public get isLogin() {
    return this.user !== null
  }

  public get isLogout() {
    return this.user === null
  }

  public hasAccess(action: string) {
    if (this.user === null) return false
    if (!this.statements.length) return false
    const empty: IPolicyDocument = { statement: [] }
    const document = new PolicyDocument(JSON.stringify(empty))
    document.statement = this.statements.map((_) => new PolicyStatement(_))
    return document.can(action)
  }
}
