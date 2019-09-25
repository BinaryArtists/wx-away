"use strict";
/**
 * 渠道管理
 *
 * 1. 构建参数
 *  ch_qutoutiao__chsub_entertainment&chInfo_params=uid__283244
 *
 * 2. 解析参数
 */
exports.__esModule = true;
var ChannelService = /** @class */ (function () {
    function ChannelService() {
    }
    ChannelService.prototype.isURL = function (str) {
        return false;
    };
    ChannelService.prototype.isQuery = function (query) {
        return false;
    };
    ChannelService.prototype.isObj = function (obj) {
        return true;
    };
    ChannelService.prototype.build = function (params) {
        return "ch=" + params.ch + "&sub=" + params.sub + "&uid=" + params.uid;
    };
    ChannelService.prototype.parse = function (strOrObj) {
        var ch = null, sub = null, uid = null, params;
        if (this.isURL(strOrObj)) {
            params = {};
        }
        if (this.isQuery(strOrObj)) {
            params = {};
        }
        if (this.isObj(strOrObj)) {
            params = strOrObj;
        }
        ch = params.ch;
        sub = params.sub;
        uid = params.uid;
        return { ch: ch, sub: sub, uid: uid };
    };
    return ChannelService;
}());
exports.ChannelService = ChannelService;
exports.channel = new ChannelService();
