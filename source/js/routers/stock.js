/**
 * 用户模块路由
 * @return {[type]} [description]
 */
(function() {
  'use strict';

  angular.module('wjswap')
  .config(function($stateProvider, $urlRouterProvider) {

      //Provider方法
      function stateProvider(state, address, viewName, group){
        // 就否存在控制器
        var noCtrl = address.charAt(0) === '?', // 是否有控制器
            ctrl = false, templateUrl, options, menuContent;

        if(noCtrl) { // 有?就去掉
          address = address.replace(/^\?/, '');
        } else { // 没的话就设置控制器
          ctrl = state.replace(/^[a-z]/, function(match) {return match.toUpperCase()}) + 'Ctrl';
        }

        options = { // state基础配置
          url: address,
          views: {}
        };
        menuContent = options.views[viewName||'menuContent'] = {};
        menuContent.controller = ctrl;

        var templateName = state.replace(/[A-Z]/g, function(match) {return '-' + match.toLowerCase()});
        if(ENV.env == 'prd') {  // 组装地址 eg: account/login.html
          menuContent.templateProvider = function($templateCache) {
            return $templateCache.get(tplSrc.replace(/(^[^\/]*\/)|(\/$)/g, '') + '/' + templateName + '.html');
          }
        } else { // 组装模板路径 eg: templates/account/login.html
          menuContent.templateUrl = tplSrc + templateName + '.html';
        }

        // 添加状态
        group = group ? group + '.' + state : state;
        $stateProvider.state('app.' + group, options);
      }

      var tplSrc = 'templates/stock/', // 基础模板
        // [url, ionNavView, appName] 不用控制器则url开头加'?' eg: '?/login'
        routMap = {
          stockList: '/stockList'
        }, item, viewName, group;

      for(var state in routMap){
        item = routMap[state];
        if(angular.isArray(item)) {
          viewName = item[1];
          group = item[2];
          item = item[0]
        } else {
          viewName = group = '';
        }
        stateProvider(state, item, viewName, group);
      }
  });
}());
