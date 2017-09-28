/**
 * Created by ling on 17/1/24.
 */
//新建一个module
var myApp = angular.module("myApp", ["ui.bootstrap","ui.router","task.controller","feedBackApp","smsApp","pushApp","app.directive","app.server"]);

myApp.config(["$httpProvider",function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.transformRequest = [function(data) {
        var param = function(obj) {
            var query = '';
            var name,value,fullSubName,subName,subValue,innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];
}]);
//全局配置
myApp.constant('baseConfig', {
    "baseUrl": window.location.origin+"/"
});

//基本配置
myApp.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.when('/index', ['$state','dataServer', function ($state,dataServer) {
        $state.go('eventOrder');
        var userid = util.CookieHelper.getCookie('loginuserid');
        //
        //console.log('dfdf');
        //console.log('获取用户信gulp息');
        //if(userid){
        //    $state.go('main');
        //}else{
        //    $state.go('assign.login');
        //}
    }]).otherwise('/eventOrder');
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: './views/main.html',
        controller:'taskController'
    }).state('detail',{
        url:'/detail/:eventId/:personId',
        templateUrl:'./views/detail.html',
        controller:'taskDetailController'
    }).state('track',{
        url:'/track/:eventId',
        templateUrl:'./views/track.html',
        controller:'trackController'
    }).state('operation',{
        url:'/operation/:eventid',
        templateUrl:'./views/operation.html',
        controller:'operationController'
    }).state('eventOrder', {
        url: '/eventOrder',
        templateUrl: './views/eventOrder.html',
        controller:'taskController'
    }).state('historyGps',{
        url:'/historyGps',
        templateUrl:'./views/historyGps.html',
        controller:'historyGpsController'
    }).state('trackGps',{
        url:'/trackGps',
        templateUrl:'./views/trackGps.html',
        controller:'trackGpsController'
    }).state('openApi',{
        url:'/openApi',
        templateUrl:'./views/openApiLog.html',
        controller:'openApiController'
    }).state('smslist',{
        url:'/smslist',
        templateUrl:'./views/smsList.html',
        controller:'smslistController'
    }).state('smsStateList',{
        url:'/smsStateList',
        templateUrl:'./views/smsStateList.html',
        controller:'smsStateListController'
    }).state('pushList',{
        url:'/pushList',
        templateUrl:'./views/pushList.html',
        controller:'pushlistController'
    }).state('pushStateList',{
        url:'/pushStateList?id',
        templateUrl:'./views/pushStateList.html',
        controller:'pushStateListController'
    }).state('feedBack',{
        url:'/feedBack',
        templateUrl:'./views/feedBack.html',
        controller:'feedBackController'
    }).state('toEventOrder', {
            url: '/toEventOrder?mobile',
            templateUrl: './views/eventOrder.html',
            controller:'taskController'
    }).state('toSmslist',{
        url:'/toSmslist?mobile',
        templateUrl:'./views/smsList.html',
        controller:'smslistController'
    })
}]);
myApp.run(function () {
    console.log('开始运行');
});
