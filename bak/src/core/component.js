import utils from 'jx-util';

export function createComponentV2 ( ViewModelConstructor, params ) {
  /// this === Away's inst
  var awayInst = this;

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
    // FIXME: 不应该这样做，应该做merge
    this.__proto__.__proto__ = awayInst.__proto__;

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

    if (didMount) {
      utils.function.perform(this, didMount)
    }
  }
  
  if (config && config.expos) { // 配置区域曝光埋点
    utils.array.each(config.expos, function (val, idx) {
      _[val] = function () {
        this.$tracer && this.$tracer.log({ type: 'expo', uid: val });
      }
    })
  }

  if (methods) {
    utils.object.each(methods, (val, key) => {
      var startWither = utils.string.startsWith;

      if (startWither('on', key)) {
        if (typeof Proxy !== 'undefined') {
          // 支持Proxy才能统一对点击事件埋点
          var handler = {
            apply: (target, thisArg, argumentsList) => {
              thisArg.$tracer && thisArg.$tracer.log({ type: 'ck', uid: key });

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
        this.$viewmodel.eventDispatch(e);

        var pages = getCurrentPages()
        var page = pages[pages.length - 1] // 

        if (e.target.dataset && e.target.dataset.eventtype) {
          this.$tracer && this.$tracer.log({ type: 'ck', uid: e.target.dataset.eventtype });
        }
      }
    }
  }

  return _;
}

/**
 * V3
 * 
 * @document https://docs.alipay.com/mini/framework/component-lifecycle, https://docs.alipay.com/mini/framework/component-mixins
 */
export default class AwayComponent {
  constructor (origin, mixins) {
    this.origin = origin;
    this.mixins = mixins;
  }

  onLoad () {
    
  }
}