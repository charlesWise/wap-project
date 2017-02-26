// Ionic Starter App
(function () {
  'use strict';
  var wjswap = angular.module('wjswap', ['ionic','wjswap.directives', 'wjswap.services', 'wjswap.controllers', 'wjswap.config', 'wjswap.filters', 'wjswap.util'], function($httpProvider,$ionicConfigProvider) {

    // 处理angular的参数对象提交问题
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $httpProvider.defaults.headers.post['CLIENT-PLATFORM'] = '3'; // 3-wap 4-微信 微信是后端根据user-Agent来的

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      for(name in obj) {
        value = obj[name];
        if(typeof value === 'number'){ // 把整数换成字符串
          value = '' + value;
        }

        if(value instanceof Array) {
          for(i=0; i<value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if(value instanceof Object) {
          for(subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if(value !== undefined && value !== null) {
          query += encodeURI(name) + '=' + encodeURI(value) + '&';
        }
      }
      // console.info(query);
      return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

  });

  //use mock
  if(ENV.useMock) {
    Mock.mockjax(wjswap);
    for(var url in MockBlockMap){
      if(MockBlockMap.hasOwnProperty(url)){
        Mock.mock(ENV.blockRule || new RegExp(url), MockBlockMap[url]);
      }
    }
  }

  wjswap.run(function ($ionicPlatform, $rootScope, $timeout, $ui, $ionicHistory, $util, $state, $api, notify, $globalConfig) {

    // 获取当前的代理信息
    var ua = window.navigator.userAgent.toLowerCase();
    var cookie = document.cookie;
    if (cookie.match(/changfuyun/i) == 'changfuyun') { // 主要用于判断当前项目被嵌入到时,可以做隐藏头部等特殊处理
      $rootScope.isAppClient = true;
    }
    if (!!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/)){
      $rootScope.clientType = 'ios';
    }
    if (ua.indexOf('android') > -1 || ua.indexOf('adr') > -1){
      $rootScope.clientType = 'android';
    }

    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      $rootScope.isWechat = true;
    }

    if(ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1){
      $rootScope.systemType = 'android';
    }else if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
      $rootScope.systemType = 'ios';
    }else{
      $rootScope.systemType = 'pc';
    }

    if (cookie.match(/showHead/i) == 'showHead'){
      $rootScope.showHead = true;
    }

    // hide splash immediately
    if(navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
    }

    // 配置弹框
    notify.config({
      duration: 3000,
      verticalSpacing: -52
    });

    // 初始化全局$rootScope
    $util.newFormData([
       'rootUserInfo' // 存放个人信息
      ,'rootLoginInfo' // 登录信息
    ]);

  });

  // 声名相应的模块
  angular.module('wjswap.controllers', ['wjswap.config', 'wjswap.services', 'wjswap.component', 'wjswap.util']);
  angular.module('wjswap.config', []);
}());
