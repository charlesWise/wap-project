(function(){
  "use strict";
  /**
   * mockjs 拦截请求返回的数据集合
   * 详细模板规则请参考 [mockjs](http://mockjs.com/)
   */
  var d = window.MockData = {
    userInfo: {
      'status': 1,
      'data': {
        'uname': '@name()',
        'age|1-100': 100,
        'color': '@color'
      }
    },
    isLogin: {
      boolen: "1",
      data: {is_login: 0},
      error_code: "",
      message: "请求成功",
      require_login: "0" // 未登录可进
    },
    pdetail: {
      boolen: "1",
      message: "",
      data: {
        prj_id: "60",
        prj_name: "使用满减券标",
        prj_no: "1A2015122700002",
        rate: "18.00",
        rate_symbol: "%",
        rate_type: "年",
        rate_display: "18.00%年",
        time_limit: "7天",
        time_limit_num: "7",
        time_limit_unit: "天",
        repay_way: "到期还本付息",
        addcredit: "第三方担保",
        guarantor: "sdfsdfsdf服务有限公司",
        invest_count: "1",
        is_pre_sale: "0",
        is_auto_start: "0",
        is_extend: "0",
        guarantor_num: 1,
        safeguard: "100%本息保障",
        safety_guarantee_tip: "yu盾风控审核",
        value_date: "1",
        value_date_display: "成交日次日计息，项目到期后当日24:00前回款",
        demand_amount: "3,000.00 元",
        schedule: "67",
        remaining_amount: "1,000.00",
        start_bid_time_diff: 1039241,
        end_bid_time_diff: 1125041,
        repay_time: "2016-01-04",
        is_early: "",
        publish_inst: "投融谱华",
        product: "",
        money_using: "资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途资金用途",
        repay_origin: "还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源还款来源",
        addcredit_desc: "sdfsdfsdf服务有限公司为本次融资提供担保。",
        is_biding: false,
        year_rate: "18.00",
        min_bid_amount: "1,000.00",
        max_bid_amount: "2,000.00",
        bid_status: "7",
        bid_status_display: "投资结束",
        is_balance_less: "0",
        step_bid_amount: 100,
        prj_type: "A",
        prj_type_display: "稳赢序列",
        prj_business_type_name: "股权贷",
        is_limit_amount: "1",
        is_transfer: "0",
        is_have_repay_plan: "1",
        min_bid_amount_raw: "1000",
        max_bid_amount_raw: "2000",
        reward_money_rate: "",
        activity_id: 0,
        activity_tips: [ ],
        wanyuan_profit: 3945,
        wanyuan_profit_view: "39.45"
      }
    },
    prjBaseInfo: {
      boolen: "1",
      message: "",
      data: {
        base_info: [
          {
            k: "项目总额",
            v: "1.00 万"
          },
          {
            k: "起息时间",
            v: "投资后一日"
          },
          {
            k: "可以提前结束投资",
            v: "是"
          }
        ],
        extension: [
          {
            k: "资金用途及回款来源",
            v: [
              {
                k: "资金用途",
                v: "asdfasdf"
              },
              {
                k: "回款来源",
                v: "asdfaqsdf"
              }
            ]
          }
        ],
        prj_attribute_tips: "本项目为融资方收益权转让项目",
        borrower: [
          {
            k: "出让人信息",
            v: [
              {
                k: "企业名称",
                v: "fa*df"
              },
              {
                k: "销售规模(年)",
                v: "200亿"
              },
              {
                k: "信用记录",
                v: "正常"
              }
            ]
          }
        ],
        fund_info: [
          {
            k: "收益权产品信息",
            v: [
              {
                k: "基金名称",
                v: "基金名称"
              },
              {
                k: "基金类型",
                v: "股票基金"
              },
              {
                k: "基金成立时间",
                v: "2015-12-12"
              },
              {
                k: "基金规模",
                v: "100"
              },
              {
                k: "基金管理理人",
                v: "星星"
              },
              {
                k: "基金托管人",
                v: "狒狒"
              },
              {
                k: "基金经理",
                v: "孙悟空"
              },
              {
                k: "投资目标",
                v: "这里应该是个很长的东西"
              }
            ]
          }
        ]
      }
    }
  };

  /**
   * @global
   * @description
   * mock 拦截规则: 拦截地址应与 services 模块里的apiMap(接口列表)一一对应
   */
  window.MockBlockMap = {
    userInfo: d.userInfo,
    isLogin: d.isLogin,
    pdetail: d.pdetail,
    prjBaseInfo: d.prjBaseInfo
  };
}());
