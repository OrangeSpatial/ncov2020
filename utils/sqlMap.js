// sql语句
var sqlMap = {
  areaInfo: {
      // 添加信息
      add: 'insert into ncov values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      // 查询所有信息
      queryAll: 'select * from ncov',
      // 按照小区名称查询
      queryByAreaName: 'select * from ncov where residentialAreaName = ?',
      // 查询各区的确诊人数
      queryByDistrict: 'select areaName, sum(confirmed) as sum_confirmed from ncov group by areaName',
      // 查询所有小区名
      queryAllAreaName: 'select residentialAreaName from ncov',
      // queryAllAreaName: 'select residentialAreaName from ncov where 1 or (residentialAreaName like "%"?"%"?"%")',
      // 更新信息
      update: 'UPDATE ncov SET updateTime = ?,confirmed = ?,suspected = ?,fever = ?, cured= ?, dead = ?, closed= ? WHERE residentialAreaName = ?',
      // backup 信息
      backupInfo: 'insert into ncov_bak values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      // 添加武汉信息
      addWH: 'insert into ncov_wh(confirmed,cured,dead,updateTime,suspected) values (?, ?, ?, ?, ?)',
      // 查询武汉所有
      // queryWHById: 'select * from ncov_wh where id = ?',
      queryWHById: 'select * from ncov_wh order by id desc limit 0,1',
      queryMaxId: 'select max(id) from ncov_wh'
  }
}

module.exports = sqlMap;