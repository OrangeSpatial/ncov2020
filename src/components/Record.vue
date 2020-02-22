<template>
  <div class="m-status">
    <h2 style="margin:0">信息录入</h2>
    <el-divider></el-divider>
    <el-row :gutter="10">
      <el-col :xs="6" :sm="6" :md="8" :lg="8" :xl="8" class="m-col">
        <!-- 输入框 -->
        <el-form ref="ncovFormRef" label-width="115px" :model="ncovForm" :rules="ncov_rules">
          <el-form-item label="小区名称/地址" prop="residentialAreaName">
            <el-input id="suggestId" v-model="ncovForm.residentialAreaName"></el-input>
            <div v-html='searchResult' style="border:1px solid #C0C0C0;height:auto; display:none;"></div>
          </el-form-item>
          <el-form-item label="小区/居委会名" prop="areaName">
            <el-input v-model="ncovForm.areaName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="lng">
            <el-input v-model="ncovForm.lng" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="ncovForm.lat" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="数据通告时间" prop="updateTime">
            <el-date-picker
              v-model="ncovForm.updateTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions"
              default-time="12:00:00"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="确诊病例" prop="confirmed">
            <el-input v-model="ncovForm.confirmed"></el-input>
          </el-form-item>
          <el-form-item label="疑似病例" prop="suspected">
            <el-input v-model="ncovForm.suspected"></el-input>
          </el-form-item>
          <el-form-item label="发热病例" prop="fever">
            <el-input v-model="ncovForm.fever"></el-input>
          </el-form-item>
          <el-form-item label="治愈病例" prop="cured">
            <el-input v-model="ncovForm.cured"></el-input>
          </el-form-item>
          <el-form-item label="死亡病例" prop="dead">
            <el-input v-model="ncovForm.dead"></el-input>
          </el-form-item>
          <el-form-item label="密接人员" prop="closed">
            <el-input v-model="ncovForm.closed"></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="btns">
          <el-button @click="submitForm()" type="primary">提交</el-button>
          <el-button @click="resetFrom()" type="info">重置</el-button>
        </div>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16" class="m-col grayBorder">
        <!-- 地图模块 -->
        <div class="m-mapStatus" id="map2"></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import bmap from 'echarts/extension/bmap/bmap.js'
import BMap from 'BMap'
// import $ from 'jquery'

