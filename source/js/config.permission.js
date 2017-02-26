/**
 * @module wjswap.config
 * @description
 * config:<br>
 * 登录与未登录页面跳转规则
 */

(function () {
  'use strict';

  angular.module('wjswap.config')
    /**
     * @constant $noLoginState
     * @type {Array}
     * @description
     * 未登录时可去的状态
     */
    .constant('$noLoginState', [
      'app.register'
    ])
    /**
     * @constant $notToAfterLogin
     * @type {Array}
     * @description
     * 登录时不可去的状态
     */
    .constant('$notToAfterLogin', [
      'app.register',
    ])
    /**
     * @constant $processing
     * @type {Array}
     * @description
     * 下面是各个流程中其中一个步奏，登录前如果前面记录的是$processing中的页面则登录后跳转到个人资料页
     */
    .constant('$processing', [])
    /**
     * @constant $notShowLoading
     * @type {Array}
     * @description
     * 当为下面几个状态的时候不要出来loadding状态
     */
    .constant('$notShowLoading', [
    ])
    /**
     * 未登录但不跳到登录页面
     */
    .constant('$allowLogin', [])
    .constant('$noHeaderPages', [])
    /**
     * 不能往后滑的页面
     */
    .constant('$noBackState', [])
}());
