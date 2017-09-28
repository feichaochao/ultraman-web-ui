/**
 * Created by Administrator on 2017/6/23.
 */
var smsApp = angular.module('smsApp',['app.server']);

smsApp.controller('smslistController',['$scope','$state','passData','$stateParams',function($scope,$state,passData,$stateParams){
    //初始化请求参数
    console.log("message phone start:"+$stateParams.mobile)

    $scope.searchClick = function(){
        $scope.params = {
            mobile:$stateParams.mobile == null ? '':$stateParams.mobile,
            startTime:$('#eventStartTime').val(),
            endTime:$('#eventEndTime').val(),
            pageNo: 1,
            pageSize: 10
        }
        if($scope.mobilePhone != null){
            $scope.params.mobile = $scope.mobilePhone;
        }
        console.log("message phone"+$stateParams.mobile)
        console.log("message phone2"+$scope.params.mobile)
        passData.httpPost('api/PushSms/SmsTaskFind',$scope.params)
        .then(function(data){
                if(data.success){
                    $scope.smsList = data.result.data
                    console.log($scope.smsList)
                }
            })
    }
    if($stateParams.mobile != null) {
        console.log("进入查询短信")
        $scope.searchClick();
    }
    $scope.paginationConf = {
        currentPage:  1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            $scope.params.pageNo = $scope.paginationConf.currentPage;
            $scope.params.pageSize = $scope.paginationConf.itemsPerPage;
            $scope.searchClick()
        }
    };
}])
smsApp.controller('smsStateListController',['$scope','$state','passData',function($scope,$state,passData){
    $scope.searchClick = function(){
        //初始化请求参数
        $scope.params = {
            mobile:$scope.mobilePhone,
            startTime:$('#eventStartTime').val(),
            endTime:$('#eventEndTime').val(),
            pageNo: 1,
            pageSize: 10
        }
        passData.httpPost('api/PushSms/SmsMessageFind',$scope.params)
            .then(function(data){
                if(data.success){
                    $scope.smsStateList = data.result.data
                    for(var i=0;i<$scope.smsStateList.length;i++){
                        var createMouth = new Date($scope.smsStateList[i].createTime).getMonth()+1;
                        $scope.smsStateList[i].createTime = new Date($scope.smsStateList[i].createTime).getFullYear()+'-'+createMouth+'-'+new Date($scope.smsStateList[i].createTime).getDate()+' '+new Date($scope.smsStateList[i].createTime).getHours()+':'+new Date($scope.smsStateList[i].createTime).getMinutes()
                    }
                }
            })
    }
    $scope.paginationConf = {
        currentPage:  1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            $scope.params.pageNo = $scope.paginationConf.currentPage;
            $scope.params.pageSize = $scope.paginationConf.itemsPerPage;
            $scope.searchClick()
        }
    };
}])