// https://docs.alipay.com/mini/framework/app-detail

import utils from 'jx-util';

/**
 * @brief 应用生成器
 */
function createApp ( AppConstructor, params ) {
  /// this === Away
  var Away = this;

  var { 
    config, 
    globalData, 
    onLaunch,
    onShow,
    onHide,
    onError,
    onRefer,
    ...rest } = params
  var _ = {
    globalData: globalData || {},
    ...rest
  }

  _.onLaunch = function (options) {
    // 应用对象加载
    Away.onAppLaunch(options);

    // Callback
    onLaunch && utils.function.perform(this, onLaunch, options);
  }

  _.onShow = function (options) {
    // 应用对象切前台
    Away.onAppShow(options);

    // Callback
    onShow && utils.function.perform(this, onShow, options);
  }

  _.onHide = function () {

    // Callback
    onHide && utils.function.perform(this, onHide);
  }

  _.onError = function (error) {

    // Callback
    onError && utils.function.perform(this, onError, error);
  }

  // 应用对象创建
  Away.onAppCreate(_);

  return AppConstructor(_)
}

export default createApp

