/**
 * Created by Administrator on 2017/6/23.
 */
var pushApp = angular.module('pushApp',['app.server']);

pushApp.controller('pushlistController',['$scope','$state','passData',function($scope,$state,passData){
    //初始化请求参数
    $scope.searchClick = function(){
        $scope.params = {
            mobile:$scope.mobilePhone,
            startTime:$('#eventStartTime').val(),
            endTime:$('#eventEndTime').val(),
            pageNo: 1,
            pageSize: 10
        }
        passData.httpPost('api/PushSms/PushTaskFind',$scope.params)
            .then(function(data){
                if(data.success){
                    $scope.pushList = data.result.data
                    for(var i=0;i<$scope.pushList.length;i++){
                        var createMouth = new Date($scope.pushList[i].createTime).getMonth()+1;
                        $scope.pushList[i].createTime = new Date($scope.pushList[i].createTime).getFullYear()+'-'+createMouth+'-'+new Date($scope.pushList[i].createTime).getDate()+' '+new Date($scope.pushList[i].createTime).getHours()+':'+new Date($scope.pushList[i].createTime).getMinutes()
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
    $scope.goDetail = function(id){
        $state.go('pushStateList',{id:id})
    }
}])
pushApp.controller('pushStateListController',['$scope','$state','passData','$stateParams',function($scope,$state,passData,$stateParams){
    //初始化请求参数
    $scope.params = {
        id:$stateParams.id,
    }
    $scope.pushStateList = []
    function checkTime(time){
        time = parseInt(time)
        if(time<10){
            return '0'+time
        } else{
            return time
        }
    }
    passData.httpPost('api/PushSms/PushDetail',$scope.params)
        .then(function(data){
            if(data.success){
                var time = new Date(data.result.createTime)
                var timeMouth = time.getMinutes()+1
                data.result.createTime = time.getFullYear()+'-'+checkTime(timeMouth)+'-'+checkTime(time.getDate())+' '+checkTime(time.getHours())+':'+checkTime(time.getMinutes())+':'+checkTime(time.getSeconds())
                $scope.pushStateList.push(data.result)
            }
        })
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
    document.cookie = 'name=Jack';
}])