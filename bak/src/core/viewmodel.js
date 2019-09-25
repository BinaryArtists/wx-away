// 如果需要给Page减负，则ViewModel就出现了，要保持的原则是，要么ViewModel做事件处理，要么Page来做，不可插入第三者

/**
 * @desc 视图模型
 * 
 * @param $view  as page or component
 */
var ViewModel = function () {
  // [知识点：担心内存泄漏？完全不需要担心](https://segmentfault.com/q/1010000000192427)
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management#%E6%A0%87%E8%AE%B0-%E6%B8%85%E9%99%A4%E7%AE%97%E6%B3%95
  // 标记-清除算法 [“对象是否不再需要”简化定义为“对象是否可以获得”] 
  // 算法假定设置一个叫做根（root）的对象（在Javascript里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象
  // 结论：两个互相引用的对象从全局对象出发无法获取, 因此，他们将会被垃圾回收器回收。
}

var __clzz = ViewModel
var __inst = ViewModel.prototype

/**
 * @desc 事件解析
 * 
 * @case 系统事件
 *  { target [required] , type [optional] , detail [optional] }
 * @case 用户事件
 *  { type [required] , dataset [optional] , target [forbidden] }
 */
__inst.eventDispatch = function (e, ...arg) {
  var { type, target, detail, dataset } = e
  if (target) {
    // 系统事件
    // 事件群 参见input、scroller等标签有多事件绑定
    if (target.dataset.eventkind && target.dataset.eventkind === 'group') {
      /**
       * 事件群命名规范：
       * eventtype: 指定该事件群名 例如搜索的input searchInput或者search
       * event.js 对应的事件名字 eventtype + 事件名
       * <input data-eventtype="search" onInput="eventDispatch" onConfirm="eventDispatch"/>
       * event.js中 对应事件 type 分别为 searchInput searchConfirm
       */
      e = {
        kind: 'group',
        type: this.dot2camel(target.dataset.eventtype) + this.replaceFirstUpper(type), 
        target,
        detail,
        dataset: target.dataset.eventvalue
      }
    } else {
      e = {
        kind: 'single',
        type: this.dot2camel(target.dataset.eventtype),
        dataset: target.dataset.eventvalue,
        target
      }
    }
    
  } else {
    // 用户事件
    e = {
      kind: 'single',
      type: this.dot2camel(type),
      dataset
    }
  }

  if (arg.length > 0) {
    this.onEvent(e, ...arg)
  } else {
    this.onEvent(e)
  }
}

/**
 * @desc 字符串首字母 大写
 */
__inst.replaceFirstUpper = function (str){     
  str = str.toLowerCase();     
  return str.replace(/\b(\w)|\s(\w)/g, function(m){  
    return m.toUpperCase();  
  });
}

/**
 * @desc 点语法 转换为 驼峰
 */
__inst.dot2camel = function (str) {
  return str.replace(/\.(\w)/g, function ($0, $1){
    return $1.toUpperCase();
  });
}

/**
 * 事件处理
 */
__inst.onEvent = function (e /** 标准化过的e { type: '', dataset: {} } */ ) {
  // 默认分发
  var { type, dataset, kind, target, detail } = e;
  
  console.log('e.type = ', type, ', e = ', e)
  
  if (kind === 'single') {
    this[type](dataset, target)
  } else if(kind === 'group') {
    this[type](target, detail, dataset)
  }
}

/**
 * 
 * @param {*} params 
 * @param {*} callback 
 */
__inst.setData = function (params, callback=null) {
  if (this.$view) {
    this.$view.setData(params, callback)
  }
}

/**
 * @desc 数据初始化，后续setData是直接操作view
 */
__inst.data = function () {
  return {};
}

__inst.config = function () {
  return {};
}

/**
 * @desc 属性
 */
__inst.$props = function (callback, params) {
  if (this.$view) {
    this.$view.props[callback](params);
  }
}

export default ViewModel

/* *
  * data-eventtype 在event.js/page.js中定义的事件方法名
  * data-eventvalue 传入函数的默认第一个参数
  * data-eventkind 事件群区分 单个事件可缺，事件群时为 'group' 
  * data-diyvalue1, data-diyvalue2 自定义传参 可通过第二个参数target来获取 target.dataset.diyvalue1、target.dataset.diyvalue2获取
*/

// Usage

/**  
  * 绑定 View 组件 onTap
  * 
  * <view class="search-submit" 
  *   onTap="eventDispatch" 
  *   data-eventtype="searchSubmit" 
  *   data-eventtype="on.search.submit" // 实际回调函数: onSearchSubmit 
  *   data-eventvalue="{{searchInputVal}}" 
  *   data-eventvalue1="{{searchInputVal}}" 
  *   data-eventvalue2="{{searchInputVal}}" >搜索</view>
  * 
 */

/* 
  * 绑定 input、scroll-view、swiper 等组件[特征：有事件群]
  *
  * <input class="input" 
  *   placeholder=""
  *   data-eventtype="searchSubmit" 
  *   data-eventkind="group" 
  *   onInput="eventDispatch" 
  *   onConfirm="eventDispatch" 
  *   data-value=""/>
  * 
  *  <scroll-view class="scroll-view"
  *   data-eventkind="group"
  *   data-eventtype="listScrollView"
  *   onScrollToLower="eventDispatch"
  *   onScroll="eventDispatch"
  *   onScrollToUpper="eventDispatch">
  *   ...
  *  </scroll-view>
  *   
  *  * 事件群命名规范：*
  * eventtype: 指定该事件群名 例如搜索的input searchInput或者search
  * event.js/page.js 对应的事件名字 eventtype + 事件名
  * 
  * 上例input中对应的事件名为 
  *   onInput: searchSubmitInput, 
  *   onConfirm: searchSubmitConfirm
  * 
  * 上例scroll-view中对应的事件名为 
  *   onScrollToLower: listScrollViewScrollToLower, 
  *   onScroll: listScrollViewScroll, 
  *   onScrollToUpper: listScrollViewScrollToUpper
  * 
  * 
*/