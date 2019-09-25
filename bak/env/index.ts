import * as global from '../global';

const env = {
  /**
   * 检查是否是IOS设备，异步
   */
  checkIOS: function (): Promise<Boolean> {
    return global.getSystemInfo().then(systemInfo => {
      return systemInfo.platform === 'iOS';
    });
  },

  /**
   * 检查是否是Android设备，异步
   */
  checkAndroid: function(): Promise<Boolean> {
    return global.getSystemInfo().then(systemInfo => {
      return systemInfo.platform === 'Android';
    });
  },

  /**
   * 检查是否是支付宝环境，异步
   */
  checkAlipay: function(): Promise<Boolean> {
    return global.getSystemInfo().then(systemInfo => {
      return systemInfo.app === 'alipay';
    });
  },

  /**
   * 检查是否是手淘环境，异步
   */
  checkTaobao: function(): Promise<Boolean> {
    return global.getSystemInfo().then(systemInfo => {
      return systemInfo.app === 'TB';
    });
  },

  /**
   * 检查是否是IDE环境
   */
  get isIDE(): Boolean {
    return my.isIDE ? true : false;
  },

  /**
   * 检查是否是真机
   */
  get isOnDevice(): Boolean {
    return my.isIDE ? false : true;
  },
};

export default env;

