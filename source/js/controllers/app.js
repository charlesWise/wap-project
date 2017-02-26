(function(){
  'use strict';

  angular.module('wjswap.controllers')

  .controller('AppCtrl', function($rootScope, $scope, $util, $api, $publicApi, $state, $userInfo, $localStorage, $rootTransfer, $ui, $ionicHistory, $stateParams, $applicationCache, $noLoginState) {
    /************************** 全局对象声明 ******************************/
      // 事件委托
      ionic.onGesture('swiperight', function() {
        var backView = $ionicHistory.backView(),
            isLogin = !$util.isEmpty($userInfo.getUser());

        // 没有返回的view；登录状态下，但返回的视图为 app.login；当前也未login
        if(!backView || isLogin && backView.stateName === 'app.login' || $ionicHistory.currentStateName() === 'app.login') {
          return false;
        }
        $ionicHistory.goBack();
      }, document);

      // 初始化applicationCache
      // 添加(有/没更新)相对应函数
      // $applicationCache.init();

      // 侧栏刷新功能
      // $rootScope.clearAppCache = $applicationCache.update;

    /***************************** 表单 *********************************/
      // 验证表单中该填的是否已填
      $scope.validForm = $util.validForm;

      // 验证表单 如果通过 退回上一个页面
      $scope.confirmForm = function(selector){
        $scope.validForm(selector) && $util.goBack();
      };

    /**************************** 退出登录 *****************************/
      $scope.logout = function(){
        $api.logout({isLogout: 1}, function(data){
          $util.removeCookie('usc_token');
          // 退出时清掉$rootScope
          $util.clearFormData([
             'rootUserInfo'
            ,'userinfo'// 存放个人信息
            ,'rootLoginInfo' // 登录信息
          ]);
          $rootScope.resetData();
          $state.go('app.login');
        });
      };

      // data如果存在说明要更新userinfo数据
      // isReset为true时重新获取数据 false则不用
      // 如果什么也不传则只清空数据
      $rootScope.resetData = function(data, isReset) {
        if(typeof data === 'boolean') {
          isReset = data;
          data = null
        } else if(data) {
          isReset = true;
        }

        // 先清空所有数据
        // 清空表单数据
        $util.clearCache();
        // 清空$rootScope.rootTransferParams
        $rootTransfer.clear();
        // 清空menu.html用到的数据, 解决退出后侧栏显示不正常的问题
        $userInfo.clear();

        // 获取数据
        if(isReset) {
          $userInfo.getUser(data);
        }
      };

      // 刷新后/首页访问检测登录状态
      // $api.isLogin(function(data) {
      //   if(data.boolen) {
      //     // 已经登录
      //     // 这里要强制拉取下数据，防止多个tab页打开时
      //     // 一个登录状态A，另一个非登录状态B
      //     // B无法进入登录状态
      //     $userInfo.getUser(true);
      //   } else {
      //     // 未登录时把登录相关清空数据，防止登录时间久了，自动过期
      //     $userInfo.clear();
      //     if($noLoginState.indexOf($rootScope.toState) === -1) {
      //       if($rootScope.clientType){
      //         if($rootScope.clientType == 'android'){
      //           //安卓登录
      //           window['mainweb']['goLuckDraw']();

      //         }else if($rootScope.clientType == 'ios'){
      //           window.location.href = $iosApi.goLuckDraw;

      //         }
      //       }else{
      //         $ui.tip('请登录');
      //         $state.go('app.login');
      //         return false;
      //       }
      //     }
      //   }
      // });

    /************************** 上传图片设置 **************************/
      // 上传组件所需参数对象
      $rootScope.getUploadParams = function(file){
        return {
          url: $publicApi['uploadImg'],
          data: {username: '', file: file},
        }
      };

      $rootScope.refreshAuthCode = function(type){
        var time = (new Date()).getTime();
        var codeBaseAddress = $publicApi['verify'] + '?key=' + type;
        angular.element(document.querySelector('.verify-img')).attr('src', codeBaseAddress + '&t=' + time);
      };

      var params = $state.params;
      if(params && params['hmsr']){ // 有hmsr来源
        $util.setCookie('hmsr', params['hmsr']);
      }
  })
  // tabs页
  .controller('TabsCtrl', function() {
  })
}());
