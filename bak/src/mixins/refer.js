export default class ReferMixin {
  constructor (options) {
    this.__type__ = 'app';
  }

  created () {
    this.$refer = {};
  }
  
  onLaunch (options) {
    this.loadrefer(options);
  }

  onShow (options) {
    this.loadrefer(options);
  }

  /**
 * @渠道规范
 * @STRUCTURE https://log.alipay.com/index_v3.htm#/logmeta/channels
 * 埋点指引：一二级渠道的格式为：chInfo=ch_${一级渠道}__chsub_${二级渠道}，渠道参数的格式为chInfo_params=key1__value1,key2__value2收起实例
 * 如一个url格式为https://fengdie.alipay.com?chInfo=ch_qutoutiao__chsub_entertainment&chInfo_params=uid__283244,appversion__2.01 表从趣头条的娱乐频道进入，且该用户的趣头条uid为283244，趣头条app版本为2.01。
 * 
 * @小程序跳转
 * 方式
 * 
 * @LINK https://opensupport.alipay.com/support/knowledge/39203/201602349076?ant_source=zsearch
 *    
 * @KNOW 小程序首次启动时，onLaunch 方法可获取 query、path 属性值。
 *       小程序在后台被用 schema 打开，也可从 onShow 方法中获取 query、path 属性值。
 * 
 * @MUST 不要在 onShow 中进行 redirectTo 或navigateTo 等操作页面栈的行为。
 *       不要在 onLaunch 里调用 getCurrentPages()，因为此时 page 还未生成。
 * 
 * @IN alipays://platformapi/startapp?appId=1999&query=number%3D1&page=x%2Fy%2Fz
 * @OUT query number=1, path x/y/z
 * 
 * @EXAMPLE
 * 
 *   => scheme跳转/my.call('startApp')
 *     https://fengdie.alipay.com?page=pages/resultPage/index&appId=2018051560091226&query=chInfo=ch_qutoutiao__chsub_entertainment&chInfo_params=uid__283244,appversion__2.01
 * 
 *   => 选项解析
 *     onShow/onlaunch options:
 *     {
 *        path: "pages/resultPage/index",
 *        query: {
 *          chInfo: "ch_qutoutiao__chsub_entertainment",
 *          chInfo_params: "uid__283244,appversion__2.01"
 *       }
 *     }
 * 
 *    文档：https://docs.alipay.com/mini/api/yz6gnx
 *    => my.navigateToMiniProgram({ 
 *        appId: '', 
 *        path: 'pages/resultPage/index'
 *        extraData: {
 *          chInfo: 'ch_qutoutiao__chsub_entertainment'
 *        },
 *        success: (res) => {},
 *        fail: (err) => {}
 *      })
 * 
 *    => 选项解析
 *      onShow/onlaunch options:
 *      {
 *        path: 'pages/resultPage/index',
 *        referrerInfo: {
 *          extraData: {
 *            chInfo: 'ch_qutoutiao__chsub_entertainment'
 *          }
 *        }
 *      }
 */
  
loadrefer (options) {
  var { query, path, referrerInfo } = options;
  var chInfo = null, chInfo_params = null;

  /// scheme
  if (query && query.chInfo) { // 解析来源信息
    chInfo = query.chInfo;
    chInfo_params = query.chInfo_params;
  }

  /// navigateToMiniProgram
  else if (referrerInfo && referrerInfo.extraData && referrerInfo.extraData.chInfo) {
    chInfo = referrerInfo.extraData.chInfo;
    chInfo_params = referrerInfo.extraData.chInfo_params;
  }

  if (chInfo) {
    this.$refer.chInfo = chInfo;
    this.$refer.chInfoParams = chInfo_params;
    this.$refer.path = path;
  }
}

}