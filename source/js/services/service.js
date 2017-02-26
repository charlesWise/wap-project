/**
 * @module wjswap.services
 * @requires ionic
 * @requires wjswap.config
 * @description
 * services 模块功能:<br>
 * 1. 创建了应用的 $api 对象：该对象根据 apiMap 表定义了应用中的api接口<br>
 * 2. 可创建应用中全局model<br>
 * 注意：如果使用appMock拦截应用的请求来模拟数据，那么blockMap的每个拦截(key)需要在apiMap中有对应的值(value)
 * @example
//api 接口列表 hash 表
//key 为调用方法，value 为实际接口的地址
var apiMap = {
  userInfo: '/User/UserAccount/userInfo'
};
//controller
$scope.userInfo = '';
$api.userInfo({id: 16}, function(data){
  $scope.userInfo = data;
});
 */

(function(){
  'use strict';
  angular.module('wjswap.services', ['ionic', 'wjswap.config'])
    // 设置本地储存
    .factory('$localStorage', function() {
      return {
        // 设置成字符串 同时支持{}
        set: function(key, val) {
          this.setType(key, val);
        },
        // 获取值，返回字符串
        get: function(key) {
          return this.getType(key);
        },
        // 保存到localStorage中
        // 支持k,v  和 {k:v}
        setObj: function(key, val) {
          this.setType(key, val);
        },
        getObj: function(key) {
          return this.getType(key, true);
        },
        // 清除localStorage
        // 支持字符串和数组
        remove: function(key) {
          if(!key) return;
          var isArray = angular.isArray(key);
          if(isArray) {
            angular.forEach(key, function(v) {
              window.localStorage.removeItem(v);
            });
            return;
          }
          window.localStorage.removeItem(key);
        },
        // 设置类型
        setType: function(key, val) {
          if(!key) return;
          if(angular.isObject(key)) {
            angular.forEach(key, function(v, k) {
              parse(k, v)
            });
            return ;
          }
          parse(key, val);

          function parse(k, v) {
            v = v || false; // 默认值设置为 false
            v = angular.isObject(v) ? JSON.stringify(v) : v;
            window.localStorage.setItem(k, v);
          }
        },
        // 取值
        getType: function(k, isObj) {
          if(!k) return;
          var val = '',
              locStr = window.localStorage.getItem(k);
          if(locStr) {
            if(isObj) {
              val = JSON.parse(locStr);
            } else {
              // 把这些值转化为'' 后期好判断boolean值
              val = (locStr == 'undefined' || locStr == 'false') ? val : locStr;
            }
          }

          return val;
        }
      }
    })
    // 各种ajax服务
    .factory('$api', function($http, $notShowLoading, $rootScope, $ionicLoading, $publicApi, $apiMap, $ui, $state, $util, $noLoginState, $iosApi, $allowLogin){
      var o = {};
      var createApi = function(query, key){
        o[key] = function(params, success, error, isPreventError){
          // 检测网络状态 安卓以外的 通过这种方式监测网络
          if((typeof navigator.onLine == 'boolean' && !navigator.onLine && $rootScope.clientType != 'ios' && $rootScope.clientType != 'android')){
            $ui.tip('无法连接到服务器或网络，请检查网络设置');
            return false;
          }

          if(!angular.isFunction(error)) {
            isPreventError = error;
            error = null;
          }

          var _params = params;
          var _success = success || function(){};
          var getParams = '';

          if(typeof(_params) === 'function'){
            _success = _params;
          }
          // 如果传入的不是object就重置
          // 否则就把settings合并过去
          if(typeof(_params) !== 'object'){
            _params = {};
          }

          // fzc: 不在 $notShowLoading 里的数组才会显示loading
          if($notShowLoading.indexOf(key)  === -1){
            $ionicLoading.show();
          }

          // 转化为url参数
          if($apiMap[key][1] && $apiMap[key][1].toUpperCase() === 'GET' && params) {
            getParams = '?';
            angular.forEach(_params, function(v, k) {
              getParams += k + '=' + v + '&';
            })
          }

          if($apiMap[key][0].indexOf('?i=') > 0){
            $apiMap[key][0] += new Date().getTime();
          }

          query({
            method: $apiMap[key][1] || 'POST',
            data: _params,
            url: $publicApi['serverHost'] + $publicApi['proxyApi'] + $apiMap[key][0] + getParams,
          }).success(function(data){
            var message = data.message;

            $ionicLoading.hide();

            if(data.code == 401){
              window.location.href = data.data.authorize;
              return false;
            }

            _success && _success(data);
          }).error(function(err){
            if(!isPreventError) {
              $ionicLoading.show({
                duration: 2000,
                template: err
              });
            }
            error && error();
          });

        }
      };

      for(var key in $apiMap){
        if($apiMap.hasOwnProperty(key)){
          createApi($http, key);
        }
      }
      return o;
    })
    // 检查是否可以登录
    .factory('$userPermission', function($noLoginState, $notToAfterLogin, $api, $state, $util, $rootScope, $localStorage, $ui, $iosApi){
      return {
        _arrFind: function(param, arr){
          for (var i in arr) {
            if (arr[i] === param) {
              return true;
            }
          }
          return false;
        },

        // 检查是否非登录就可查看
        // 网址打开时to为空，这时要跳到home, 所以不用发isLogin
        isCanVisitNoLogin: function(to){
          return to ? this._arrFind(to, $noLoginState) : true;
        },

        // 登录后是否可查看
        isCanVisitAfterLogin: function(to){
          return this._arrFind(to, $notToAfterLogin);
        },
        isNeedLogin: function(to, from,completeCallback){
          // 不用检查页面登录状态默认状态为true
          // config.local里设置 ENV.isPageCheck = false;
          if(!ENV.isPageCheck) return;

          var isCanVisitNoLogin = this.isCanVisitNoLogin(to),
              isCanVisitAfterLogin = this.isCanVisitAfterLogin(to),
              isNeedLogin;
          if (!isCanVisitNoLogin || isCanVisitAfterLogin) {
            $api.isLogin({},function(data) {
              if(data.boolen == 0){ // 未登录
                if(!isCanVisitNoLogin){ // 登录后才能看
                  $rootScope.resetData();

                  if($rootScope.clientType){
                    if($rootScope.clientType == 'android'){
                      //安卓登录
                      window['mainweb']['goLuckDraw']();

                    }else if($rootScope.clientType == 'ios'){
                      window.location.href = $iosApi.goLuckDraw;
                    }
                  }else{
                    $state.go('app.login');
                    return false;
                  }
                }
              } else { // 已登录
                if(isCanVisitAfterLogin) { // 需要登录才能查看
                  $state.go(from || 'app.tabs.accountInfo');
                }
              }
              typeof(completeCallback)==='function' && completeCallback.call(this);//加载完成的回调
            },function(){
              typeof(completeCallback)==='function' && completeCallback.call(this);//error时加载完成的回调
            });
          }else{
            typeof(completeCallback)==='function' && completeCallback.call(this);//加载完成的回调
          }
        }
      }
    })
    // 这里只能获取 userInfo 的信息
    .factory('$userInfo', function($rootScope, $api, $localStorage, $util, $noLoginState){
      return {
        // 初始化数据
        init: function(data) {
          $rootScope.rootUserInfo = data; // 储存变量
          $localStorage.setObj('rootUserInfo', data); // 存在本地

          // 下面这些只要用于menu.html。其它地方不让用
          $rootScope.isLogin = true; // 是否登录
        },
        // data是直接加数据的
        // isUpdata为true是强制更新的
        // callback 有回调就一定要先取个人资料
        getUser: function(data, isUpdata, callback){
          // 先检测第一个参数
          if(typeof data === 'boolean') {
            callback = isUpdata;
            isUpdata = data;
            data = null;
          } else if(angular.isFunction(data)) {
            callback = data;
            data = null;
            isUpdata = true;
          }

          // 检测第二个参数
          if(angular.isFunction(isUpdata)) {
            callback = isUpdata;
            isUpdata = true;
          }

          if(!angular.isObject(data)) {
            data = null;
          }

          // 填充userinfo数据
          if(data) {
            this.init(data);
            return data;
          }

          var val = $rootScope.rootUserInfo || $localStorage.getObj('rootUserInfo'),
              self = this;

          // 这个只出现在刚进来和刷新的时候
          // 这个时候已经通过过的方法先调用一次了
          if($util.isEmpty(val) || isUpdata) {
            // 不是强制更新且当前页不是必须登录页则返回空对象
            if($util.inArray($rootScope.toState, $noLoginState) && !isUpdata) {
              return {};
            }
            // 重新更新
            $api.getUserLoginInfo(function(data) {
              if(data.boolen) {
                data = data.data;
                self.init(data);
                callback && callback(data);
              }
            })
          } else {
            self.init(val);
          }

          return val;
        },
        isIdAuth: function(){ // 是否实名认证
          return this.get('is_id_auth') === '1';
        },
        // 改新userInfo数据
        setObj: function(obj) {
          var userInfo = this.getUser();
          angular.extend(userInfo, obj);
          this.init(userInfo);
        },
        get: function(property){
          return this.getUser()[property] || '';
        },
        // 是不是审核通过
        isApprove: function() {
          var state = this.get('audit_status');
          // console.log(state)
          return state == 3 || state == 6;
        },
        getInvest: function(key) {
          var obj = this.get('invest_user');
          if(key && obj) {
            obj = obj[key]
          }
          return obj;
        },
        // 清空menu.html用到的数据, 解决退出后侧栏显示不正常的问题
        clear: function() {
          var arr = ['rootUserTypeLabel', 'rootUserType', 'isLogin', 'isIdAuth', 'corpStatus', 'rootUserInfo', 'rootUname', 'rootAvastar'];
          angular.forEach(arr, function(v) {
            delete $rootScope[v];
          });
          $localStorage.setObj('rootUserInfo', {});
        }
      }
    })
    // 各控制器之间传递参数的对象
    .factory('$rootTransfer', function($rootScope, $localStorage) {
      var obj = $rootScope.rootTransferParams,
          pre = 'rootTransfer-'; // locaStorage储存用
      if(!obj) {
        obj = $rootScope.rootTransferParams = {}
      }
      return {
        set: function(k, v) {
          if(angular.isObject(k)) {
            angular.forEach(k, function(v, k) {
              setItem(k, v);
            })
          } else {
            setItem(k, v);
          }

          // 设置一条
          function setItem(k, v) {
            obj[k] = v;
            $localStorage.set(pre + k, v);
          }
        },
        get: function(k) {
          if(!k) return;
          var val = obj[k];
          if(!val) {
            val = $localStorage.get(pre + k);
            obj[k] = val;
          }
          return val;
        },
        getObj: function(k) {
          if(!k) return;
          return obj[k] || $localStorage.getObj(pre + k);
        },
        remove: function(k) {
          if(!k) return;
          if(angular.isArray(k)) {
            angular.forEach(k, function(k) {
              removeItem(k)
            })
          } else {
            removeItem(k)
          }

          // 删除一个
          function removeItem(k) {
            delete obj[k];
            $localStorage.remove(pre + k);
          }
        },
        clear: function() {
          $rootScope.rootTransferParams = {};
          var arr = Object.keys(localStorage),
              exp = new RegExp(pre);
          angular.forEach(arr, function(item) {
            if(exp.test(item)) {
              $localStorage.remove(item);
            }
          });
        }
      }
    })
    // 更新本地applicationCache
    .factory('$applicationCache', function($api, $ui){
      // 声命这个变量是为了内部好调用
      // 防止this指向不明的问题
      var self =  {
        update: function(){
          // 1为已经是(本地)最新,可以请求服务器检查
          if (applicationCache.status === 1) {
            // 非1,4的情况下update会报程序错误
            applicationCache.update();

          // 4为本地已经有最新的数据但是还没有应用到本应用,直接弹出提示刷新
          } else if(applicationCache.status === 4) {
            applicationCache.onupdateready();
          }
        },

        // 初始化update和noupdate函数
        init: function() {
          // 更新函数
          applicationCache.onupdateready = function() {
            // 更新缓存后的回调函数
            $ui.confirm({title: '缓存更新', content: '检测到新的可用缓存，确认更新？', onOk: function(){
              window.location.reload();
              self.hideSplashscreen();
            }});
          };

          // 没有更新
          applicationCache.onnoupdate = function() {
            self.hideSplashscreen();
          }
        },
      };

      return self;
    })
}());
