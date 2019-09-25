import utils from 'jx-util';

/**
 * @IN
 * 0: current,
 * -1: last
 * 
 * @OUT
 * null: current page is root
 * '': valid route
 */
const getPageRouteByStackIndex = function (stackIndex=0) {
  if (!utils.is.number(stackIndex)) return null;

  var depth = stackIndex-1;
  var pages = getCurrentPages();

  if (pages.length < utils.number.negate(depth)) return null;

  var currentPage = pages[pages.length + depth];
  return currentPage.route;
}

/**
 * @desc 页面构造器
 * 
 * @param {*} ViewModelConstructorOrS 
 * @param {*} params 
 * 
 * @property $app 应用对象，等价于 getApp()
 * @property $global 应用对象的全局变量，等价于 getApp().global
 * @property $path 页面路径，例如 'pages/index/index'
 * @property $viewmodel 视图模型
 * @property $proxy 页面的代理对象，保存页面原有函数
 * 
 * @todo: 检查页面引用循环
 */
function createPage ( ViewModelConstructorOrS, params ) {
	var Away = this; /// this === Away

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
		Away.$tracer && Away.$tracer.log({ type: 'pv' });

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
      var startWither = utils.string.startWith;

      if (startWither(key, 'on')) {
        if (typeof Proxy !== 'undefined') {
          // 支持Proxy才能统一对点击事件埋点
          // 代理
          var handler = {
            apply: (target, thisArg, argumentsList) => {
              Away.$tracer && Away.$tracer.log( { type: 'ck', uid: key });

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
      Away.$tracer && Away.$tracer.log({ type: 'ck', uid: e.target.dataset.eventtype });
    }
  }
	
	if (_.$proxy.config.expos) { // 配置区域曝光埋点
		utils.array.each(_.$proxy.config.expos, function (val, idx) {
			_[val] = function () {
        Away.$tracer && Away.$tracer.log({ type: 'expo', uid: val });
			}
		});
	}

	return Page(_);
}

export default createPage;