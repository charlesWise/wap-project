
### 1. 项目部署

进入项目根目录，执行

    $ npm install

在nginx配置mime.types文件中最后一行加上

    text/cache-manifest                   manifest;

最后在nginx配置文件中将root设为项目的www目录。

### 2.目录树

    .
    ├── README.md 项目说明文件
    ├── node_modules npm模块
    ├── package.json 项目描述及npm依赖配置
    ├── scripts 构建项目的一些脚本
    ├── source 项目目录 nginx配置改目录为root
    │   ├── config.rb 用于编译sass文件的compass的配置文件
    │   ├──  css 编译好的css
    │   │   └── common.css
    │   ├── index.html 开发模式下的入口文件
    │   ├── js
    │   │   ├── app.js 
    │   │   ├── config.api.js api配置文件
    │   │   ├── config.js 配置文件
    │   │   ├── controllers 控制器文件夹
    │   │   ├── directives 指令文件夹
    │   │   ├── routers 路由文件夹
    │   │   └── services 公共服务文件夹
    │   ├── lib 外部依赖库文件夹
    │   │   ├── angular
    │   │   ├── ...
    │   ├── scss scss文件夹
    │   │   ├── base scss框架基础文件
    │   │   │   ├── _base.scss
    │   │   │   ├── _icons.scss
    │   │   │   ├── _variable.scss
    │   │   │   └── _wap_mixin.scss
    │   │   ├── common.scss 把page文件夹中的业务scss文件import进来的文件
    │   │   ├── page 具体页面的scss文件
    │   │   └── sassCore scss工具包
    │   ├── templates 模板文件夹
