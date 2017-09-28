/**
 * Created by ling on 16/12/6.
 */
var appDire = angular.module('app.directive',[]);

/*分页插件*/
appDire.directive("myPagination",[function(){
    return {
        restrict: 'EA',
        template: '<div><div class="page-list">' +
        '<ul class="pagination" ng-show="conf.totalItems > 0">' +
        '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span style="cursor: pointer">&laquo;</span></li>' +
        '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
        'ng-click="changeCurrentPage(item)" style="cursor: pointer">' +
        '<span>{{ item }}</span>' +
        '</li>' +
        '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span style="cursor: pointer">&raquo;</span></li>' +
        '</ul>' +
        '<div class="page-total" ng-show="conf.totalItems > 0">' +
        '第<input type="text" ng-model="jumpPageNum" class="form-control pages" ng-keyup="jumpToPage($event)"/>页 ' +
        '每页<select ng-model="conf.itemsPerPage" ng-options="option for option in conf.perPageOptions " class="form-control selWrp"></select>' +
        '/共<strong>{{ conf.totalItems }}</strong>条' +
        '</div>'+
        '</div>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs){
            // 变更当前页
            scope.changeCurrentPage = function(item) {
                if(item == '...'){
                    return;
                }else{
                    scope.conf.currentPage = item;
                }
            };
            // 定义分页的长度必须为奇数 (default:9)
            scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9 ;
            if(scope.conf.pagesLength % 2 === 0){
                // 如果不是奇数的时候处理一下
                scope.conf.pagesLength = scope.conf.pagesLength -1;
            }
            // conf.erPageOptions
            if(!scope.conf.perPageOptions){
                scope.conf.perPageOptions = [10, 15, 20, 30, 40, 50];
            }
            // pageList数组
            function getPagination(newValue, oldValue) {
                // conf.currentPage
                scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;
                // conf.totalItems
                scope.conf.totalItems = parseInt(scope.conf.totalItems) ? parseInt(scope.conf.totalItems) : 0;
                // conf.itemsPerPage (default:15)
                scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 10;
                // numberOfPages
                scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems/scope.conf.itemsPerPage);
                // judge currentPage > scope.numberOfPages
                if(scope.conf.currentPage < 1){
                    scope.conf.currentPage = 1;
                }
                // 如果分页总数>0，并且当前页大于分页总数
                if(scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages){
                    scope.conf.currentPage = scope.conf.numberOfPages;
                }
                // jumpPageNum
                scope.jumpPageNum = scope.conf.currentPage;
                // 对选项进行sort
                scope.conf.perPageOptions.sort(function(a, b){return a-b});
                scope.pageList = [];
                if(scope.conf.numberOfPages <= scope.conf.pagesLength){
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for(i =1; i <= scope.conf.numberOfPages; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = (scope.conf.pagesLength - 1)/2;
                    if(scope.conf.currentPage <= offset){
                        // 左边没有...
                        for(i =1; i <= offset +1; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else if(scope.conf.currentPage > scope.conf.numberOfPages - offset){
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = offset + 1; i >= 1; i--){
                            scope.pageList.push(scope.conf.numberOfPages - i);
                        }
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else{
                        // 最后一种情况，两边都有...
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = Math.ceil(offset/2) ; i >= 1; i--){
                            scope.pageList.push(scope.conf.currentPage - i);
                        }
                        scope.pageList.push(scope.conf.currentPage);
                        for(i = 1; i <= offset/2; i++){
                            scope.pageList.push(scope.conf.currentPage + i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }
                }
                if(scope.conf.onChange){
                    var ok=oldValue.split(" ");
                    var nk=newValue.split(" ");
                    // 防止初始化两次请求问题
                    if(oldValue[0]!=0&&ok[0]==nk[0]&&ok[1]!=nk[1]) {
                        scope.conf.onChange();
                    }
                }
                scope.$parent.conf = scope.conf;
            }
            // prevPage
            scope.prevPage = function(){
                if(scope.conf.currentPage > 1){
                    scope.conf.currentPage -= 1;
                }
            };
            // nextPage
            scope.nextPage = function(){
                if(scope.conf.currentPage < scope.conf.numberOfPages){
                    scope.conf.currentPage += 1;
                }
            };
            // 跳转页
            scope.jumpToPage = function(){
                var jumpto = '';
                jumpto = scope.jumpPageNum.replace(/[^0-9]/g,'');
                if(jumpto !== ''){
                    scope.conf.currentPage = scope.jumpPageNum = jumpto;
                }
            };
            scope.$watch(function() {
                if(!scope.conf.totalItems) {
                    scope.conf.totalItems = 0;
                }
                var newValue = scope.conf.totalItems + ' ' +  scope.conf.currentPage + ' ' + scope.conf.itemsPerPage;
                return newValue;
            }, getPagination);
        }
    };
}]);
/*日期插件*/
appDire.directive('ngTime', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        scope:{
            datetype:'@datetype',
            format:'@format',
            defaulttime:'='
        },
        link: function ($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            console.log($scope.defaulttime);

            var options = {
                locale: {
                    "format": $scope.format,
                    "applyLabel": "应用",
                    "cancelLabel": "取消",
                    "customRangeLabel": "Custom",
                    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                    "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                },
                autoUpdateInput:false,
                timePicker:true,
                timePicker24Hour:true,
                timePickerSeconds: true,
                showDropdowns: true
            };
            if($scope.datetype==0){
                options.singleDatePicker = true
            }
            if($scope.defaulttime){
                options.startDate = $scope.defaulttime;
            }

            $element.daterangepicker(options);
            $element.on('apply.daterangepicker', function(ev, picker) {
                //$ngModel.$setViewValue(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
                $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
                $('#eventEndTime').val(picker.endDate.format('YYYY-MM-DD HH:mm:ss'))
                //$scope.$parent.paramsObj.modifyTime = picker.startDate.format('YYYY-MM-DD HH:mm:ss');
                if($scope.datetype==0) {
                    $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
                    $scope.$parent.paramsObj.modifyTime = picker.startDate.format('YYYY-MM-DD HH:mm:ss');
                }else{
                    $('#historyStartTime').val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
                    $('#historyEndTime').val(picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
                    $scope.$parent.params.startTime=picker.startDate.format('YYYY-MM-DD HH:mm:ss');
                    $scope.$parent.params.endTime=picker.endDate.format('YYYY-MM-DD HH:mm:ss');
                }

            });
            $element.on('cancel.daterangepicker', function(ev, picker) {
                console.log('数据');
                $(this).val('');
                $('#eventEndTime').val('')
                //$scope.$parent.paramsObj.modifyTime = '';
                //$ngModel.$setViewValue('');
            });
        },
    };
});
/*loading 指令*/

appDire.directive('loading',function(){
    return{
        restrict:'E',
        templateUrl:'./views/template/loading.html',
        replace:true,
        scope:{
            defaultshow:'='
        },
        link:function($scope, $element, $attrs){
        }
    }
})

