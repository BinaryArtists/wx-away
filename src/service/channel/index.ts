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

  public build (info: ChannelInfo): string {
    this.info = info;

    return `ch=${info.ch}&sub=${info.sub}&uid=${info.uid}`;
  }

  public parse (strOrObj: any): ChannelInfo {
    let ch = null, sub = null, uid = null, info;

    if (this.isURL(strOrObj)) {
      info = {};
    }

    if (this.isQuery(strOrObj)) {
      info = {};
    }

    if (this.isObj(strOrObj)) {
      info = strOrObj;
    }

    ch = info.ch;
    sub = info.sub;
    uid = info.uid;

    this.info = info;

    return this.info;
  }

  public isValid (): boolean {
    return !!this.info && !!this.info.ch && !!this.info.sub && !!this.info.uid;
  }
}

export const channel = new ChannelService();