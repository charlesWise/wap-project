/**
 * 产品模块控制器
 * @return {[type]} [description]
 */
(function(){
	'use strict';

	angular.module('wjswap.controllers')
	.controller('StockListCtrl',function($api,$scope){
		$api.product({},function(json){
			if(json.code == 200){
				$scope.list = json.data.data;
			}
		})
	})
	.controller('StockDetailCtrl',function(){
	})
}());