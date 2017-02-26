/**
 * @module wjswap.filters
 * @requires ionic
 * @requires wjswap.config
 * @description
 * filter 模块功能:<br>
 *
 */
(function () {
  'use strict';

  var filters = angular.module('wjswap.filters', [])
    .filter('transferFormat', function () {
      return function (side) {
        if(side == 'SELL'){
          return '卖';
        }else if(side == 'BUY'){
          return '买';
        }else{
          return '';
        }
      };
    })
    .filter('productStatus', function () {
      return function (status) {
        if(status == 'NEW'){
          return '未成交';
        }else if(status == 'PARTIALLY_FILLED'){
          return '部分成交';
        }else if(status == 'REJECTED'){
          return '已拒绝';
        }else if(status == '已取消'){
          return 'CANCELED';
        }else if(status == 'FILLED'){
          return '全部成交';
        }else if(status == 'EXPIRED'){
          return '已过期';
        }else{
          return status;
        }
      };
    })
}());
