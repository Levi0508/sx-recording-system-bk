import { IPolicyStatement, PolicyStatement } from './policy-statement'

export interface IPolicyDocument {
  statement: IPolicyStatement[]
}

export class PolicyDocument implements IPolicyDocument {
  statement: PolicyStatement[]

  private get __allowStatement() {
    return this.statement.filter(({ effect }) => effect === 'Allow')
  }

  private get __denyStatement() {
    return this.statement.filter(({ effect }) => effect === 'Deny')
  }

  constructor(documentStr: string) {
    const document = JSON.parse(documentStr) as IPolicyDocument
    const statement = document.statement || []
    this.statement = statement
      .map((item) => new PolicyStatement(item))
      // 过滤掉没有 action 的 statement
      .filter(({ action }) => action.length)
  }

  /**
   * 策略规则匹配，如果匹配成功，则返回true
   * @param action
   * @returns
   */
  can(action: string): boolean {
    console.log('PolicyDocument->can', action)
    const allowResult = this.__allowStatement.some((statement) => statement.matchAction(action))

    const denyResult = this.__denyStatement.some((statement) => statement.matchAction(action))
    console.log('PolicyDocument->can->allowResult', allowResult)
    console.log('PolicyDocument->can->denyResult', denyResult)
    // 如果 正向授权 有匹配结果，且 反向授权 没有匹配结果，则允许。（空数组some返回false）
    // 必须有正向授权，且不能有反向授权。不允许 没有正向授权，也没有反向授权的情况。
    return allowResult && !denyResult
  }

  /**
   * 合并策略
   * @param document
   * @returns
   */
  merge(document: PolicyDocument) {
    this.statement = this.statement.concat(document.statement)
    return this
  }

  /**
   * 合并多个策略
   * @param documents
   * @returns
   */
  static merge(documents: PolicyDocument[]) {
    const empty: IPolicyDocument = { statement: [] }
    const document = new PolicyDocument(JSON.stringify(empty))
    documents.forEach((_) => document.merge(_))
    return document
  }
}
