/**
 * 渠道管理
 * 
 * 1. 构建参数
 *  ch_qutoutiao__chsub_entertainment&chInfo_params=uid__283244
 * 
 * 2. 解析参数
 */

export interface ChannelInfo {
  ch: string | null;
  sub: string | null;
  uid: string | null;
  extra?: object;
}


export class ChannelService {
  info: ChannelInfo;

  constructor () {

  }

  private isURL (str: string): boolean {
    return false;
  }

  private isQuery (query: string) {
    return false;
  }

  private isObj (obj: string) {
    return true;
  }

  public build (params: ChannelInfo): string {
    return `ch=${params.ch}&sub=${params.sub}&uid=${params.uid}`;
  }

  public parse (strOrObj: any): ChannelInfo {
    let ch = null, sub = null, uid = null, params;

    if (this.isURL(strOrObj)) {
      params = {};
    }

    if (this.isQuery(strOrObj)) {
      params = {};
    }

    if (this.isObj(strOrObj)) {
      params = strOrObj;
    }

    ch = params.ch;
    sub = params.sub;
    uid = params.uid;

    return <ChannelInfo>{ ch: ch, sub: sub, uid: uid };
  }
}


export const channel = new ChannelService();