module.exports = {
  configureWebpack: {
    externals: {
      BMap: 'BMap'
    }
  },
  devServer: {
    open: true, // 是否自动弹出浏览器页面
    host: '0.0.0.0',
    port: '8003',
    https: false, // 是否使用https协议
    hotOnly: false, // 是否开启热更新
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // API服务器的地址
        ws: true, // 代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/api': ''
        }
      }
    }
  }
  // devServer: {
  //   proxy: { // 设置代理
  //     '/api': {
  //       target: 'http://127.0.0.1:3000', // 请求的目标服务器接口
  //       changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
  //       pathRewrite: { // 重写请求
  //         '^/api': '/api' // 替换target中的请求地址，也就是说在请求http://127.0.0.1:8888/XXXXX这个地址的时候直接写成/api即可。
  //       }
  //     }
  //   },
  //   host: '127.0.0.1',
  //   port: 8080
  // }
}
