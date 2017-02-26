/**
 * @module wjswap.directives
 * @requires wjswap.config
 * @description
 * directives 模块功能:<br>
 */

(function(){
  'use strict';

  var backButtonTpl = '<a href="javascript:;" class="backGo padding-right-50"></a>';

  angular.module('wjswap.directives', ['wjswap.config'])

    /**
     * 使ng-transclude属性继承上一级的scope
     **/
    .directive('myTransclude', function() {
        return {
          compile: function(tElement, tAttrs, transclude) {
            return function(scope, iElement, iAttrs) {
              transclude(scope.$new(), function(clone) {
                iElement.append(clone);
              });
            };
          }
        };
      })

    /**
     * 上下拉刷新
     * ajaxName 请求的ajax名字
     * processingData 对取得的ajax数据进行处理
     * initOpts 初始化配置
     * ** isNoAuto: false 初始化不让自动获取数据(默认自动)
     * ** refreshMode: down/all 请求数据的方式(默认向上拉)
     * myEventFn 魔板里用的函数
     * finishFn 完成一次ajax后回调函数, scope会作为参数传过去
     * 模板直接放到my-refresh标签里即可
     * 重新获取数据时，记得 $scope.$broadcast('initMyRefresh', opts) 作一个回调
     **/
    .directive('myRefresh', function($api, $timeout, $ionicScrollDelegate){
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          ajaxName:'@',
          processingData: '=',
          initOpts:'=',
          myEventFn:'=',
          finishFn:'='
        },
        templateUrl: '/templates/common/my-refresh.html',
        replace: true,
        link: function(scope, element, attrs){
          var myEventFn = attrs.myEventFn;
          if(myEventFn) {
            scope[myEventFn] = scope.myEventFn;
          }

          // 初始化默认配置
          var setting = angular.extend({}, {page: 0,rows: 10}, scope.initOpts),
              curOpt = {}, // 以后传给ajax
              processingData = scope.processingData, // ajax获取数据后处理
              isFirst = true, // 是不是第一次
              isNoAuto = scope.initOpts && scope.initOpts.isNoAuto; // 是不是自动加载一次

          // 注册事件, 方便回调
          scope.$on('initMyRefresh', function(event, item) {
            init(item);
          });

          // 滑动方向
          parseRefreshMode();
          function parseRefreshMode() {
            var refreshMode = (scope.initOpts && scope.initOpts.refreshMode) || '';
            refreshMode.trim(); // 去掉两边空格
            if(!refreshMode) {
              scope.isScorllUp = 1; // 默认只能向上拉
            } else {
              refreshMode = angular.lowercase(refreshMode); // 统一变成小写
              scope.isScorllDown = /down|all/.test(refreshMode);
              scope.isScorllUp = (!refreshMode || refreshMode == 'all');
            }
          } 

          // 初始化拉下
          function init(opt) {
            scope.items = [];
            curOpt = angular.extend({}, setting, opt || {});
            scope.isFirst = scope.isNoData = true; // 默认隐藏上拉
            scope.isFinish = false; // 方便刷新数据后显示隐藏内容
            if(!isFirst || !isNoAuto) {
              scope.getAjax(); // 触发一次请求
            } else {
              isFirst = false;
            }
          }

          // 取得ajax值
          scope.getAjax = function (isPull) {
            if(scope.isNoData && !scope.isFirst && !isPull) return; // 没数据时直接返回
            curOpt.page ++;
            $api[scope.ajaxName](curOpt, function (json) {
              if (json.code == 200) {
                var data = json.data;
                var list = data.data || [];
                var page = curOpt.page; // 当前页
                var total = data.pages;

                if(page <= total && list.length) {
                  processingData && processingData(list);

                  if(isPull) {
                    scope.items = list.concat(scope.items);
                  } else {
                    scope.items = scope.items.concat(list);
                  }
                }

                if(scope.isFirst) {
                  scope.isNoData = scope.isFirst = false;
                  $ionicScrollDelegate.scrollTop(); // 滚动条滚动到最上面
                }

                if(page >= total) {
                  scope.isNoData = true;
                  curOpt.page = total;
                }

                // 回调
                scope.finishFn && scope.finishFn(scope);
                scope.isFinish = true;

                scope.$broadcast('scroll.refreshComplete'); // 上拉结束
                scope.$broadcast('scroll.infiniteScrollComplete'); // 下拉结束
              }
            })
          }

          init(); // 初始化各类值
        }
      };
    })
}());
