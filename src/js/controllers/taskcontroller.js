/**
 * Created by ling on 16/12/6.
 */

var taskCtrl = angular.module('task.controller',['app.server']);

taskCtrl.controller("taskController",["$scope","$state","getTask",'$stateParams',"dateOperation","$modalStack",function($scope,$state,getTask,$stateParams,dateOperation) {

    $scope.params = {
        // carBrand: sessionStorage.getItem("carBrand") == null ? '' : sessionStorage.getItem("carBrand"),
        // mobilePhone: sessionStorage.getItem("mobilePhone") == null ? '' : sessionStorage.getItem("mobilePhone"),
        // entName: sessionStorage.getItem("entName") == null ? '' : sessionStorage.getItem("entName"),
        // code: sessionStorage.getItem("code") == null ? '' : sessionStorage.getItem("code"),
        carBrand: '',
        mobilePhone: $stateParams.mobile == null ? '':$stateParams.mobile,
        entName: '',
        code: '',
        personId:'',
        pageNo: 1,
        pageSize: 10
    };


    $scope.paginationConf = {
        currentPage: sessionStorage.getItem("pageNo")==null ? 1:sessionStorage.getItem("pageNo"),
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            $scope.params.pageNo = $scope.paginationConf.currentPage;
            $scope.params.pageSize = $scope.paginationConf.itemsPerPage;
            getList($scope.params);
        }
    };




    $scope.showloading = false;

    var getList = function(params){
        $scope.showloading = true;
        console.log('显示');
        getTask.taskList(params).then(function(data){
            $scope.showloading = false;
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    for(var item in data.result.data){
                        console.log(item);
                        if(data.result.data[item].createTime){
                            data.result.data[item].createTime =dateOperation.dateformat(new Date(data.result.data[item].createTime),'yyyy-MM-dd hh:mm:ss')
                        }
                    }
                    $scope.taskList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                    // sessionStorage.clear();
                    sessionStorage.setItem("taskList", JSON.stringify($scope.taskList));
                    sessionStorage.setItem("totalItems", $scope.paginationConf.totalItems);
                    // sessionStorage.setItem("carBrand",$scope.params.carBrand);
                    // sessionStorage.setItem("mobilePhone",$scope.params.mobilePhone);
                    // sessionStorage.setItem("entName",$scope.params.entName);
                    // sessionStorage.setItem("code",$scope.params.code);
                    sessionStorage.setItem("pageNo",$scope.params.pageNo);

                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }
        },function(error){
            console.log('隐藏');
            $scope.showloading = false;
        });
    };

    console.log('显示手机参数'+ $scope.params.mobilePhone);
    console.log('显示手机参数'+ $stateParams.mobile);
    if($stateParams.mobile != null) {
        $scope.paginationConf.currentPage = 1;
        getList($scope.params);
    }else {
        $scope.taskList = sessionStorage.getItem("taskList") == null ? [] : JSON.parse(sessionStorage.getItem("taskList"));
        if (sessionStorage.getItem("totalItems") != null) {
            $scope.paginationConf.totalItems = sessionStorage.getItem("totalItems");
        }
    }

    $scope.filter = function(){

        if(!$scope.params.carBrand && !$scope.params.mobilePhone && !$scope.params.entName && !$scope.params.code&& !$scope.params.personId){
            alert('请输入任意一个搜索条件，点击搜索');
            return ;
        }else{
            $scope.paginationConf.currentPage = 1;
            getList($scope.params);

        }
    }

    $scope.jumpTo = function(eventId,keyId,personId){
        sessionStorage.setItem("trackPersonId", personId);
        $state.go('detail',{eventId:eventId,personId:keyId});
    }





}]);

