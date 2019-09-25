import utils from 'jx-util';

// 文档：https://docs.alipay.com/mini/framework/component

/**
 * @knowledge 如果component作为列表表项，那么component构建函数只会调用一次
 * 
 * @param ComponentConstructor 原生组件构建函数
 * @param ViewModelConstructor 如果params为空，则默认用该坑位补上
 * @param params 构建组件的参数
 */
function createComponent ( ComponentConstructor, ViewModelConstructor, params ) {
  /// this === Away
  var Away = this;

  // 兼容ViewModelConstructor不传的情况，params则取ViewModelConstructor坑位的参数
  if (!params) {
    params = ViewModelConstructor;

    ViewModelConstructor = undefined;
  }

  var { config, props, methods, viewmodel, didMount, ...paramRest } = params;
  var _ = {
    config: config || {},
    methods: methods || {},
    props: props || {},
    ...paramRest
  };

  _.didMount = function () {
    // 视图模型
    if (ViewModelConstructor) {
      this.$viewmodel = new ViewModelConstructor();

      this.$viewmodel.$view = this; // Inject $component to $viewmodel

      console.log('[Component] didMount, $viewmodel = ', this.$viewmodel)
    }
    
    // FIXME: component曝光埋点
    if (this.props.onFirstAppear) {
      this.props.onFirstAppear()
    }

    // 运行时注入
		this.$app = getApp()
		this.$global = getApp().globalData

    if (didMount) {
      utils.function.perform(this, didMount)
    }
  }
  
  if (config && config.expos) { // 配置区域曝光埋点
    utils.array.each(config.expos, function (val, idx) {
      _[val] = function () {
        Away.$tracer.log({ type: 'expo', uid: val });
      }
    })
  }

  if (methods) {
    utils.object.each(methods, (val, key) => {
      var startWither = utils.string.startWith

      if (startWither(key, 'on')) {
        if (typeof Proxy !== 'undefined') {
          // 支持Proxy才能统一对点击事件埋点
          var handler = {
            apply: (target, thisArg, argumentsList) => {
              Away.$tracer.log({ type: 'ck', uid: key });

              return target.apply(thisArg, argumentsList)
            },
          };
          _[key] = new Proxy(val, handler)
        } else {
          // 无法使用Proxy
          _[key] = val
        }
      } else {
        _[key] = val
      }
    })

    // 事件处理
    if (methods) {
      _.methods.eventDispatch = function (e) {
        // console.log('[Component] eventDispatch, e = ', e);

        this.$viewmodel.eventDispatch(e);

        var pages = getCurrentPages()
        var page = pages[pages.length - 1] // 

        if (e.target.dataset && e.target.dataset.eventtype) {
          Away.$tracer.log({ type: 'ck', uid: e.target.dataset.eventtype });
        }
        

      }
    }
  }

  return ComponentConstructor(_)
}

export default createComponent