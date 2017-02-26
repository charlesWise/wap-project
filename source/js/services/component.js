/**
 * @module wjswap.component
 * @requires ionic
 * @requires wjswap.config
 * @description
 * component 模块提供应用所需 UI 组件
 */

(function(){
  'use strict';
  angular.module('wjswap.component', ['ionic', 'wjswap.config', 'cgNotify'])
    .factory('$ui', function($timeout, $q, $ionicPopup, $ionicActionSheet, $ionicLoading, $ionicModal, notify, $ionicSlideBoxDelegate){
      return {
        /**
         * @func alert
         * @param {Object} opt alert 参数
         * @description
         * 调用方式 $ui.alert({...})
         */
        alert: function(opt){
          var setting = {
            title: '提示',
            content: '',
            onOk: opt.cb || function(){},
            inner: opt.inner || 1000
          };

          var _opt = {};
          if(typeof opt == 'string'){
            _opt.content = opt;
          } else {
            _opt = opt;
          }
          _opt = angular.extend(setting, _opt);
          if(_opt.isCenter) {
            _opt.content = '<div class="text-center">' + _opt.content + '</div>';
          }
         return $ionicPopup.alert({
            title: _opt.title,
            content: _opt.content,
            okText: _opt.okBtn
          }).then(function(res) {
            _opt.onOk();
          }, function(err){}, function(popup){
            $timeout(function() {
              popup.close();
            }, _opt.inner);
          });
        },

        /**
         * @func cancel
         * @param {Object} opt cancel 参数
         * @description
         * 调用方式 $ui.cancel({...})
         */
        cancel: function(opt){
          var setting = {
            title: '提示信息',
            text: '取 消',
            type: 'button-energized',
            template: 'This is alert content...!',
            onCancel: function(){}
          };

          var _opt = {};
          if(typeof opt == 'string'){
            _opt.template = opt;
          } else {
            _opt = opt;
          }
          _opt = angular.extend(setting, _opt);

          var pop = $ionicPopup.show({
            title: _opt.title,
            template: _opt.template,
            buttons: [{
              text: _opt.text,
              type: _opt.type,
              onTap: function(e){
                _opt.onCancel();
                pop.close();
              }
            }]
          });
          return pop;
        },

        /**
         * @func confirm
         * @param {Object} opt confirm 参数
         * @description
         * 调用方式 $ui.confirm({...})
         */
        confirm: function(opt){
          var setting = {
            title: '提示信息',
            content: 'This is confirm content...!',
            okBtn: '确 定',
            cancelBtn: '取 消',
            onOk: function(res){},
            onCancel: function(res){}
          };
          opt = angular.extend(setting, opt || {});
          if(opt.isCenter) {
            opt.content = '<div class="text-center">' + opt.content + '</div>';
          }
          return $ionicPopup.confirm({
            title: opt.title,
            content: opt.content,
            buttons: [
              {text: opt.cancelBtn},
              {
                text: opt.okBtn,
                type: 'button-energized',
                onTap: function(){
                  // opt.onOk();
                  return true;
                }
              }
            ]
          }).then(function(res) {
            opt[res ? 'onOk' : 'onCancel']();
          });
        },

        /**
         * @func prompt
         * @param {Object} opt prompt 参数
         * @description
         * 调用方式 $ui.prompt({...})
         */
        prompt: function(opt){
          var setting = {
            title: 'Prompt',
            subTitle: 'Prompt sub title',
            onClose: function(res){}
          };
          opt = angular.extend(setting, opt || {});
          $ionicPopup.prompt({
            title: opt.title,
            subTitle: opt.subTitle
          }).then(function(res) {
            opt.onClose(res);
          });
        },

        /**
         * @func actionSheet
         * @param {Object} opt actionSheet 参数
         * @description
         * 调用方式 $ui.actionSheet({...})
         */
        actionSheet: function(opt){
          var setting = {
            buttons: [{text: '自定义一个菜单'}],
            titleText: 'Modify your album',
            destructiveText: '删除',
            cancelText: '取消',
            cssClass: '',
            oncancel: function(){},
            cancelOnStateChange: function(){},
            ondelete: function(){},
            onclick: function(index){}
          };
          var _opt = angular.extend(setting, opt || {});
          $ionicActionSheet.show({
            buttons: _opt.buttons,
            destructiveText: _opt.destructiveText,
            titleText: _opt.titleText,
            cancelText: _opt.cancelText,
            cancel: function(){
              _opt.oncancel();
            },
            destructiveButtonClicked: function(){
              _opt.ondelete();
              return true;
            },
            buttonClicked: function(index){
              _opt.onclick(index);
              return true;
            }
          });
        },

        /**
         * @func showLoading
         * @param {Object} tpl showLoading 参数, 允许为 html
         * @description
         * 调用方式 $ui.showLoading([tpl])
         */
        showLoading: function(tpl){
          $ionicLoading.show({
            duration: 2000,
            delay: 0,
            template: '<i class="icon ion-loading-c"></i>\n<br/>\n' + (tpl || 'Loading...'),
            noBackdrop: false
          });
        },

        hideLoading: $ionicLoading.hide,

        /**
         * @func createModal
         * @param scope controller 作用域
         * @param then 创建 modal 后的回调
         * @param tpl modal 模板(默认值为公用 modal.html)
         * @description
         * 调用方式 $ui.createModal(tpl, scope, function(){...})<br>
         * animation: slide-in-up(default) | fade-in
         */
        createModal: function(scope, then, tpl){
          $ionicModal.fromTemplateUrl(tpl || '/templates/common/modal.html', {
            scope: scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            then(modal);
          });
        },

        /**
         * func notify
         * @see https://github.com/cgross/angular-notify
         * @param  {Object || String} opt
         * @description
         * 调用方式 $ui.tip("我是消息提醒");
         */
        tip: function(opt){
          var setting = {
            message: "",
            templateUrl: '../../templates/common/tip.html'
          };
          var _opt = typeof opt === 'string' ? setting['message'] = opt : angular.extend(setting, opt || {});
          notify.closeAll();
          notify(_opt);
          notify.config({
            duration: 2000,
            verticalSpacing: -52
          });
        },

        viewImg: function($scope, opt){

          opt = opt ? opt : {};

          // 当前展示的图片的index
          var currentIndex = opt.index || 0;
          // 是否显示删除按钮
          if(typeof opt.hasDelete === 'undefined'){
            $scope.hasDelete = 1;
          }

          $ionicModal.fromTemplateUrl('/templates/common/view-img.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $ionicSlideBoxDelegate.update();
          });

          $scope.activeSlide = currentIndex;

          $scope.closeModal = function() {
            $scope.modal.hide();
          };

          // Cleanup the modal when we're done with it!
          $scope.$on('$destroy', function() {
            $scope.modal.remove();
          });
        },

        /**
         * @func callSwipe
         * @param {object} $scope 为当前控制的作用域
         * @description
         * 图片预览器：<br>
         * 图片预览使用 ionic 的模态窗口打开，所以为保证不报错，控制器里首先创建一个模态窗口
         * 图片预览的数据来源 $scope.swipeImages<br>
         * 图片预览的索引为 $scope.swipeIndex<br>
         * 图片预览的模态窗口 $scope.swipeModal
         * @example
            view:
            <ion-content>
              <span class="imgItems" ng-repeat="img in swipeImages track by $index" ng-click="viewImages($index)">
                <img src="{{img.src}}" alt="{{img.title}}"/>
              </span>
            </ion-content>
            controller:
            $scope.swipeImages = [
              {title: 'Image caption 美女啊', src: '/images/temp/22.png', w: 640, h: 340},
              {title: 'Image caption 又一个美女啊', src: '/images/temp/11.png', w: 648, h: 336},
              {title: 'Image caption 效果图', src: '/images/temp/33.png', w: 672, h: 1081}
            ];
            $ui.createModal($scope, function(modal){
              $scope.swipeModal = modal;
            }, '/templates/common/swipe-modal.html');
            $scope.viewImages = function(index){
              $scope.swipeIndex = index;
              $scope.swipeModal.show();
              $ui.callSwipe($scope);
            };
         */
        callSwipe: function($scope){
          var pswpElement = document.querySelectorAll('.pswp')[0];
          var options = {
            history: false,
            focus: false,
            index: $scope.swipeIndex || 0,
            showAnimationDuration: 0,
            hideAnimationDuration: 0,
            closeOnVerticalDrag: false
          };

          var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, $scope.swipeImages, options);
          if(typeof $scope.swipeDelete == 'function'){
            angular.element(pswpElement).find('button').css('display', 'block');
          }

          // 去掉这个dom的事件冒泡,document里有返回事件
          ionic.EventController.onGesture('swiperight', function(e) {
            e.stopPropagation();
          }, pswpElement)

          // 修改数据下标
          var maxLen = $scope.swipeImages.length - 1;
          var count = $scope.swipeIndex - 1;
          gallery.listen('afterChange', function(){
            count ++;
            if(count > maxLen) {
              count = 0;
            }
            $scope.swipeIndex = count;
          });

          // 获取数据 这时读取图片地址有点晚: 显示的同时开始下图片
          gallery.listen('gettingData', function(index, item) {
            var img = new Image();
            img.src = item.src;
            img.onload = function(){
              gallery.items[index].h = this.height;
              gallery.items[index].w = this.width;
              // 图片加载完后，重设位置信息，防止手机上首次加载图片位置不对
              gallery.updateSize(true);
            };
          });

          // 关闭按钮
          gallery.listen('close', function(){
            $scope.swipeModal.hide();
          });
          $scope.$on('modal.hidden', function() {
            angular.element(document.querySelector('.modal-backdrop')).remove();
          });

          // 状态改变时关闭窗口
          $scope.$on('$stateChangeStart', function() {
            $scope.swipeModal.hide();
          })

          gallery.init();
        }
      }
    })
}());
