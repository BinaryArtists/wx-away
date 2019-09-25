interface CacheItem {
  value: any;
  expireAt?: number;
}

/**
 * 缓存类
 */
class Cache {
  store = new Map();

  /**
   * 获取缓存
   * cacheKey: 缓存名称
   */
  get(cacheKey: string, defaultValue: any = null): any {
    // 读取缓存
    const cacheValue = this.store.get(cacheKey);
    if (cacheValue === undefined) {
      return defaultValue;
    }

    // 检查有效期
    if (cacheValue.expireAt && cacheValue.expireAt < Date.now()) {
      // 过期销毁
      this.store.delete(cacheKey);
      return defaultValue;
    }

    return cacheValue.value;
  }

  /**
   * 设置缓存
   * cacheKey: 缓存名称
   * cacheValue: 缓存值
   * expireTime: 可选参数，缓存有效毫秒数
   */
  set(cacheKey: string, cacheValue: any, expireTime?: number): boolean {
    const cacheItem: CacheItem = {
      value: cacheValue,
    };

    if (expireTime && expireTime > 0) {
      cacheItem.expireAt = Date.now() + expireTime;
    }

    this.store.set(cacheKey, cacheItem);
    return true;
  }

  /**
   * 删除缓存
   * cacheKey: 缓存名称
   */
  delete(cacheKey: string): boolean {
    this.store.delete(cacheKey);
    return true;
  }

  /**
   * 清空缓存
   */
  clear() {
    this.store.clear();
  }
}

const cache = new Cache();
export default cache;
