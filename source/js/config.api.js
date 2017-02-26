/**
 * @module wjswap.config
 * @description
 * config:<br>
 * api列表
 */

(function(){
  "use strict";

  window.SERVER_HOST_API = typeof SERVER_HOST_API === 'undefined' ? '' : SERVER_HOST_API;

  // 拼在url上，用于判断是否走代理
  window.SERVER_PROXY_API = typeof SERVER_PROXY_API === 'undefined' ? '/site' : SERVER_PROXY_API;
  window.IOS_URL = window.location.host+'/Mobile/Act/index.php/Financing/Invest';
  angular.module('wjswap.config')
    /**
     * @constant $publicUrl
     * @type {Object}
     * @description 公共url
     */
    .constant('$publicApi', {
       serverHost: SERVER_HOST_API
      ,proxyApi: SERVER_PROXY_API // 拼在url上，用于判断是否走代理
      ,verify: SERVER_HOST_API + SERVER_PROXY_API + "/Mobile2/Public/verify" // 验证码
      ,uploadImg: SERVER_HOST_API + SERVER_PROXY_API + "/Public/Upload/uploadImg" // 上传图片
    })

    /**
     * @constant $publicUrl
     * @type {Object}
     * @description url列表
     */
    .constant('$apiMap', {

      /************* Account **************/

       isLogin: ['/Mobile2/Auth/isLogin'] //检测是否登录
       ,logout: ['/logout'] //用户退出
       ,sendVerifycode:['/oauth-resource/sendVerifycode'] //发送验证码
       ,getOpenBankNo: ['/bindCard/getOpenBankNo'] //获取开户行号
       ,bankList: ['/bindCard/list'] //获取银行列表
       ,bindCard: ['/oauth-resource/bindCard'] //用户绑卡
       ,userinfo: ['/me','GET'] //用户信息
       ,product: ['/exchange/public/product','GET'] //产品列表
       ,userAsset: ['/exchange/oauth-resource/userAsset'] //用户资产
       ,userMoney: ['/exchange/oauth-resource/userMoney'] //用户余额
       ,withdraw: ['/oauth-resource/withdraw'] //出金
       ,depositFunds: ['/oauth-resource/depositFunds'] //入金
       ,userTrades: ['/exchange/oauth-resource/userTrades'] //获取用户历史交易,
       ,getLotterylist: ['/oauth-resource/getLotterylist'] //申购配号
       ,allOrders: ['/exchange/oauth-resource/allOrders'] //历史委托
       ,getProjects: ['/project/getProjects','GET'] //项目列表
       ,maxPurchase: ['/oauth-resource/maxPurchase'] //最大购买量
       ,depth: ['/mktdata/depth'] //深度行情
       ,klines: ['/mktdata/klines', 'GET'] //K线图
       ,order: ['/exchange/oauth-resource/order'] //用户交易
       ,deleteOrder: ['/exchange/oauth-resource/deleteOrder'] //用户撤单
  })
  .constant('$iosApi', {

  })
  .factory('$androidApi',function(){
    if(window['mainweb']){
      return {
      }
    }else{
      return {};
    }

  })
}());
