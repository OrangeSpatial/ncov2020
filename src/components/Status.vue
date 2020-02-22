<template>
  <div class="m-status">
      <h2 style="margin:0">武汉疫情</h2>
      <div class="m-flex" style="color:gray">
        <p>
          更新时间
          <span>{{ updateTime }}</span>
        </p>
        <span @click="centerDialogVisible = true">
          <i class="el-icon-warning-outline"></i> 数据说明
        </span>
      </div>
      <!-- 说明 -->
      <el-dialog
      title="数据说明"
        :visible.sync="centerDialogVisible"
        width="60%"
        center>
        <div class="m-state">
          <h3>1. 数据来源</h3>
          <span>来自卫健委数据和大众录入。大众录入数据是根据小区公布公告录入，
            部分数据来自 <b>武汉突发</b>、<b>中北路</b>、<b>风云武汉</b> 微信公众号。
          </span>
          <h3>2. 数据声明</h3>
          <span>
            由于数据是大众自发上传录入，不能保证完全符合实际，使用产生的后果本人不承担后果。如有疑问请联系
            liyongcheng@whu.edu.cn
          </span>
        </div>
      </el-dialog>

    <div class="m-dataStatus">
      <el-row :gutter="10">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <div class="m-align">
            <h2 class="red">{{ dataStatus.confirmed }}</h2>
            <p>累计确诊</p>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <div class="m-align">
            <h2 class="green">{{ dataStatus.convalescent }}</h2>
            <p>累计治愈</p>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <div class="m-align">
            <h2 class="gray">{{ dataStatus.dead }}</h2>
            <p>累计死亡</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <baidu-map class="m-mapStatus" id="map" center='武汉' :zoom='zoom' @ready='handler'></baidu-map> -->
    <div class="m-mapStatus" id="map1"></div>
    <h2>武汉各区疫情</h2>
    <el-divider></el-divider>
    <div class="m-mapStatus" id="map2"></div>
    <el-divider></el-divider>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import bmap from 'echarts/extension/bmap/bmap.js'
import BMap from 'BMap'
// import $ from 'jquery'
import echarts from 'echarts'
import mapStyle from '@/assets/mapStyle.json'
import wuhan from '@/assets/wuhan.json'

