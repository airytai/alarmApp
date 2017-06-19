angular.module('AlarmApp.controllers', [])
    
    .controller('LoginCtrl', function($scope, Server, $state, $ionicHistory){
        
            console.log("LoginCtrl is ready.");
            
            $scope.user = [];

            $scope.login = function(){
                console.log($scope.user.username+ " " + $scope.user.password);
                
                if($scope.user.username == null || $scope.user.password == null ||
                   $scope.user.username == "" || $scope.user.password == "")
                {
                    document.getElementById("error-msg").innerHTML = "請輸入賬號和密碼！";
                    return;
                }
                
                Server.login($scope.user.username, $scope.user.password).then(function(response){
                    if(response.status == 200)
                    {
                        console.log("login status 200");
                        if(response.data == "true")
                        {
                            $ionicHistory.nextViewOptions({
                                disableAnimate: false,
                                disableBack: true,
                                historyRoot: true
                            });
                            $state.go('home');
                        }
                        else
                        {
                            document.getElementById("error-msg").innerHTML = "賬號與密碼不相符！";
                        }
                    }
                    else
                    {
                        alert("連接失敗，請檢查網絡設置後重試");
                    }
                });
            }

            $scope.forgetPassword = function()
            {
                $state.go('forgetPassword');
            }

            $scope.register = function()
            {
                $state.go('register');
            }
    })
    
    .controller('RegisterCtrl', function($scope, Server, $ionicHistory){
        console.log("RegisterCtrl is ready");

        $scope.register = [];

        $scope.register = function(){
            console.log($scope.register.username + " " + $scope.register.email);

            if($scope.register.username == null || $scope.register.email == null ||
               $scope.register.username == "" || $scope.register.email == "")
               {
                   document.getElementById("error-msg").innerHTML = "請輸入賬號和正確的電郵地址！";
                   return;
               }

            Server.register($scope.register.username, $scope.register.email).then(function(response){
                console.log(JSON.stringify(response));
                if(response.status == 200)
                {
                    console.log("register status 200");
                    // return -1 if the substring is not exist
                    var response_string = response.data;
                    var error_catcher = response_string.search("account name exists");
                    if(response_string < 0)
                    {
                        document.getElementById("error-msg").innerHTML = "註冊成功！登錄密碼將發送到你的郵箱！";
                        setTimeout(function()
                        { 
                            $ionicHistory.goBack();
                        }, 5000);
                    }
                    else
                    {
                        document.getElementById("error-msg").innerHTML = "註冊失敗！用戶名或電郵地址已存在！";
                    }
                }
                else
                {
                    alert("連接失敗，請檢查網絡設置後重試");
                }
            })
        }
    })

    .controller('ForgetPasswordCtrl', function($scope, Server, $ionicHistory){
        
        console.log("ForgetPasswordCtrl is ready");

        $scope.user = [];

        $scope.forgetPassword = function(){
            
            if($scope.user.email == null || $scope.user.email == "")
            {
                document.getElementById("error-msg").innerHTML = "請輸入電郵地址！";
                return;
            }

            Server.forgetPassword($scope.user.email).then(function(response){
                console.log(JSON.stringify(response));
                if(response.state == 200)
                {
                    console.log("register status 200");
                    if(response.data == "true")
                    {
                        document.getElementById("error-msg").innerHTML = "登錄密碼已發送到你的郵箱！";
                        setTimeout(function()
                        { 
                            $ionicHistory.goBack();
                        }, 5000);
                    }else{
                        document.getElementById("error-msg").innerHTML = "失敗，請輸入註冊時使用的電郵地址！";
                    }
                }
                else
                {
                    alert("連接失敗，請檢查網絡設置後重試");
                }
            })
        }
        

    })
    
    .controller('AlarmCtrl', function($scope, $ionicPopup, Alarm, $rootScope,
     $cordovaLocalNotification, $ionicPlatform, Utils, $state){

        console.log("HomeCtrl is ready");

        $scope.$on("$ionicView.beforeEnter", function(event, data){
            $scope.myDate = new Date();
            // Mon Jun 19 2017 00:02:28 GMT+0800 (CST)
            // var date_holder = ($scope.myDate).toString();
            (new Utils()).showDate($scope.myDate);
            $scope.alarm = {};
            $rootScope.alarmList = {};
            $scope.alarm.id = ((new Date($scope.myDate)).getTime()) /1000;
            var alarm = (new Alarm()).addAlarm($scope.alarm.id, $scope.alarm.time, $scope.alarm.content);
            $rootScope.alarmList[$scope.alarm.id] = alarm;
            localStorage.setItem('alarmList', angular.toJson($rootScope.alarmList));
        });

        $scope.addAlarm = function(){
            console.log("add");
            $state.go('add');
        }

        
    })
    
    .controller('SoundCtrl', function($scope){

        console.log("SoundCtrl is ready");
    })

    .controller('AddCtrl', function($scope, ionicTimePicker, $cordovaImagePicker, Utils, $ionicPopup){

        console.log("AddCtrl is ready");
        $scope.alarm = [];
        var localTimeOffSet = (new Date()).getTimezoneOffset();
        $scope.$on("$ionicView.beforeEnter", function(event, data){
            // GMT+0800 (CST)
            var current = new Date();
            document.getElementById("time").innerHTML = (new Utils()).formatClock(current.getHours(), current.getMinutes());
            $scope.alarm.time = current;
            $scope.alarm.image = 'img/smell.png';
        });

        // getHours(): get the set hour
        // getMinutes(): get the set minutes
        // GMT + 8
        $scope.setTime = function(){
            console.log("setTime");
            var timePicker = {
                callback: function (val) {      //Mandatory
                    if (typeof (val) === 'undefined') {
                        alert('請選擇時間');
                    } else {
                        // GMT+0800 (CST)
                        var selectedTime = new Date((val + localTimeOffSet * 60)* 1000);
                        console.log(selectedTime);
                        // update the alarm time
                        $scope.alarm.time = selectedTime;
                        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getHours(), 'H :', selectedTime.getMinutes(), 'M');
                        document.getElementById('time').innerHTML = (new Utils()).formatClock(selectedTime.getHours(), selectedTime.getMinutes());
                    }
                },
                inputTime: ($scope.alarm.time).getHours() * 3600 + ($scope.alarm.time).getMinutes() * 60,
                // (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
                format: 12,
                step: 1,
                setLabel: '確定',
                closeLabel: '取消'
            };

            ionicTimePicker.openTimePicker(timePicker);
        }

        $scope.setImage = function(){
            var options = {
                maximumImagesCount: 1,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    console.log("選擇圖片： " + results[i]);
                    document.getElementById('image').innerHTML = "自定義";
                    $scope.alarm.image = results[i];
                }
                }, function(error) {
                    alert("選擇失敗，請重試");
            });
        }
    });

// "登錄密碼將發送到你的郵箱"

/*
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

                    $scope.registerAlarm = function(){
                        // localnotif only work when a device is used
                        var alarmTime = new Date($scope.alarm.time);

                        $cordovaLocalNotification.schedule({
                            id: $scope.alarm.id,
                            title: 'Alarm',
                            text: $scope.alarm.content,
                            at: alarmTime,
                            data: {},
                            ongoing: true
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
 
 */