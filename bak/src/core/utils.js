import utils from 'jx-util';

export function performMixinFunctionsOnContext (mixins, ctx, fnName, options) {
  for (let idx in mixins) {
    let mixin = mixins[idx];

    if (utils.object.has(mixin, fnName)) {
      utils.function.perform(ctx, mixin[fnName], options);
    }
  }
}

export function performFunctionOnContext (ctx, fnName, options) {
  if (utils.object.has(ctx, fnName)) {
    utils.function.perform(ctx, ctx[fnName], options);
  }
}

export function getPageRouteByStackIndex (stackIndex=0) {
  if (!utils.is.number(stackIndex)) return null;

  var depth = stackIndex-1;
  var pages = getCurrentPages();

  if (pages.length < utils.number.negate(depth)) return null;

  var currentPage = pages[pages.length + depth];
  return currentPage.route;
}