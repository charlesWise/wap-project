/**
 * @module wjswap.util
 * @requires ionic
 * @description
 * util 模块提供应用所需公用、通用的方法
 */
(function(){
  'use strict';
  angular.module('wjswap.util', [])
    .factory('$util', function($state, $ui, $rootScope, $ionicHistory, $localStorage){

      var validator = {
        required: {
          regex: /[^(^\s*)|(\s*$)]/,
          msg: "此项必填"
        },
        email: {
          regex: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          msg: "邮箱格式不正确。参考格式: xxxx@trj.com"
        },
        qq: {
          regex: /^\d+$/,
          msg: "qq号码必须是1位以上的数字"
        },
        money: {
          regex: /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/,
          msg: "金额格式不符，仅允许输入数字和小数点，并最多输入两位小数，如1000.00"
        },
        url: {
          msg: "链接格式不正确。参考格式：http://www.ifsc.com.cn"
        },
        id: {
          msg: "此项必填"
        },
        lengthRange: {
          msg: "密码长度为 #0# 到 #1#"
        },
        notMatch: {
          msg: "please enter a value differnt from '#0#'"
        },
        match: {
          msg: "请保证两次输入一致"
        },
        realname: {
          regex: /^[\u0391-\uFFE5A-Za-z0-9]+$/,
          msg: "中文,英文, 0-9"
        },
        //安全问答的验证
        safeAnswer: {
          regex: /^[\u0391-\uFFE5A-Za-z0-9\s]+$/,
          msg: "答案只允许中文、英文、数字"
        },
        alphanumeric: {
          regex: /^[A-Za-z0-9_-]+$/,
          msg: "英文, 0-9, - and _"
        },
        idcard: {
          msg: "身份证号码错误"
        },
        mobile: {
          // regex: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){10,12})+$/,
          regex: /^[1][3,4,5,7,8]\d{9}$/,
          msg: "手机号码格式错误"
        },
        phone: {
          //regex: /^((\d{11,12})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/,
          regex: /^((\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$)$/,
          msg: "请输入正确的座机号码，如:0571-88888888"
        },
        mobileOrPhone: {
          msg: "此项格式为手机或座机号码"
        },
        // 验证座机区号
        areaPart: {
          // 匹配区号0开头的3位或4位数字
          regex: /^0\d{2}$|^0\d{3}$/,
          msg: "区号格式错误"
        },
        // 验证座机号，不包括区号
        phonePart: {
          // 匹配电话号码为7位或8位数字
          regex: /^((\d{7,8})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$)$/,
          msg: "座机号码格式错误"
        },
        year: {
          regex: /^[1,2][0,9]\d{2}$/,
          msg: "年格式填写错误！"
        },
        month: {
          regex: /^[0,1]\d{1}$|^\d{1}$/,
          msg: "月格式填写错误！"
        },
        day: {
          regex: /^[0,1,2,3]\d{1}$|^\d{1}$/,
          msg: "日格式填写错误！"
        },
        number: {
          msg: "此项为数字格式"
        },
        notAllNum: {
          regex: /^\d+$/,
          msg: "不能全为数字"
        },
        uploadImg: {
          msg: "图片类型错误"
        },
        uploadFile: {
          msg: "附件类型错误"
        },
        uploadFileImg: {
          msg: "附件类型错误"
        },
        uploadSound: {
          msg: "录音类型错误"
        },
        maxValue: {
          msg: "请输入数字小于  #0#"
        },
        minValue: {
          msg: "请输入数字大于  #0#"
        },
        maxDecimal: {
          msg: "有效数字不多于 #0#"
        },
        integer: {
          regex: /^[1-9]\d*$/,
          msg: "请输入正整数"
        },
        // 利率判断 eg: 43 | 32. | 32.1 | 32.33
        rate: {
          regex: /^\d{1,2}(\.\d{1,2}?)?$/,
          msg: "请输入有效数字"
        },
        // 最小金额
        minNumber: {
          regex: /^\d*(\.(\d{1,2})?)?$/,
          msg: "请输入大于等于 #0# 数字"
        },
        hundredMultiple: {
          regex: /^[1-9]\d*00$/,
          msg: "仅为数字100的倍数"
        }
      };

      return {
        getParams: function(url){
          var _url = url || window.location.href;
          var index = _url.indexOf('?');
          var params = {};
          if(index !== -1){
            var paramsStr = _url.slice(index + 1); // 获取到问号以后的字符串
            var paramsArr = paramsStr.split('&');
            // 把url上的所有参数塞到json对象中,以键值对的方式保存
            for(var i = 0, length = paramsArr.length, param; i < length; i++){
              param = paramsArr[i].split('=');
              params[param[0]] = param[1]
            }
          }
          return params;
        },

        /**
         * 获取地址栏参数
         * @param name:string 地址栏参数名称
         */
        getQueryString:function(name){
          var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)'),
              href=window.location.href,
              search ='',
              result=null;

          if(href.indexOf('?')>-1){
            href=href.split('?')[1];
            search=href.match(reg);

            if(search!==null){
              result= unescape(search[2]);
            }
          }

          return result;
        },

        sliceStr: function(str, len){
          if(typeof str == 'string' && str.length > len){
            return str.slice(0, len) + '…';
          }
          return str;
        },

        /**
         * @func toPage
         * @param url 要跳转的地址，注意这里的地址是 $stateProvider.state 地址不是 url 地址
         */
        toPage: function(url) {
          !!url && $state.go(url);
        },
        /**
         * @func isEmaptyObject
         * @param  {[type]}  obj [description] 需要判断的对象
         * @return {Boolean}     [description]
         */
        isEmptyObject: function(obj) {
          for (var name in obj) {
            return false;
          }
          return true;
        },

        // 记录formdata是否被初始化
        formMap:{},

        // 存放被初始化的字段
        formArray:[],

        // 把formArray保存到本地即localStorage
        // 默认保存formArray里的值
        refreshFormToLocal: function(obj, key){
          var argsLen = arguments.length,
              arr = this.formArray;
          if(!argsLen && arr.length) {
            angular.forEach(arr, function(item) {
              // 第一次初始化的时候，$rootScope下有可能什么都没
              // 这时候要初始化下
              obj = $rootScope[item];
              if(!obj) {
                obj = $rootScope[item] = {};
              }
              $localStorage.setObj(item, obj);
            });
            return ;
          }

          if(typeof obj === 'object'){
            $localStorage.setObj(key, obj);
          }
        },
        /**
         * @func newFormData
         * @description 创建用于多级表单之间传数据的对象，如果localStorage里面有值，则从localStorage里面取
         * @param  {[type]} key        [description]
         * @param  {[type]} $rootScope [description]
         * @return {[type]}            [description]
         * params 即可为数据也可为字符串
         */
        newFormData: function(params, region){
          region =  region || $rootScope;
          var isArray = angular.isArray(params),
              self = this;

          if(isArray) {
            angular.forEach(params, function(item) {
              initItem(item);
            })
          } else {
            initItem(params);
          }

          // 初始化一条数据
          function initItem(key) {
            var isStore = self.formMap[key]; // 是否保存在formArray中

            // 没保存的都保存下，方便切换页面时保存数据
            if(!isStore) {
              self.formMap[key] = true;
              self.formArray.push(key);
            }

            // 保存在对象中,getObj方法默认返回一个{}
            region[key] = $localStorage.getObj(key);
          }
        },
        /**@func clearFormData
         * @description 清除用于多级表单之间传数据的对象
         * [clearFormData description]
         * @return {[type]} [description]
         * 支持string和array
         */
        clearFormData: function(key){
          // 保存的$rootScopt下的form对象
          var isArray = angular.isArray(key),
              arr = isArray ? key : this.formArray;

          if(isArray || !key) {
            angular.forEach(arr, clearItem);
          } else {
            clearItem(key);
          }

          // 清空单个
          function clearItem(k) {
            // 设置成空
            // $localStorage.setObj(k, {});
            $rootScope[k] = {};
            $localStorage.remove(k);
          }
        },

        // 清除localStorage以及ionic缓存的页面
        clearCache: function(){
          this.clearFormData();
          $ionicHistory.clearCache();
        },
        getSelectedDictName: function(dict, code_no){
          var len = dict.length;
          for(var i=0; i<len; i++){
            if(dict[i].code_no === code_no){
              return dict[i].code_name;
            }
          }
          return null;
        },
        /**@func cutToShort
         * @description 文字太长，进行截取, 仅支arr:[key]格式
         * [cutToShort description]
         *
         */
        cutToShort: function(arr, key, words_keep){
          words_keep = words_keep ? words_keep:10;

          if(angular.isArray(arr)){
            var len = arr.length;
            for(var i=0; i<len; i++){
              if(arr[i][key] && arr[i][key].length > words_keep){
                arr[i][key] = arr[i][key].substr(0,words_keep)+'...';
              }
            }
          }

          return arr;
        },

        /**@func isEmpty
         * @description 判断一个对象是否为空
         * [isEmpty description]
         * null、undefined、arr.length===0、{}这些情况判定为empty
         */
        isEmpty: function(obj) {

          if (!obj) return true;

          // 判断是不是本地属性
          var hasOwnProperty = Object.prototype.hasOwnProperty;

          // 字符串 / 类数组
          if (obj.length > 0)    return false;
          if (obj.length === 0)  return true;

          // {}
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false; // 是本地属性则不为空
          }

          return true;
        },
        // 是不是在数组中
        inArray: function(item, arr) {
          if(!Array.isArray(arr)) return false;
          return arr.indexOf(item) !== -1;
        },
        /**
         * @func validForm
         * @param selector
         * @param isNoPreVerify
         * @example
         * selector 为选择器，可以不填写。默认为ion-view
         * 验证表单中该填的是否已填
         * ng-novalid为true的时候不进行验证
         * 提示字段为当前input的 required / ngRequired(ng不编译required里的魔板)
         * isPreVerify
         * 是不是预验证(请求动态码时的验证) 默认是false
         * noPreVerify 在预验证中不作校验的加这个属性
         *
         * 支持自定类型判断,前面是类型，后面是报错文字
         * valid="mobile:手机, money: 只保留两位"
         */
        validForm: function(selector, isPreVerify,completeCallback) {
          if(typeof selector === 'boolean') {
            isPreVerify = selector;
            selector = null;
          }
          var result = true,
              inputs, tipMsg, input, ionViews;
          selector = selector ? selector : 'ion-view';
          ionViews = document.querySelectorAll(selector);
          angular.forEach(ionViews, function(ionView){
            // 筛选出当前页的表单进行验证
            if(ionView && angular.element(ionView).attr('nav-view') == 'active'){
              inputs = ionView.querySelectorAll('input, select');
              for(var i = 0; i < inputs.length; i++){
                input = inputs[i];
                // 如果是预验证 且 当前input不用验证(含noPreVerify属性)
                if(isPreVerify && input.hasAttribute('noPreVerify')) {
                  break ;
                }
                tipMsg = input.getAttribute('required') || input.getAttribute('ngRequired');
                var ngNovalid = (input.getAttribute('ng-novalid') || '').trim();
                var ele = angular.element(input);
                var inputType = ele.attr('type');
                var val = ele.val(); // 表单值
                var isChecked = false;
                if(inputType == 'checkbox'){
                  isChecked = ele[0].checked;
                }
                var validType = input.getAttribute('valid'); // 有没有自定义验证

                // 如果有required 且 ng-novalid 为false
                if(tipMsg !== null && (ngNovalid === 'false' || !ngNovalid)){
                  if(inputType != "checkbox" && !val || inputType == "checkbox" && !isChecked){ // 表单没有值
                    tipMsg = tipMsg || "此项必填";
                    result = false;
                  } else if(validType) { // 有自定义验证
                    // 取出各组的k:v 例如valid="mobile:手机, money: 只保留两位"
                    // ['mobile:手机', 'money:只保留两位']
                    angular.forEach(validType.split(','), function(item) {
                      // ['mobile', '手机']
                      var validObj = item.split(':');
                      var defaultRule = validator[validObj[0]]; // 默认规则里是否存在这条
                      // forEach真2b，中间不能断开, 所以要加上 result 的判断
                      if(defaultRule && result) {
                        // 匹配失败，说明格式不对
                        if(!defaultRule.regex.test(val)) {
                          tipMsg = validObj[1] || defaultRule.msg; // 报错信息
                          result = false;
                        }
                      }
                    });
                  }

                  // 对结果进行判断
                  if(!result) {
                    ele.addClass('error');
                    $ui.tip(tipMsg);
                    // fzc: 聚焦当前input
                    setTimeout(function() {
                      input.focus();
                    });
                    return false;
                  }else{
                    ele.removeClass('error');
                  }
                }
              }
            }
          });
          typeof(completeCallback)==='function' && completeCallback.call(this,result);
          return result;
        },
        /**
         * @func goBack
         * @example
         * 返回前一个view. iphone6里不支持history.go
         * 防止刷新后退键无效所以要用history
         */
        goBack: function(count){
          count = parseInt(count || -1);
          if(!count || count > -1) return;

          if(isHasHistory()) {
            $ionicHistory.goBack(count)
          } else {
            window.history.go(count);
          }

          // 返回目标view
          function isHasHistory() {
            var newView;
            if(count !== -1) {
              var curId = $ionicHistory.currentHistoryId(), // 获取当前的curId
                  viewHistory = $ionicHistory.viewHistory(), // 获取所有的视图历史
                  histories = viewHistory.histories[curId], // 获取视图通过curId
                  newCursor = histories.cursor + count; // 获取新视图在数组中的位置
              newView = histories.stack[newCursor]; // 返回新视图
            } else {
              newView = $ionicHistory.backView();
            }
            return newView;
          }
        },
        /**
         * @func isAppClient
         * @example
         * 判断设备类型
         */
        isAppClient: function(){

          // 获取当前的代理信息
          var ua = window.navigator.userAgent.toLowerCase();
          var cookie = document.cookie;
          if (cookie.match(/tourongjia/i) == 'tourongjia') { // 主要用于判断当前项目被嵌入到时,可以做隐藏头部等特殊处理
            $rootScope.isAppClient = true;
          }
          if (cookie.match(/ios/i) == 'ios'){
            $rootScope.clientType = 'ios';
          }
          if (cookie.match(/android/i) == 'android'){
            $rootScope.clientType = 'android';
          }
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            $rootScope.clientType = 'wechat';
          }
          if (cookie.match(/showHead/i) == 'showHead'){
            $rootScope.showHead = true;
          }

          // hide splash immediately
          if(navigator && navigator.splashscreen) {
              navigator.splashscreen.hide();
          }
        },
        /**
         * @func isLogined
         * @example
         * 是否是登录状态
         */
        isLogined: function(){
          return !this.isEmpty($localStorage.getObj('rootUserInfo'));
        },
        /**
         * Copyright (c) 2013, All rights reserved.
         *
         * @fileOverview countDown time
         * @version 1.0
         * @author <a href="mailto:zeng.xianghu@hotmail.com">Hoogle</a>、<a href="http://weibo.com/yinuoba">新浪微博(一诺吧)</a>)
         *
         * @description 倒计时
         * @extends countDown(options) 倒计时
         * @description 倒计时
         * @param {String} [options.tian] 存放天的选择器 形式如'#tian' (可选参数) 如果不需要显示天，可直接不传入这一参数
         * @param {String} [options.shi] 存放小时的选择器 形式如'#shi'
         * @param {String} [options.fen] 存放分钟的选择器 形式如'#fen'
         * @param {String} [options.miao] 存放秒的选择器 形式如'#miao'  (可选参数)如果不需要显示秒，则直接不传入这一参数
         * @param {Date} [options.Date] toDate 截止日期
         * @param {Number} [options.inner] 结束时间戳与当前戳之差
         * @param {Function} [options.callback] 没执行一次倒计时执行一次的方法
         * @param {Function} [options.endFun] 倒计时完毕后的回调函数
         * @param {Boolean} [options.hasUnit] 是否带时分秒的单位
         * @param {Boolean} [options.isHideEmptyDay] 当天数为0的时候是否隐藏它
         * @example
         * $util.countDown({
             tian: '#tian',
             shi: '#shi',
             fen: '#fen',
             miao: '#miao',
             toDate: new Date('2012/03/30 23:59:59')
         })
         $util.countDown({
             tian: '#tian',
             shi: '#shi',
             fen: '#fen',
             miao: '#miao',
             inner: 30000
         })
         */
        countDown: function(options) {
          var toDate = options.toDate,
            tian = options.tian,
            shi = options.shi,
            fen = options.fen,
            miao = options.miao,
            inner = options.inner,
            callback = options.callback || function(){},
            endFun = options.endFun || function() {},
            hasUnit = options.hasUnit,
            countType = options.countType;
          var tick2;
          // 找出天、时、分、秒节点
          var tianObj = tian != null ? document.querySelectorAll(tian)[0] : null,
            shiObj = shi != null ? document.querySelectorAll(shi)[0] : null,
            fenObj = fen != null ? document.querySelectorAll(fen)[0] : null,
            miaoObj = miao != null ? document.querySelectorAll(miao)[0] : null;

          var tianUnit = '', shiUnit = '', fenUnit = '', miaoUnit = '';
          if(hasUnit){
            tianUnit = '天';
            shiUnit = '时';
            fenUnit = '分';
            miaoUnit = '秒';
          }
          // 倒计时处理方法
          var countTime = function(inner) {

            // today 现在时间,new Date()
            // innerTime 截止时间与现在时间的时间轴的差
            // sectimeOld 截止时间与现在时间之间的秒数
            // secondSold 截止时间与现在时间之间的秒数(整数)
            // msPerDay 一天的总秒数
            // e_daysold 剩余的天数
            // daysold 剩余的天数（整数）
            // e_hrsold 剩余天数以外的小时数
            // hrsold 剩余天数以外的小时数(整数)
            // e_minsold 剩余分数
            // minsold 剩余分数(整数)
            // seconds 得到尾剩余秒数(整数)

            // 根据不同的参数，计算时间差
            if (inner != null) {
              var innerTime = inner
            } else {
              var innerTime = toDate.getTime() - new Date().getTime()
            }

            var sectimeOld = innerTime / 1000, //剩余总秒数
              secondSold = Math.floor(sectimeOld), //秒数取整
              msPerDay = 24 * 60 * 60 * 1000, //一天的毫秒数
              e_daysold = innerTime / msPerDay, // 剩余天数
              daysold = Math.floor(e_daysold), // 剩余天数取整
              e_hrsold = (e_daysold - daysold) * 24, // 除去天后的剩余小时数
              hrsold = Math.floor(e_hrsold),
              e_minsold = (e_hrsold - hrsold) * 60,
              minsold = Math.floor((e_hrsold - hrsold) * 60),
              seconds = Math.round((e_minsold - minsold) * 60);

            callback({
              daysold: daysold,
              hrsold: hrsold,
              minsold: minsold,
              seconds: seconds,
              innerTime: innerTime,
              params: options
            });

            // 如果已经到期了，则都显示为0，并且不再执行
            if (innerTime <= 0) {
              if(!hasUnit){
                if (tian !== undefined && tianObj) {
                  tianObj.innerHTML = '00';
                }
                if (shi !== undefined && shiObj) {
                  shiObj.innerHTML = '00';
                }
                if (fen !== undefined && fenObj) {
                  fenObj.innerHTML = '00';
                }
                if (miao !== undefined && miaoObj) {
                  miaoObj.innerHTML = '00';
                }
              } else {
                if (miao !== undefined && miaoObj) {
                  miaoObj.innerHTML = '0秒';
                }
              }
              endFun(options);
              // 阻止定时器继续执行
              return false;
            } else {
              // 小于2位数，则十位补0
              if (hrsold < 10) {
                hrsold = '0' + hrsold;
              }
              if (minsold < 10) {
                minsold = '0' + minsold;
              }
              if (seconds < 10) {
                seconds = '0' + seconds;
              }
            }
            // 给天、时、分、秒的DOM设置值
            if (tian != null && tianObj) {
              if(parseInt(daysold, 10)){
                // 如果存在这个设置则把他显示
                // 这个时候有值了，就要显示出来
                if(options.isHideEmptyDay) {
                  tianObj.style.display = '';
                }
                tianObj.innerHTML = (daysold < 10 ? '0' + daysold : daysold) + tianUnit
              } else {
                // 这时是空值，设置了则要隐藏
                if(options.isHideEmptyDay) {
                  tianObj.style.display = 'none';
                } else {
                  tianObj.innerHTML = '00' + tianUnit;
                }
              }
            }
            if (shi != null && shiObj) {
              shiObj.innerHTML = hrsold + shiUnit;
              if (tian == null) {
                var shiTemp = 24 * parseInt(daysold, 10) + parseInt(hrsold, 10);
                shiObj.innerHTML = (shiTemp < 10 ? '0' + shiTemp : shiTemp) + shiUnit
              }
            }
            if (fen != null && fenObj) {
              fenObj.innerHTML = minsold + fenUnit;
              if (tian == null && shi == null) {
                var fenTemp = parseInt(daysold, 10) * 24 * 60 + parseInt(hrsold, 10) * 60 + parseInt(minsold, 10);
                fenObj.innerHTML = (fenTemp < 10 ? '0' + fenTemp : fenTemp) + fenUnit
              }
            }
            if (miao != null && miaoObj) {
              miaoObj.innerHTML = seconds + miaoUnit;
              if (tian == null && shi == null && fen == null) {
                miaoObj.innerHTML = sectimeOld + miaoUnit
              }
            }
          };

          // 函数内部不断自调用
          tick2 = window.setInterval(function(){
            if (inner >= 0) {
              countTime(inner);
              if(!countType){
                inner -= 1000;
              } else {
                inner += 1000
              }
            }
          }, 1000);

          return tick2;
        },
        /**
         * @description 取得node元素的下一个nodeType为1的ELEMENT节点
         * @param {Element} node 元素节点
         * @return {Element}
         */

        getNextElement: function(node) {
          if (!node.nodeType) {
            return false;
          }
          var nextNode = null;
          for(node = node.nextSibling; node; node = node.nextSibling) {
            if(node.nodeType === 1) {
              // 找到下一个节点元素，则退出循环
              nextNode = node;
              break
            }
          }
          return nextNode
        },
        /**
         * @description 取得node元素的下一个nodeType为1的ELEMENT节点
         * @param {Element} node 元素节点
         * @return {Element}
         */

        getPrevElement: function(node) {
          if (!node.nodeType) {
            return false;
          }
          var prevNode = null;
          // 取得下一个元素
          for(node = node.previousSibling; node; node = node.previousSibling){
            if(node.nodeType === 1) {
              // 找到了上一个元素节点，则退出当前循环
              prevNode = node;
              break
            }
          }
          return prevNode
        },
	      /**
         * 拖拽
         */
        dragEvent: function(options){
          var element = options.element;
          if(element && element.length > 1){
            for(var index = 0; index < element.length; index ++){
              this.bind(index,element[index],options);
            }
          }else{
            this.bind(index,element,options);
          }
        },

        bind: function(index,element,options){
          if(element.nodeType == 1){
            var startCallback = options.startCallback || function(){};
            var dragCallback = options.dragCallback || function(){};
            var endCallback = options.endCallback || function(){};
            /**
             * 拖拽开始
             */
            ionic.onGesture('dragstart', function(e) {
              startCallback(e,element);
            }, element);
            /**
             * 正在拖拽
             */
            ionic.onGesture('drag', function(e) {
              dragCallback(e,element);
            }, element);
            /**
             * 拖拽结束
             */
            ionic.onGesture('dragend', function(e) {
              endCallback(e,element);
            }, element);
          } else {

          }
        },
	      /**
         * 获取cookie
         * @param sName
         * @returns {*}
	       */
        getCookie: function(sName){
          // 将cookie字符串用'；'分割成数组
          var aCookie = document.cookie.split("; "),
            length = aCookie.length;
          for (var i = 0; i < length; i++) {
            // 将键值对用'='隔开
            var aCrumb = aCookie[i].split("=");
            // 如果找到了这个cookie名称，则返回cookie的值
            if (sName == aCrumb[0]) return decodeURIComponent(aCrumb[1]);
          }
          // 没有此cookie
          return null;
        },
	      /**
         * 设置cookie
         * @param sName
         * @param sValue
         * @param sExpires
	       */
        setCookie: function(sName, sValue, sExpires) {
          var sCookie = sName + "=" + encodeURIComponent(sValue);
          if (sExpires != null && (sExpires instanceof Date)) {
            sCookie += "; expires=" + sExpires.toGMTString();
          }
          document.cookie = sCookie;
        },
	      /**
         * 删除cookie
         * @param sName
         */
        removeCookie: function(sName) {
          document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
        },
	      /**
         * 根据key 从数组找找对象
         * @param arr
         * @param key
         * @param val
         * @returns {*}
	       */
        getObjectFromArray: function(arr, key, val){
          for(var i = 0; i < arr.length; i++){
            if(arr[i][key] == val){
              return arr[i];
            }
          }
        },
        /**
         * 当前时间格式化
         * @param format yyyy-MM-dd HH:mm:ss 日期
         */
        formatDate: function(time, format) {
          var args = {
            "M+": time.getMonth() + 1,
            "d+": time.getDate(),
            "H+": time.getHours(),
            "m+": time.getMinutes(),
            "s+": time.getSeconds(),
            "q+": Math.floor((time.getMonth() + 3) / 3),
            "S": time.getMilliseconds()
          };
          if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var i in args) {
            var n = args[i];
            if (new RegExp("(" + i + ")").test(format))
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
          }
          return format;
        }
    }
    })
}());
