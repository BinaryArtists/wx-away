export class GlobalPlugin {
  constructor (options) {
    this.data = {...options};
  }

  get (k) {
    return this.data[k];
  }

  set (k, v) {
    this.data[k] = v;
  }

  static install (S, options) {
    S.$global = new GlobalPlugin(options);
    if (S.prototype) {
      S.prototype.$global = new GlobalPlugin(options);
    }
  }
}