import utils from 'jx-util';

import {AwayApp, createAppV2} from './app';
import {AwayPage, createPageV2} from './page';
import {AwayComponent, createComponentV2} from './component';

function mergeFunction () {

}

function mergeData () {

}

function mergeField () {

}

function mergeOptions () {

}

function mergeModule (owner, mixin) {
  utils.object.merge(owner, mixin);
}

function mergePlugins (owner, parent) {
  utils.object.each(parent, function (v, k) {
    if (utils.string.startsWith('$', k)) {
      owner[k] = v;
    }
  });
}

function cacheOptions (options, mixin) {
  if (mixin.__type__) {
    if (options[mixin.__type__]) {
      options[mixin.__type__].push(mixin);
    }
  }

  return options;
}
 
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

export default class Away {
  /**
   * @param {*} name 页面名称
   * @param {*} options 相当于是 局部 mixin 
   *    mixins: []
   *    vms: []
   */
  constructor (name, options) {
    if (!options) {
      options = name;
    } else {
      if (this.$loggerFactory) {
        this.$logger = this.$loggerFactory.getLogger(name);
      }
    }

    /// 小程序Page/App/Component对象创建，会抹平原型链
    // mergePlugins(this, Away); // 这句报错了

    if (this.isApp(options)) {
      mergeModule(this, utils.function.perform(this, createAppV2, options)); // , this.$options['apps']
    } else if (this.isPage(options)) {
      mergeModule(this, utils.function.perform(this, createPageV2, options)); // , this.$options['pages']
    } else if (this.isComponent(options)) {
      mergeModule(this, utils.function.perform(this, createComponentV2, options)); // , this.$options['components']
    } else {
      throw new Error('参数都传错了，你还不是咸鱼？');
    }
  }

  /// FIXME: 将要被移除

  onAppLaunch (options) {
    this.loadrefer(options);
  }

  onAppShow (options) {
    this.loadrefer(options);
  }

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
      Away.$refer = {};
      Away.$refer.chInfo = chInfo;
      Away.$refer.chInfoParams = chInfo_params;
      Away.$refer.path = path;
    }
  }

  isApp (options) {
    return !!options.onLaunch;
  }

  isPage (options) {
    return !!options.onLoad;
  }

  isComponent (options) {
    return !!options.didMount || !!options.didUpdate;
  }

  /**
   * @MUST 直接注入到Away，而非prototype
   */
  static use (service) {
    if (service.installed) {
      return;
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);

    if (typeof service.install === 'function') {
      service.install.apply(service, args);
    } else if (typeof service === 'function') {
      service.apply(null, args);
    }
    service.installed = true;
  }

  static mixin (mixin) {
    let _inst = this.prototype;

    if (!_inst.$options) {
      _inst.$options = Object.create(null);

      /**
       * Away.$options.apps
       * Away.$options.pages
       * Away.$options.components
       */
      ['component', 'page', 'app'].forEach(function(type) {
        _inst.$options[type + 's'] = [];
      });
    }

    // mixin.__type__ = type+'s';

    _inst.$options = cacheOptions(
      _inst.$options, mixin
    );
  }

  static init (appInst) {
    this.$app = appInst;
  }
}