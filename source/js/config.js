/**
 * @module wjswap.config
 * @description
 * config:<br>
 * 应用的基本配置
 */

(function(){
  "use strict";
  angular.module('wjswap.config')
    /**
     * @constant $ionicLoadingConfig
     * @type {Object}
     * @description
     * Loading 条的基本配置
     */
    .constant('$ionicLoadingConfig', {
      //延迟出现的时间(ms)
      delay: 0,
      //模板
      template: '<i class="icon ion-loading-c"></i>\n<br/>\nLoading...',
      //是否显示遮罩
      noBackdrop: false
    })
    .constant("$protocolIds", {
      register: 1 //注册协议
    })
    .constant("$globalConfig", {
      notifyDuration: 3000
    })
}());