export default {
  data () {
    return {
      centerDialogVisible: false,
      updateTime: '2020.2.14 12:00',
      dataStatus: {
        confirmed: 0,
        suspected: 0,
        convalescent: 0,
        dead: 0
      },
      // 武汉市各区数据
      datalist: [
        { name: '蔡甸区', value: 0 },
        { name: '东西湖区', value: 0 },
        { name: '汉南区', value: 0 },
        { name: '汉阳区', value: 0 },
        { name: '洪山区', value: 0 },
        { name: '黄陂区', value: 0 },
        { name: '江岸区', value: 0 },
        { name: '江汉区', value: 0 },
        { name: '江夏区', value: 0 },
        { name: '硚口区', value: 0 },
        { name: '青山区', value: 0 },
        { name: '武昌区', value: 0 },
        { name: '新洲区', value: 0 }
      ],
      styleJson: null,
      geoCoordMap: {
      },
      statusData: [
      ]

    }
  },
  created () {
    // this.getMapStyleJson()
    this.downLoadAllData()
    this.downLoadDistrictData()
  },
  methods: {
    showWHdata () {
      var that = this
      that.$http.post('/api/queryWHInfo').then((res) => {
        // console.log(res.data.data)
        const element = res.data.data[0]
        that.dataStatus.confirmed = element.confirmed
        that.dataStatus.convalescent = element.cured
        that.dataStatus.dead = element.dead
        that.updateTime = element.updateTime
      })
    },
    downLoadDistrictData () {
      var that = this
      that.$http.get('/api/queryByDistrict').then((res) => {
        // console.log(res.data.data)
        const array = res.data.data
        for (let index = 0; index < that.datalist.length; index++) {
          for (let i = 0; i < array.length; i++) {
            const element = array[i]
            if (that.datalist[index].name === element.areaName) {
              that.datalist[index].value = element.sum_confirmed
            }
          }
        }
        // console.log(that.datalist)
        that.datashouWH()
      })
    },
    downLoadAllData () {
      var that = this
      that.$http.get('/api/queryAll').then((res) => {
        // console.log(res.data.data)
        const array = res.data.data
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          const tempobj = { name: element.residentialName, value: element.confirmed }
          that.geoCoordMap[element.residentialName] = [element.lng, element.lat]
          that.statusData[index] = tempobj
          // console.log(that.geoCoordMap)
          // console.log(that.statusData)
        }
        that.bmapFn()
      })
    },
    // 测试echarts
    initEcharts () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('chart1'))
      // 绘制图表
      myChart.setOption({
        title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    },
    // axios读取本地json
    getMapStyleJson () {
      var that = this
      // console.log(mapStyle)
      this.$http
        .get('/api/mapStyle.json')
        .then(function (res) {
          // console.log(res)
          that.styleJson = res.data
        })
      // console.log(that.styleJson)
    },
    // echarts 扩展 bmap整合
    bmapFn () {
      var that = this
      var mapChart = this.$echarts.init(document.getElementById('map2'))
      var convertData = function (data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var geoCoord = that.geoCoordMap[data[i].name]
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            })
          }
        }
        return res
      }
      // $.get(mapStyle, function (_styleJson) {
      mapChart.setOption({
        // title: {
        //   text: '地图s'
        // },
        tooltip: {
          trigger: 'item',
          // backgroundColor: 'transparent'
          formatter: function (params) {
            // console.log(params)// 打印断点，会看到自己想要的后台数据
            var res = '<div>' + params.name + '<br/>' + params.seriesName + ' : ' + params.value[2] + '</div>'
            // [
            //   // '{a|' + params.seriesName + '}',
            //   '{b|' + params.seriesName + ' : ' + params.value[2] + '}'
            //   // '{c|' + params.name + ' : ' + params.value[2] + '}',
            // ].join('\n')
            return res
          },
          rich: {
            a: {
              fontSize: 14
            },
            b: {
              backgroundColor: {
                image: 'xxx/xxx.jpg'
              },
              height: 40
            },
            c: {
              fontSize: 18,
              fontFamily: 'Microsoft YaHei',
              borderColor: '#449933',
              borderRadius: 4
            }
          }
        },
        bmap: {
          center: [114.307807, 30.599423], // 中心位置坐标
          zoom: 10, // 地图缩放比例
          roam: true, // 开启用户缩放
          // enableBizAuthLogo: false,
          mapStyle: {
            styleJson: mapStyle
          }
        },
        series: [
          {
            name: '确诊病例',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: convertData(that.statusData),
            symbolSize: function (val) {
              return val[2] / 5
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            itemStyle: {
              color: 'red'
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            name: '确诊病例',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: convertData(that.statusData.sort(function (a, b) {
              return b.value - a.value
            }).slice(0, 6)),
            symbolSize: function (val) {
              // console.log(val)
              return val[2] / 5
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            itemStyle: {
              color: 'red',
              shadowBlur: 10,
              shadowColor: '#333'
            },
            zlevel: 1
          }
        ]
      })
      // })
    },
    // 百度地图获取边界 有bug
    getBoundary () {
      var bdary = new BMap.Boundary()
      bdary.get('武汉', function (rs) {
        // bmap.clearOverlays() // 清除地图覆盖物
        var count = rs.boundaries.length // 行政区域的点有多少个
        if (count === 0) {
          alert('未能获取当前输入行政区域')
          return
        }
        var pointArray = []
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeColor: '#00a75b',
            strokeWeight: 2,
            strokeOpacity: 1,
            fillColor: '#00a75b',
            fillOpacity: 0.15,
            strokeStyle: 'solid',
            enableClicking: !1
          }) // 建立多边形覆盖物
          bmap.addOverlay(ply) // 添加覆盖物
          pointArray = pointArray.concat(ply.getPath())
        }
        bmap.setViewport(pointArray) // 调整视野
      })
    },
    // echarts 展示武汉市区域确诊患者疫情
    datashouWH () {
      var that = this
      // 初始化echarts
      const myChart = this.$echarts.init(document.getElementById('map1'))
      // 加载图表
      myChart.showLoading()
      // json中读取存储 各区县名
      var cityname = []
      // console.log(that.datalist)
      // 显示数据
      // that.datalist = [
      //   { name: '蔡甸区', value: 122 },
      //   { name: '东西湖区', value: 132 },
      //   { name: '汉南区', value: 112 },
      //   { name: '汉阳区', value: 32 },
      //   { name: '洪山区', value: 45 },
      //   { name: '黄陂区', value: 123 },
      //   { name: '江岸区', value: 145 },
      //   { name: '江汉区', value: 45 },
      //   { name: '江夏区', value: 152 },
      //   { name: '硚口区', value: 62 },
      //   { name: '青山区', value: 78 },
      //   { name: '武昌区', value: 342 },
      //   { name: '新洲区', value: 43 }
      // ]
      // 根据geoJson数据 加载注册地图
      // $.get('@/assets/wuhan.json', function (whJson) {
      // 注册图名
      var Mname = 'wuhan'
      // 隐藏加载
      myChart.hideLoading()
      // console.log(wuhan)
      // 注册
      echarts.registerMap(Mname, wuhan)
      // 读取各区要素
      var mapFeatures = echarts.getMap(Mname).geoJson.features
      // console.log('==========mapFeatures==============')
      // console.log(mapFeatures)
      // 读取区县名称
      mapFeatures.forEach(function (v) {
        // 地区名称
        var name = v.properties.name
        cityname.push(name)
      })
      // console.log(cityname)
      // echarts 选项
      // eslint-disable-next-line no-unused-vars
      var option = null
      // 地图可视化显示
      myChart.setOption(
        (option = {
          // backgroundColor: '#021926',
          title: {
            // text: '2020年2月1日全国新型冠状病毒确诊情况',
            left: 'center'
          },
          visualMap: {
            show: true,
            type: 'piecewise',
            pieces: [
              {
                min: 1000,
                max: 5000
              }, // 不指定 max，表示 max 为无限大（Infinity）。
              {
                min: 500,
                max: 1000
              },
              {
                min: 100,
                max: 500
              },
              {
                min: 20,
                max: 100
              },
              {
                min: 1,
                max: 20
              }
              // {min:0,max: 2000},
              // {max:100}// 不指定 min，表示 min 为无限大（-Infinity）。
            ],
            showLabel: true,
            right: '15%',
            bottom: '20%',
            // top: 'bottom',
            text: ['确诊病例'], // 文本，默认为数值文本
            calculable: true,
            inRange: {
              color: ['#F6CED8', '#D90505'] // 蓝红
            }
          },
          tooltip: {
            triggerOn: 'click',
            formatter: function (e, t, n) {
              return e.value === 0.5
                ? e.name + '：有确诊病例'
                : e.seriesName + '<br />' + e.name + '：' + e.value
            }
          },
          toolbox: {
            show: true
            // feature: {
            //   dataView: {
            //     readOnly: false
            //   },
            //   restore: {},
            //   saveAsImage: {
            //     pixelRatio: 4
            //   }
            // }
          },
          series: [
            {
              name: '确诊病例',
              type: 'map',
              map: Mname,
              // mapType: Mname,
              zoom: 1.2,
              // center: [114.313961, 30.349045],
              scaleLimit: { // 滚轮缩放的极限控制
                min: 1,
                max: 2.5
              },
              emphasis: {
                itemStyle: {
                  label: {
                    normal: {
                      show: true
                    }
                  },
                  areaColor: '#89ddff'
                }
              },
              roam: true,
              data: that.datalist
            }
          ]
        })
      )
      // })
      // if (option && typeof option === 'object') {
      //   myChart.setOption(option, true)
      // }
    }
  },
  mounted () {
    // this.initEcharts()
    this.bmapFn()
    // this.getMapStyleJson()
    this.datashouWH()
    this.showWHdata()
  }
}
</script>

<style lang="less" scoped>
.m-status {
  height: 100%;
  .m-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2,
    p {
      display: inline;
    }
  }
  .m-dataStatus {
    border-radius: 10px;
    background-color: rgb(242, 253, 253);
    .m-align {
      text-align: center;
      .red {
        color: rgb(255, 0, 98);
      }
      .green {
        color: rgb(2, 184, 99);
      }
      .gray {
        color: rgb(58, 52, 54);
      }
    }
  }
  .m-mapStatus {
    margin-top: 10px;
    width: 100%;
    height: 700px;
  }
  .el-dialog__header{
    height: 40px;
    font-size: 30px;
    line-height: 30px;
    background-color: #0cbfd6;
  }
  .m-state{
    background-color: #fbeffc;
    padding: 15px;
    border-radius: 8px;
  }
}
</style>
