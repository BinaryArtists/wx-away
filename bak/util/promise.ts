export interface Deferred {
  promise?: Promise<any>;
  resolve?: (any) => void;
  reject?: (any) => void;
}

/**
 * 获取一个延迟执行的Promise对象
 */
export function defer(): Deferred {
  const deferred: Deferred = {};
  const promise: Promise<any> = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  deferred.promise = promise;
  return deferred;
}

