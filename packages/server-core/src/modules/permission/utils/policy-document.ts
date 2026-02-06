import { winstonService } from 'src/utils/winston-logger';
import { IPolicyStatement, PolicyStatement } from './policy-statement';

/*
PolicyDocument 类的设计主要用于处理权限策略文档，
基于 "允许" 和 "拒绝" 规则来决定特定操作（action）是否可以执行。
*/
export interface IPolicyDocument {
  statement: IPolicyStatement[];
}

export class PolicyDocument implements IPolicyDocument {
  statement: PolicyStatement[];

  private get __allowStatement() {
    return this.statement.filter(({ effect }) => effect === 'Allow');
  }

  private get __denyStatement() {
    return this.statement.filter(({ effect }) => effect === 'Deny');
  }

  constructor(documentStr: string) {
    const document = JSON.parse(documentStr) as IPolicyDocument;
    const statement = document.statement || [];
    this.statement = statement
      .map((item) => new PolicyStatement(item))
      // 过滤掉没有 action 的 statement
      .filter(({ action }) => action.length);
  }

  /**
   * 策略规则匹配，如果匹配成功，则返回true
   * 逻辑：
   *    通过 __allowStatement.some 查找是否存在匹配 action 的允许策略。
   *    通过 __denyStatement.some 查找是否存在匹配 action 的拒绝策略。
   *决策逻辑：如果允许策略匹配成功，并且没有拒绝策略匹配，则允许操作，返回 true；否则返回 false。
   *  通过这个方法，可以快速确定一个操作是否被允许。
   *  其逻辑是基于"允许优先，拒绝覆盖"的原则：必须有明确的允许，且不能有拒绝，才能允许操作。
   * @param action
   * @returns
   */
  can(action: string): boolean {
    winstonService.info('PolicyDocument->can', action);
    const allowResult = this.__allowStatement.some((statement) =>
      statement.matchAction(action),
    );

    const denyResult = this.__denyStatement.some((statement) =>
      statement.matchAction(action),
    );
    winstonService.info('PolicyDocument->can->allowResult', allowResult);
    winstonService.info('PolicyDocument->can->denyResult', denyResult);
    // 如果 正向授权 有匹配结果，且 反向授权 没有匹配结果，则允许。（空数组some返回false）
    // 必须有正向授权，且不能有反向授权。不允许 没有正向授权，也没有反向授权的情况。
    return allowResult && !denyResult;
  }

  /**
   * 合并策略，在一个用户或角色可能拥有多个策略文档的情况下，
   * 能够将这些策略合并为一个整体，以便进行综合权限判断。
   * @param document
   * @returns
   */
  merge(document: PolicyDocument) {
    this.statement = this.statement.concat(document.statement);
    return this;
  }

  /**
   * 合并多个策略
   * @param documents
   * @returns
   */
  static merge(documents: PolicyDocument[]) {
    // PolicyStatement
    const empty: IPolicyDocument = { statement: [] };
    const document = new PolicyDocument(JSON.stringify(empty));
    documents.forEach((_) => document.merge(_));
    return document;
  }
}
