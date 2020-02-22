const express = require('express');
const badyParser = require('body-parser');
const router = express.Router();
const uuidv1 = require('uuid/v1');

const DBHelper = require('../utils/DBHelper');
const sql = require('../utils/sqlMap');

let app = express();
app.use(badyParser.json());
app.use(badyParser.urlencoded({
    extended: false
}));

// 查询所有
router.get('/queryAll', (req, res) => {
    let sqlStr = sql.areaInfo.queryAll;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
        }
    });
    conn.end();
});

// 按照小区名查询
router.post('/queryByAreaName', (req, res) => {
    let sqlStr = sql.areaInfo.queryByAreaName;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr,[params.residentialAreaName], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
            // console.log(result.length)
        }
    });
    conn.end();
});

// 按照县区名称查询
// { name: '蔡甸区', value: 122 },
// { name: '东西湖区', value: 132 },
// { name: '汉南区', value: 112 },
// { name: '汉阳区', value: 32 },
// { name: '洪山区', value: 45 },
// { name: '黄陂区', value: 123 },
// { name: '江岸区', value: 145 },
// { name: '江汉区', value: 45 },
// { name: '江夏区', value: 152 },
// { name: '硚口区', value: 62 },
// { name: '青山区', value: 78 },
// { name: '武昌区', value: 342 },
// { name: '新洲区', value: 43 }

router.get('/queryByDistrict', (req, res) => {
    let sqlStr = sql.areaInfo.queryByDistrict;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
            // console.log(result.length)
        }
    });
    conn.end();
});

// 小区名查询
router.post('/queryAllAreaName', (req, res) => {
    let sqlStr = sql.areaInfo.queryAllAreaName;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
            // console.log(result.length)
        }
    });
    conn.end();
});



// // 更新数据
// router.post('/updateInfo', (req, res) => {
//     // 按照小区名查询语句
//     let queryByNameSql = sql.areaInfo.queryByAreaName;
//     let params = req.body;
//     let conn = new DBHelper().getConn();
//     // 查询
//     conn.query(queryByNameSql, [params.residentialAreaName], (queryErr, queryResult) => {
//         if (queryErr) {
//             res.json(queryErr);
//         } else {
//             console.log('开始备份')
//             queryResult = JSON.parse(JSON.stringify(queryResult));
//             if (queryResult.length === 1) {
//                 // 备份
//                 let insertResult = backupInfo(queryResult);
//                 console.dir("bafen=====")
//                 console.dir(insertResult)
//                 if (insertResult !== null) {
//                     console.log('开始更新')
//                     let updateResult = upadteInfo(params);
//                     console.log('更新结束')
//                     res.send({
//                         code: 200,
//                         data: updateResult
//                     });
//                 }
//             }
//         }
//     });
//     conn.end();
// });

// 增加信息
router.post('/addInfo', (req, res) => {
    let uuid = uuidv1();
    let sqlStr = sql.areaInfo.add;
    let params = req.body;
    let conn = new DBHelper().getConn();
    let firstIndex = params.residentialAreaName.indexOf('区')
    let residentialName = params.residentialAreaName.substr(firstIndex+1)
    conn.query(sqlStr, [uuid, params.residentialAreaName, params.areaName, residentialName, params.lng, params.lat, params.updateTime,params.confirmed,params.suspected,params.fever,params.cured,params.dead,params.closed], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
        }
    });
    conn.end();
});

// 备份信息
router.post('/backupInfo', (req, res) => {
    let uuid = uuidv1();
    let sqlStr = sql.areaInfo.backupInfo;
    let params = req.body;
    let conn = new DBHelper().getConn();
    let firstIndex = params.residentialAreaName.indexOf('区')
    let residentialName = params.residentialAreaName.substr(firstIndex+1)
    conn.query(sqlStr, [
        uuid, 
        params.residentialAreaName, 
        params.areaName, 
        params.residentialName, 
        params.lng, 
        params.lat, 
        params.updateTime,
        params.confirmed,
        params.suspected,
        params.fever,
        params.cured,
        params.dead,
        params.closed
    ], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
        }
    });
    conn.end();
});

// 更新信息
router.post('/update', (req, res) => {
    let sqlStr = sql.areaInfo.update;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [ 
        params.updateTime,
        params.confirmed,
        params.suspected,
        params.fever,
        params.cured,
        params.dead,
        params.closed,
        params.residentialAreaName
    ], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
        }
    });
    conn.end();
});

let id =0;

// 查询武汉市总体疫情
router.post('/queryWHInfo', (req, res) => {
    let sqlStr = sql.areaInfo.queryWHById;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, id, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
        }
    });
    conn.end();
});


function queryMaxIdWH(){
    let sqlStr = sql.areaInfo.queryMaxId;
    let conn = new DBHelper().getConn();
    let query = conn.query(sqlStr);
    query.on('result', function(row){
        row = JSON.parse(JSON.stringify(row));
        console.log('========kkk=====')
        id = row['max(id)']
        console.log(id)
    })
    conn.end();
}

// 增加武汉市总体疫情
router.post('/addWHInfo', (req, res) => {
    let sqlStr = sql.areaInfo.addWH;
    let params = req.body;
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [params.confirmed, params.cured, params.dead, params.updateTime,params.suspected], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                code: 200,
                data: result
            });
        }
    });
    conn.end();
});



module.exports = router;