taskCtrl.controller('taskDetailController', ['$scope',"$state","getTask","$modal","$log","getTask",function ($scope,$state,getTask,$modal,$log,getTask) {
    var params = {
        eventId:$state.params['eventId'],
        personId:$state.params['personId']
    };
    $scope.detailList = [];
    $scope.showloading = true;
    var getDetail = function(params){
        console.log('显示');
        getTask.taskDetail(params).then(function(data){
            $scope.showloading = false;
            console.log('隐藏');
            if(data.success){
                if(data.result.length!=0){
                    $scope.detailList =  data.result;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }
        },function(error){
            $scope.showloading = false;
            console.log(error);
        });
    };
    getDetail(params);

    $scope.showModify = function(eventId,eventType){
            var title = eventType==0?'修改发车时间':eventType==7?'修改到达时间':'';
            var paramsObj = {
                eventId:eventId,
                eventType:eventType,
                title:title,
                modifyTime:'',
                operateReason:''
            }

            var modalInstance = $modal.open({
                templateUrl : 'myModelContent.html',
                controller : 'ModalInstanceCtrl', // specify controller for modal
                resolve : {
                    paramsObj:function(){
                        return paramsObj;
                    }
                }
            });
            // modal return result
            modalInstance.result.then(function(data) {
                $scope.paramsObj = data;
                $scope.modifyParams = {
                    spaceId:data.eventId,
                    currentTime:data.modifyTime,
                    operateReason:data.operateReason
                };
                $scope.showloading = true;
                console.log("修改发车到达的参数:"+$scope.modifyParams);
                getTask.modify($scope.modifyParams).then(function(data){
                    $scope.showloading = false;
                    if(data.success){
                        alert('修改成功');
                        window.location.reload();
                    }else{
                        if(data.warnMessage.length!=0){
                            alert(data.warnMessage);
                        }else{
                            alert(data.error);
                        }
                    }

                },function(){
                    $scope.showloading = false;
                });

            }, function() {
                $log.info('Modal dismissed at: ' + new Date())
            });
    }
    $scope.jumpToTrack= function(id,personId,startTime,endTime,finishTime){
        sessionStorage.setItem("trackStartTime", startTime);
        if(finishTime!=null && finishTime > startTime){
            sessionStorage.setItem("trackEndTime", finishTime);
        }else {
            sessionStorage.setItem("trackEndTime", endTime);
        }
        sessionStorage.setItem("spaceId",id);
        $state.go('track',{eventId:id});
}

}]);
taskCtrl.controller('trackController', ['$scope','getTask','$state',function ($scope,getTask,$state) {
    var params = {
        spaceId:$state.params['eventId'],
        pageNo:1,
        pageSize:10
    }

    $scope.trackList = [];
    $scope.showloading = true;
    var getList = function(params) {
        console.log('显示');
        getTask.track(params).then(function(data){
            $scope.showloading = false;
            console.log('隐藏');
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    $scope.trackList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }


        },function(error){
            $scope.showloading = false;
            console.log(error);
        })
    };
    getList(params);

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            params.pageNo = $scope.paginationConf.currentPage;
            params.pageSize = $scope.paginationConf.itemsPerPage;
            getList(params);
        }
    };
    $scope.jumpToGps= function(){
        $state.go('trackGps');
    }
}]);

taskCtrl.controller('operationController', ['$scope','getTask','$state',function ($scope,getTask,$state) {
    var params = {
        spaceId:$state.params['eventid'],
        pageNo:1,
        pageSize:10
    }
    $scope.operationList = [];
    $scope.showloading = true;
    var getList = function(params) {
        console.log('显示');
        getTask.operationList(params).then(function(data){
            $scope.showloading = false;
            console.log('隐藏');
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    $scope.operationList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }


        },function(error){
            $scope.showloading = false;
            console.log(error);
        })
    };
    getList(params);

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            params.pageNo = $scope.paginationConf.currentPage;
            params.pageSize = $scope.paginationConf.itemsPerPage;
            getList(params);
        }
    };
}]);

taskCtrl.controller('ModalInstanceCtrl',['$scope','$modalInstance','paramsObj',function($scope, $modalInstance, paramsObj) {
    $scope.paramsObj = paramsObj;
    $scope.ok = function() {
        if(!$scope.paramsObj.operateReason){
            alert('修改原因必填');
            return;
        }else{
            $modalInstance.close($scope.paramsObj);
        }
    };
    // cancel click
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
}]);


