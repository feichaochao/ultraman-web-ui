/**
 * Created by Administrator on 2017/6/23.
 */
var feedBackApp= angular.module('feedBackApp',['app.server']);

feedBackApp.controller('feedBackController',['$scope','$state','passData','$modal',"dateOperation",function($scope,$state,passData,$modal,dateOperation){
    //初始化请求参数


    $scope.feedBackClick = function(){
        $scope.params = {
            mobile:$scope.mobile,
            pageNo: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }
        passData.httpGet('api/feedBack/query',$scope.params)
            .then(function(data){
                if(data.success){
                    $scope.feedbackList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                    for(var item in data.result.data){
                        console.log(item);
                        if(data.result.data[item].createTime){
                            data.result.data[item].createTime =dateOperation.dateformat(new Date(data.result.data[item].createTime),'yyyy-MM-dd hh:mm:ss')
                        }
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
            $scope.feedBackClick();
        }
    };
    $scope.feedBackClick();

    $scope.show = function(){

        var paramsObj = {

        }

        var modalInstance = $modal.open({
            templateUrl : 'modify.html',
            controller : 'ModalCtrl', // specify controller for modal
            resolve : {
                paramsObj:function(){
                    return paramsObj;
                }
            }
        });
        // modal return result
        modalInstance.result.then(function(data) {
            $scope.paramsObj = data;
            $scope.showloading = true;

        });
    }



}])

feedBackApp.controller('ModalCtrl',['$scope','$modalInstance','paramsObj',function($scope, $modalInstance, paramsObj) {
    $scope.paramsObj = paramsObj;
    $scope.ok = function() {
        $modalInstance.close($scope.paramsObj);
        // if(!$scope.paramsObj.operateReason){
        //     alert('修改原因必填');
        //     return;
        // }else{
        //     $modalInstance.close($scope.paramsObj);
        // }
    };
    // cancel click
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
}]);
