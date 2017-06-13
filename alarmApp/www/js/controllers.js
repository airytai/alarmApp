angular.module('AlarmApp.controllers', [])
    .controller('AlarmCtrl', function($scope, $ionicPopup, Alarm, $rootScope,
     $cordovaLocalNotification, $ionicPlatform, Utils){

        $ionicPlatform.ready(function () {
            if (ionic.Platform.isWebView()) {
                $rootScope.alarmList = {};
                    if(localStorage.getItem('alarmList') != null){
                        $rootScope.alarmList = angular.fromJson(localStorage.getItem('alarmList'));
                    }
                    $scope.alarm = {};
                    $scope.addAlarm = function(){
                        console.log("You hit add");
                        
                        var alarmPopup = $ionicPopup.confirm({
                            title: 'Create Alarm',
                            template: '<textarea ng-model="alarm.content" placeHolder="Task" style="resize:none;"></textarea><input type="datetime-local" ng-model="alarm.time"></input>',
                            scope: $scope
                        });

                        alarmPopup.then(function(res){
                            if(res){
                                $scope.alarm.id = ((new Date($scope.alarm.time)).getTime()) /1000;
                                // unix_seconds of the alarm time is its id
                                var alarm = (new Alarm()).addAlarm($scope.alarm.id, $scope.alarm.time, $scope.alarm.content);
                                $rootScope.alarmList[$scope.alarm.id] = alarm;
                                localStorage.setItem('alarmList', angular.toJson($rootScope.alarmList));
                                $scope.registerAlarm();
                                
                            }else{
                                // alert("You cancel");
                            }
                        })
                    }

                    // Test Code
                    // $scope.scheduleNotificationFiveSecondsFromNow = function () {
                    //     var now = new Date().getTime();
                    //     var _5SecondsFromNow = new Date(now + 10000);


                    //     $cordovaLocalNotification.schedule({
                    //         id: 2,
                    //         at: _5SecondsFromNow,
                    //         text: 'Notification After 5 Seconds Has Been Triggered',
                    //         title: 'After 5 Seconds'
                    //     }).then(function () {
                    //         alert("Notification After 5 seconds set");
                    //     });
                    // };

                    $scope.registerAlarm = function(){
                        // localnotif only work when a device is used
                        var alarmTime = new Date($scope.alarm.time);

                        $cordovaLocalNotification.schedule({
                            id: $scope.alarm.id,
                            title: 'Alarm',
                            text: $scope.alarm.content,
                            at: alarmTime,
                            data: {}
                        }).then(function(result) {
                            // alert('a local notification is triggered');
                        });
                    };

                    $scope.clearAlarm = function(){
                        localStorage.removeItem('alarmList');
                        $rootScope.alarmList = null;
                    }
            }
        })

        
    });