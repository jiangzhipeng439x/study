|-- ts-vue
    |-- .browserslistrc     # browserslistrc 配置文件 (用于支持 Autoprefixer)
    |-- .eslintrc.js        # eslint 配置
    |-- .gitignore
    |-- babel.config.js     # babel-loader 配置
    |-- package-lock.json
    |-- package.json        # package.json 依赖
    |-- postcss.config.js   # postcss 配置
    |-- README.md
    |-- tsconfig.json       # typescript 配置
    |-- vue.config.js       # vue-cli 配置
    |-- public              # 静态资源 (会被直接复制)
    |   |-- favicon.ico     # favicon图标
    |   |-- index.html      # html模板
    |-- src
    |   |-- App.vue         # 入口页面
    |   |-- main.ts         # 入口文件 加载组件 初始化等
    |   |-- shims-tsx.d.ts
    |   |-- shims-vue.d.ts
    |   |-- assets          # 主题 字体等静态资源 (由 webpack 处理加载)
    |   |-- components      # 全局组件
    |   |-- router          # 路由
    |   |-- store           # 全局 vuex store
    |   |-- styles          # 全局样式
    |   |-- views           # 所有页面
    |-- tests               # 测试