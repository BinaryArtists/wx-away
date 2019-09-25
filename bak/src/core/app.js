import utils from 'jx-util';
import { performMixinFunctionsOnContext, performFunctionOnContext } from './utils';

export function createAppV2 ( params ) {
  var self = this;

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
    self.onAppLaunch(options);

    // Callback
    onLaunch && utils.function.perform(this, onLaunch, options);
  }

  _.onShow = function (options) {
    // 应用对象切前台
    self.onAppShow(options);

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

  return _;
}


/**
 * V3
 * 
 * @document https://docs.alipay.com/mini/framework/app-detail
 */
export class AwayApp {

  constructor (origin, mixins) {
    this.origin = origin;
    this.mixins = mixins;
  }

  onLaunch (options) {
    performMixinFunctionsOnContext(this.mixins, this.origin, 'onLaunch', options);
    
    performFunctionOnContext(this.origin, 'onLaunch', options);
  }

  onShow (options) {
    performMixinFunctionsOnContext(this.mixins, this.origin, 'onShow', options);
    
    performFunctionOnContext(this.origin, 'onShow', options);
  }

  onHide () {
    performMixinFunctionsOnContext(this.mixins, this.origin, 'onLaunch');
    
    performFunctionOnContext(this.origin, 'onLaunch');
  }

  onError (error) {
    performMixinFunctionsOnContext(this.mixins, this.origin, 'onLaunch', error);
    
    performFunctionOnContext(this.origin, 'onLaunch', error);
  }

  onShareAppMessage () {
    return utils.function.perform(ctx, ctx['onShareAppMessage']);;
  }
}