export default {
  data () {
    return {
      bmap: null,
      bmapCenter: [114.307807, 30.599423],
      imgList: [{ patientP: require('../assets/patient.png') }],
      updateTime: '2020.2.14 12:00',
      ncovForm: {
        residentialAreaName: '',
        areaName: '',
        lng: 0,
        lat: 0,
        updateTime: '',
        confirmed: 0,
        suspected: 0,
        fever: 0,
        cured: 0,
        dead: 0,
        closed: 0
      },
      ncov_rules: {
        residentialAreaName: [
          { required: true, message: '此项不能为空！', trigger: 'blur' }
        ],
        areaName: [{ required: true, message: '此项不能为空！', trigger: 'blur' }],
        lng: [{ required: true, message: '此项不能为空！', trigger: 'blur' }],
        lat: [{ required: true, message: '此项不能为空！', trigger: 'blur' }],
        updateTime: [
          { required: true, message: '此项不能为空！', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      searchResult: '',
      isExist: false,
      tempAreaName: '',
      tempResult: null
    }
  },
  created () {
    // this.getMapStyleJson()
  },
  methods: {
    // 百度地图api创建地图
    CreateBbmap () {
      var map = new BMap.Map('map2') // 创建地图实例
      this.bmap = map
      var point = new BMap.Point(this.bmapCenter[0], this.bmapCenter[1]) // 创建点坐标
      map.centerAndZoom(point, 15) // 初始化地图，设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      map.disableBizAuthLogo() // 关闭
      // eslint-disable-next-line no-undef
      var opts = { type: BMAP_NAVIGATION_CONTROL_SMALL }
      map.addControl(new BMap.NavigationControl(opts))
      map.setMapStyleV2({
        styleId: '269d912467e80623e4c71d48824c1be3'
      })
    },
    addMarker (point, index) {
      // 创建图标对象
      var that = this
      var map = that.bmap
      // that.imgList[0].patientP
      // console.log(that.imgList[0].patientP)
      var myIcon = new BMap.Icon(
        'http://lbsyun.baidu.com/jsdemo/img/fox.gif',
        new BMap.Size(230, 150),
        {
          // 指定定位位置。
          // 当标注显示在地图上时，其所指向的地理位置距离图标左上
          // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
          // 图标中央下端的尖角位置。
          anchor: new BMap.Size(10, 25),
          // 设置图片偏移。
          // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
          // 需要指定大图的偏移位置，此做法与css sprites技术类似。
          imageOffset: new BMap.Size(0, 0 - index * 25) // 设置图片偏移
        }
      )
      // 创建标注对象并添加到地图
      var marker = new BMap.Marker(point, { icon: myIcon })
      map.addOverlay(marker)
      // console.log('添加marker000')
    },
    addDataMaker () {
      // var map = this.bmap
      const that = this
      // console.dir(map)
      // console.log('添加marker')
      var point = new BMap.Point(this.bmapCenter[0], this.bmapCenter[1])
      that.addMarker(point, 0)
    },
    addInfoWin () {
      var map = this.bmap
      var dataInfo = [
        [
          116.417854,
          39.921988,
          '地址：北京市东城区王府井大街88号乐天银泰百货八层'
        ],
        [116.406605, 39.921585, '地址：北京市东城区东华门大街'],
        [116.412222, 39.912345, '地址：北京市东城区正义路甲5号']
      ]
      var opts = {
        width: 250, // 信息窗口宽度
        height: 80, // 信息窗口高度
        title: '信息窗口', // 信息窗口标题 html
        enableMessage: true // 设置允许信息窗发送短息
      }
      for (var i = 0; i < dataInfo.length; i++) {
        var marker = new BMap.Marker(
          new BMap.Point(dataInfo[i][0], dataInfo[i][1])
        ) // 创建标注
        var content = dataInfo[i][2]
        map.addOverlay(marker) // 将标注添加到地图中
        addClickHandler(content, marker)
      }
      function addClickHandler (content, marker) {
        marker.addEventListener('click', function (e) {
          openInfo(content, e)
        })
      }
      function openInfo (content, e) {
        var p = e.target
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
        var infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point) // 开启信息窗口
      }
    },
    getAddrByIput () {
      var that = this
      var map = this.bmap
      // console.log(map)
      var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
        {
          input: 'suggestId',
          location: map
        })

      ac.addEventListener('onhighlight', function (e) { // 鼠标放在下拉列表上的事件
        var str = ''
        var _value = e.fromitem.value
        var value = ''
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
        that.searchResult = str
      })

      var myValue
      ac.addEventListener('onconfirm', function (e) { // 鼠标点击下拉列表后的事件
        var _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        that.searchResult = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
        // console.log(myValue)
        that.ncovForm.residentialAreaName = myValue
        // 小区名
        that.ncovForm.areaName = _value.district
        // 判断是否存在该小区的信息
        that.$http.post('/api/queryByAreaName', that.ncovForm).then((res) => {
          // console.log(res.data.data)
          if (res.data.data.length > 0) {
            that.tempResult = res.data.data[0]
            that.isExist = true
          } else {
            that.isExist = false
          }
        })
        // console.log(res)
        setPlace()
      })

      function setPlace () {
        map.clearOverlays() // 清除地图上所有覆盖物
        function myFun () {
          var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          // console.log(pp.lng)
          // console.log(pp.lat)
          that.ncovForm.lng = pp.lng
          that.ncovForm.lat = pp.lat
          map.centerAndZoom(pp, 18)
          map.addOverlay(new BMap.Marker(pp)) // 添加标注
        }
        // console.dir('==============')
        var local = new BMap.LocalSearch(map, { // 智能搜索
          onSearchComplete: myFun
        })
        local.search(myValue)
      }
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
    submitForm () {
      var that = this
      that.$refs.ncovFormRef.validate(async valid => {
        if (!valid) return
        // console.log(that.isExist)
        // console.log(that.tempResult)
        if (that.tempAreaName === that.ncovForm.residentialAreaName) {
          return that.$message.error('该地区已录入，如需修改，请再次输入选择！')
        }
        if (!that.isExist) {
          const res = await that.$http.post('/api/addInfo', that.ncovForm)
          if (res.data.code !== 200) return that.$message.error('录入失败！稍后重试')
          that.$message.success('录入成功！')
          // 存储上次输入值
          that.tempAreaName = that.ncovForm.residentialAreaName
          that.resetFrom()
        } else {
          var params = new URLSearchParams()
          params.append('residentialAreaName', that.tempResult.residentialAreaName)
          params.append('areaName', that.tempResult.areaName)
          params.append('residentialName', that.tempResult.residentialName)
          params.append('lng', that.tempResult.lng)
          params.append('lat', that.tempResult.lat)
          params.append('updateTime', that.tempResult.updateTime)
          params.append('confirmed', that.tempResult.confirmed)
          params.append('suspected', that.tempResult.suspected)
          params.append('fever', that.tempResult.fever)
          params.append('cured', that.tempResult.cured)
          params.append('dead', that.tempResult.dead)
          params.append('closed', that.tempResult.closed)
          that.$http({
            method: 'post',
            url: '/api/backupInfo',
            data: params
          }).then((res) => {
            if (res.data.code === 200) {
              that.$http.post('/api/update', that.ncovForm).then((Ures) => {
                if (Ures.data.code !== 200) return that.$message.error('更新失败！稍后重试')
                that.$message.success('更新成功！')
              })
            }
          })
        }
      })
    },
    resetFrom () {
      this.$refs.ncovFormRef.resetFields()
    }
  },
  mounted () {
    this.CreateBbmap()
    // this.addDataMaker()
    this.getAddrByIput()
  }
}
</script>

<style lang="less" scoped>
.m-status {
  height: 100%;
}

.m-mapStatus {
    border-radius: 10px;
    border: 1 solid gray;
    width: 100%;
    height: 700px;
    margin-bottom: 10px;
  }
.grayBorder{
  border: 1 solid gray;
}

  .btns{
  display: flex;
  float: right;
  position: relative;
  top: -10%;
  margin: 0 20px 20px;
}

  @media screen and (max-width: 768px){
    .m-col{
      width: 100%;
    }
  }
</style>
