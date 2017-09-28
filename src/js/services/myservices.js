/**
 * Created by ling on 16/12/5.
 */

var dataServer = angular.module("app.server",[]);

//dataServer.factory("dataServer",["$q",function($q){
//    var dataServer = {};
//    dataServer.user= new model.UserInfo();
//    return dataServer;
//}]);


//获取数据
dataServer.factory('passData', ['$http', '$q', 'baseConfig', function ($http, $q, baseConfig) {

    var httpGet = function (url, data) {
        var defered = $q.defer();
        console.log(defered);
        $http({
            method: 'GET',
            url: baseConfig.baseUrl + url,
            params: data,
            timeout:15000,
        }).success(function (data) {
            defered.resolve(data);
        }).error(
            function (data,status,headers,config,statusText) {
                if (statusText == 'timeout') {
                    alert('请求超时');
                } else {
                    alert('请求错误('+status+')');
                }
                defered.reject(data);
            });
        return defered.promise;
    };

    var httpPost = function(url,data){
        var defered = $q.defer();
        $http({
            method: 'POST',
            url: baseConfig.baseUrl + url,
            timeout:15000,
            data:data
        }).success(function (data) {
            defered.resolve(data);
        }).error(
            function (data,status,headers,config,statusText) {
                if (statusText > 'timeout') {
                    alert('请求超过15s');
                } else {
                    alert('请求错误('+status+')');
                }
                defered.reject(data);
            });
        return defered.promise;
    }

    return {
        'httpGet': httpGet,
        'httpPost':httpPost
    }

}]);

//获取任务列表
dataServer.factory('getTask',['passData',function(passData){

    var taskList = function(params){
        var url = '/api/EventOrder/Orders';
        return passData.httpGet(url,params);
    };
    var taskDetail = function(params){
        var url = 'api/EventOrder/OrderDetail';
        return passData.httpGet(url,params);
    };
    var track = function(params){
        var url = 'api/EventOrder/track';
        return passData.httpGet(url,params);
    };

    var modify = function(params){
        var url = 'api/EventOrder/modifyCarTime';
        return passData.httpGet(url,params);
    };
    var operationList = function(params){
        var url = 'api/EventOrder/orderOperation';
        return passData.httpGet(url,params);
    };
    var historyGpsList = function(params){
        var url = 'api/EventOrder/queryHistoryGps';
        return passData.httpGet(url,params);
    };
    var openApiLogList = function(params){
        var url = 'api/OpenApiLog/QueryOpenApiLog';
        return passData.httpGet(url,params);
    };
    return {
        'taskList':taskList,
        'taskDetail':taskDetail,
        'operationList':operationList,
        'track':track,
        'modify':modify,
        'historyGpsList':historyGpsList,
        'openApiLogList':openApiLogList
    }
}]);

/*时间操作*/
dataServer.factory('dateOperation',function(){
    /*日期格式化函数 转string*/
    var dateformat = function (date,fmt) {
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
    return {
        dateformat: dateformat
    }
});