taskCtrl.controller('historyGpsController',["$scope","$state","getTask","$modalStack",function($scope,$state,getTask,dateOperation) {

    $scope.params = {
        mobilePhone: sessionStorage.getItem("historyMobilePhone") == null ? '' : sessionStorage.getItem("historyMobilePhone"),
        startTime: sessionStorage.getItem("startTime") == null ? '' : sessionStorage.getItem("startTime"),
        endTime: sessionStorage.getItem("endTime") == null ? '' : sessionStorage.getItem("endTime"),
        pageNo: 1,
        pageSize: 10
    };

    $scope.paginationConf = {
        currentPage: sessionStorage.getItem("hPageNo")==null ? 1:sessionStorage.getItem("hPageNo"),
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            $scope.params.pageNo = $scope.paginationConf.currentPage;
            $scope.params.pageSize = $scope.paginationConf.itemsPerPage;
            getList($scope.params);
        }
    };

    $scope.historyGpsList = sessionStorage.getItem("historyGpsList") == null ? [] : JSON.parse(sessionStorage.getItem("historyGpsList"));
    if (sessionStorage.getItem("total")!=null) {
        $scope.paginationConf.totalItems =sessionStorage.getItem("total");
    }

    $scope.showloading = false;

    var getList = function(params){
        $scope.showloading = true;
        console.log('显示');
        getTask.historyGpsList(params).then(function(data){
            $scope.showloading = false;
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    $scope.historyGpsList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                    // sessionStorage.clear();
                    sessionStorage.setItem("historyGpsList", JSON.stringify($scope.historyGpsList));
                    sessionStorage.setItem("historyMobilePhone",$scope.params.mobilePhone);
                    sessionStorage.setItem("startTime",$scope.params.startTime);
                    sessionStorage.setItem("endTime",$scope.params.endTime);
                    sessionStorage.setItem("hPageNo",$scope.params.pageNo);
                    sessionStorage.setItem("total", $scope.paginationConf.totalItems);

                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }
        },function(error){
            console.log('隐藏');
            $scope.showloading = false;
        });
    };

    $scope.historyFilter = function(){

        if(!$scope.params.startTime && !$scope.params.mobilePhone && !$scope.params.endTime){
            alert('请输入任意一个搜索条件，点击搜索');
            return ;
        }else{
            console.log("history参数"+$scope.params.startTime+","+$scope.params.endTime);
            $scope.paginationConf.currentPage = 1;
            getList($scope.params);

        }
    }



}]);



taskCtrl.controller('trackGpsController',["$scope","$state","getTask","$modalStack",function($scope,$state,getTask,dateOperation) {

    $scope.params = {
        spaceId:sessionStorage.getItem("spaceId")==null? '':sessionStorage.getItem("spaceId"),
        personId: sessionStorage.getItem("trackPersonId")==null? '':sessionStorage.getItem("trackPersonId"),
        startTime: sessionStorage.getItem("trackStartTime")==null? '':sessionStorage.getItem("trackStartTime"),
        endTime: sessionStorage.getItem("trackEndTime")==null? '':sessionStorage.getItem("trackEndTime"),
        pageNo: 1,
        pageSize: 10
    };

    console.log('显示轨迹参数'+$scope.params);
    $scope.paginationConf = {
        currentPage:  1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            $scope.params.pageNo = $scope.paginationConf.currentPage;
            $scope.params.pageSize = $scope.paginationConf.itemsPerPage;
            getList($scope.params);
        }
    };

    $scope.historyGpsList = [];
    $scope.paginationConf.totalItems='';
    $scope.showloading = false;

    var getList = function(params){
        $scope.showloading = true;
        console.log('显示轨迹参数'+params);
        getTask.historyGpsList(params).then(function(data){
            $scope.showloading = false;
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    $scope.historyGpsList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }
        },function(error){
            console.log('隐藏');
            $scope.showloading = false;
        });
    };
    getList($scope.params);

}]);

taskCtrl.controller('openApiController',["$scope","$state","getTask","$modalStack",function($scope,$state,getTask,dateOperation) {

    $scope.params = {
        tag:  'ztoCompany',
        type:  '0',
        contidion:  '',
        pageNo: 1,
        pageSize: 10
    };

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            $scope.params.pageNo = $scope.paginationConf.currentPage;
            $scope.params.pageSize = $scope.paginationConf.itemsPerPage;
            getList($scope.params);
        }
    };


    $scope.showloading = false;

    var getList = function(params){
        $scope.openApiLogList = [];
        $scope.showloading = true;
        console.log('显示');
        getTask.openApiLogList(params).then(function(data){
            $scope.showloading = false;
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    $scope.openApiLogList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }
        },function(error){
            console.log('隐藏');
            $scope.showloading = false;
        });
    };

    $scope.openFilter = function(){

        if(!$scope.params.tag && !$scope.params.type && !$scope.params.contidion){
            alert('请输入任意一个搜索条件，点击搜索');
            return ;
        }else{
            console.log("openApi参数"+$scope.params.tag+","+$scope.params.type+","+$scope.params.contidion);
            $scope.paginationConf.currentPage = 1;
            getList($scope.params);

        }
    }



}]);