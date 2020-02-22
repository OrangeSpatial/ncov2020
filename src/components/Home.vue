<template>
  <div class="home">
    <el-row>
      <el-col :xs="0" :sm="3" :md="4" :lg="3" :xl="2"><div class="m-side hidden-sm-and-down"></div></el-col>
      <el-col :xs="24" :sm="18" :md="16" :lg="18" :xl="20">
        <!-- 头部 -->
        <div class="m-title">
          <el-col :xs="12" :sm="10" :md="10" :lg="10" :xl="10">
              <img src="../assets/logo.png" style="height:220px" alt="">
          </el-col>
          <el-col :xs="12" :sm="14" :md="14" :lg="14" :xl="14">
            <p class="m-textHeight">武汉疫情大众平台</p>
          </el-col>
        </div>
        <!-- 主体内容 -->
        <div class="m-content">
          <el-menu :default-active="activeIndex"
          text-color='#aaaaaa'
          active-text-color='#0cbfd6'
          class="el-menu-demo"
          mode="horizontal"
          router
          >
            <el-menu-item @click="saveNavState('/ncov2020/status')" index="/ncov2020/status">疫情动态</el-menu-item>
            <el-menu-item @click="saveNavState('/ncov2020/record')" index="/ncov2020/record">我要录入</el-menu-item>
          </el-menu>
          <div class="m-margin">
            <router-view/>
          </div>
        </div>
      </el-col>
      <el-col :xs="0" :sm="3" :md="4" :lg="3" :xl="2"><div class="m-side hidden-sm-and-down"></div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    return {
      activeIndex: '/ncov2020/status'
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>

.home {
  height: 100%;
  .el-row{
    height: 100%;
    .el-col{
    height: 100%;
    .m-side{
      border-radius: 10px;
      background-color: #42b983;
    }
    .m-title{
      background-color: #0cbfd6;
      height: 200px;
      .m-textHeight{
        color: #fff;
        font-weight: bold;
        font-size: 40px;
        padding-top: 20px;
      }
    }
    .m-content{
      background-color: white;
      // height: 100%;
      border-radius: 10px;
      box-shadow: 0 5px 30px #aaa;
      .el-menu{
        border-radius: 10px;
        .el-menu-item{
          border-radius: 20px 20px 0 0;
          width: 50%;
          text-align: center;
          font-size: 20px;
        }
      }
      .m-margin{
        margin: 20px;
      }
    }
    }
  }
}
</style>
