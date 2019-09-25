import cache from '../cache';

/**
 * 异步获取系统信息
 */
export function getSystemInfo(): Promise<any> {
  const cacheValue = cache.get('away.systemInfo');
  if (cacheValue) {
    return Promise.resolve(cacheValue);
  }

  {
  }
  return new Promise((resolve, reject) => {
    my.getSystemInfo({
      success: (systemInfo) => {
        cache.set('away.systemInfo', systemInfo);
        resolve(systemInfo);
      },
      fail: () => {
        reject(new Error('异步获取系统信息失败'));
      },
    });
  });
}

/**
 * 同步获取系统信息
 */
export function getSystemInfoSync(): any {
  const cacheValue = cache.get('away.systemInfo');
  if (cacheValue) {
    return cacheValue;
  }

  const systemInfo = my.getSystemInfoSync();
  if (systemInfo) {
    cache.set('away.systemInfo', systemInfo);
  }

  return systemInfo;
}

/**
 * 获取RPC网关地址
 */
export function getRPCUrl(): Promise<string> {
  const cacheValue = cache.get('away.rpcUrl');
  if (cacheValue) {
    return Promise.resolve(cacheValue);
  }

  return new Promise(resolve => {
    my.call('getConfig', {
      configKeys: [
        'rpcUrl', // 无线网关的地址，常用来判断服务的环境（stable, SIT，pre，online）
        // 'did', // 网关生成的一个设备号，业务上很少用到
        // 'uuid' // 钱包计算当前用户的userId得到的md5值
      ],
    }, result => {
      const { rpcUrl } = result.data;
      cache.set('away.rpcUrl', rpcUrl);
      resolve(result);
    });
  });
}

/**
 * 获取所在环境
 */
export function getCurrentEnv(): Promise<string> {
  const cacheValue = cache.get('away.currentEnv');
  if (cacheValue) {
    return Promise.resolve(cacheValue);
  }

  return getRPCUrl().then(rpcUrl => {
    let env;

    if (/mobilegw\.alipay\.com/.test(rpcUrl)) {
      env = 'prod';
    } else if (/mobilegwpre\.alipay\.com/.test(rpcUrl)) {
      env = 'pre';
    } else if (/mobilegw\.(aaa|dev\d+)\.alipay.net/.test(rpcUrl) || /mobilegw\.stable\.alipay\.net/.test(rpcUrl) || /mobilegw-\d+\.test\.alipay\.net/.test(rpcUrl)) {
      env = 'daily';
    } else {
      env = 'prod';
    }

    cache.set('away.currentEnv', env);
    return env;
  });
}

