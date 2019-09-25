import utils from 'jx-util';
import { getPageRouteByStackIndex } from './utils';

export function createPageV2 ( ViewModelConstructorOrS, params ) {
	var awayInst = this; /// this === awayInst

  if (!params) {
    params = ViewModelConstructorOrS;

    ViewModelConstructorOrS = undefined;
  }

	var { config, data, onLoad, onUnload, onShow, actions, ...paramRest } = params;
	var _ = {
		// 代理对象
		$proxy: {},

		...paramRest
  };
  
  _.$proxy.config = config || {};
  _.$proxy.onLoad = onLoad || function(){};
  _.$proxy.onUnload = onUnload || function(){};
  _.$proxy.onShow = onShow || function(){};
  _.$proxy.actions = actions || {};

	// 【新增】页面刷新函数
	_.update = function (newData) {
		this.setData(newData);
	};

	// 页面视图模型
	_.data = data || {};

	_.onLoad = function (query) {
    // FIXME: 不应该这样做，应该做merge
    this.__proto__.__proto__ = awayInst.__proto__;
    
    // 视图模型
    if (ViewModelConstructorOrS) {
      this.$viewmodel = new ViewModelConstructorOrS();

      this.$viewmodel.$view = this // Inject $component to $viewmodel
    }

    this.$path = getPageRouteByStackIndex();
    this.$lastpath = getPageRouteByStackIndex(-1);

    if (this.$proxy.onLoad) {
      utils.function.perform(this, this.$proxy.onLoad, query)
    }
	};

	_.onShow = function () {
		// PV 埋点
		this.$tracer && this.$tracer.log({ type: 'pv' });

    if (this.$proxy.onShow) {
      utils.function.perform(this, this.$proxy.onShow);
    }
	};

	_.onUnload = function () {
    if (this.$proxy.onUnload) {
      utils.function.perform(this, this.$proxy.onUnload);
    }
	}

  if (actions) {
    utils.object.each(actions, (val, key) => {
      var startWither = utils.string.startsWith;

      if (startWither('on', key)) {
        if (typeof Proxy !== 'undefined') {
          // 支持Proxy才能统一对点击事件埋点
          // 代理
          var handler = {
            apply: (target, thisArg, argumentsList) => {
              thisArg.$tracer && thisArg.$tracer.log( { type: 'ck', uid: key });

              return target.apply(thisArg, argumentsList);
            },
          };
          _[key] = new Proxy(val, handler);
        } else {
          // 无法使用Proxy
          _[key] = val;
        }
      } else {
        _[key] = val;
      }
    });
  }

  // 事件处理
  _.eventDispatch = _.onDispatch = function (e) {
    this.$viewmodel.eventDispatch(e);
    
    if (e.target.dataset && e.target.dataset.eventtype) {
      this.$tracer && this.$tracer.log({ type: 'ck', uid: e.target.dataset.eventtype });
    }
  }
	
  if (_.$proxy.config.expos) { // 配置区域曝光埋点
		utils.array.each(_.$proxy.config.expos, function (val, idx) {
			_[val] = function () {
        this.$tracer && this.$tracer.log({ type: 'expo', uid: val });
			}
		});
	}

	return _;
}

/**
 * V3
 * 
 * @document https://docs.alipay.com/mini/framework/page-detail
 */
export class AwayPage {
  constructor (origin, mixins) {
    this.origin = origin;
    this.mixins = mixins;

    this.events = {
      onBack () {

      },
      onKeyboardHeight (e) {

      },
      onOptionMenuClick (e) {

      },
      onPopMenuClick (e) {

      },
      onPullIntercept () {

      },
      onPullDownRefresh (e) {

      },
      onTitleClick () {

      },
      onTabItemTap (e) {

      },
      beforeTabItemTap () {

      },
      onResize (e) {

      }
    };
  }

  // 事件处理函数对象
  // events: {
  //   onBack() {
  //     console.log('onBack');
  //   },
  // },

  onLoad () {
    
  }

  onShow () {
    // 页面显示
  }

  onReady () {
    // 页面加载完成
  }

  onHide () {
    // 页面隐藏
  }

  onUnload () {
    // 页面被关闭
  }

  onShareAppMessage () {
    // 返回自定义分享信息
  }

  onTitleClick () {
    // 标题被点击
  }

  onOptionMenuClick () {

  }

  onPopMenuClick () {

  }

  onPullDownRefresh () {
    // 页面被下拉
  }

  onPullIntercept () {

  }

  onTabItemTap ({from, pagePath, text, index}) {

  }

  onPageScroll ({scrollTop}) {

  }

  onReachBottom () {
    // 页面被拉到底部
  }

  
}