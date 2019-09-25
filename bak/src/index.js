
import createApp from './createapp';
import createPage from './createpage';
import createComponent from './createcomponent';
import BaseViewModel from './core/viewmodel';

import ReferMixin from './mixins/refer';


import Away from './core';

// 内置混入
Away.mixin(ReferMixin);

// 内置插件
// Away.use();

///
Away.onAppCreate = function (app) {
  this.$app = app;
}

Away.onAppLaunch = function (options) {
  this.loadrefer(options);
}

Away.onAppShow = function (options) {
  this.loadrefer(options);
}

Away.loadrefer = function (options) {
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
    this.$refer = {};
    this.$refer.chInfo = chInfo;
    this.$refer.chInfoParams = chInfo_params;
    this.$refer.path = path;
  }
}

Away.createApp = Away.app = createApp
Away.createPage = Away.page = createPage
Away.createComponent = Away.component = createComponent
Away.ViewModel = BaseViewModel

export default Away