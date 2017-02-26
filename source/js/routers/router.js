(function() {
  'use strict';
  angular.module('wjswap')

  // 基础及公共路由
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // 设置网站不缓存视图
    $ionicConfigProvider.views.maxCache(0);
    // 去掉ios本身的右滑动返回，controllers > app.js改为onGesture
    $ionicConfigProvider.views.swipeBackEnabled(false);
    // 初始化从服务器下载templates数量，默认为30个
    $ionicConfigProvider.templates.maxPrefetch(0);
    //Tab position. Android defaults to top and iOS defaults to bottom.
    $ionicConfigProvider.tabs.position('bottom'); 
    //Tab style. Android defaults to striped and iOS defaults to standard.
    $ionicConfigProvider.tabs.style('standard');

    var options = {
      url: "",
      abstract: true,
      controller: 'AppCtrl'
    };
    $stateProvider
      .state('app', {
        url: "",
        abstract: true,
        controller: 'AppCtrl',
        templateUrl: "templates/common/menu.html"
      })
      // tabs页
      .state('app.tabs', {
        abstract: true,
        views: {
          menuContent: {
            controller: 'TabsCtrl',
            templateUrl: "templates/common/tabs.html"
          }
        }
      });

    // 默认路由
    $urlRouterProvider.otherwise('/register');
  })

  .run(function($rootScope, $state, $userPermission, $util, $noHeaderPages, $ionicHistory, $noBackState) {
    $rootScope.toState = '';
    $rootScope.fromState = '';

    $rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) {
      $rootScope.toState = to.name;
      $rootScope.fromState = from.name;
      $rootScope.params = angular.extend($rootScope.params || {}, $state.params || {});
      $rootScope.referer = document.referrer;

      $rootScope.isNoHeaderPages = false;
      if($util.inArray($rootScope.toState, $noHeaderPages)){
        $rootScope.isNoHeaderPages = true;
      }
      // 将全局form中的值更新在localStorage里面
      $util.refreshFormToLocal();
    });
    
    $rootScope.$on("$locationChangeSuccess", function() {
      // var dataId='whiteBoard',
      //     dataIdEle='[data-id="'+dataId+'"]';

      // $('body').append('<div data-id="'+dataId+'" style="position: fixed; width: 100%; height: 100%; background: #fff;z-index: 2147483647;"/>');
      // $userPermission.isNeedLogin($rootScope.toState, $rootScope.fromState,function(){
      //   $(dataIdEle).length && $(dataIdEle).remove();
      // });
    });
  });
}());