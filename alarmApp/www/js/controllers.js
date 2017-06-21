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
                            localStorage.setItem('username', $scope.user.username);
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
    
    .controller('HomeCtrl', function($scope, $ionicPopup, Alarm, $rootScope,
     $cordovaLocalNotification, $ionicPlatform, Utils, $state, $timeout, $filter, ClockSrv, $ionicHistory){

        console.log("HomeCtrl is ready");

        $scope.$on("$ionicView.beforeEnter", function(event, data){
            // if(localStorage.getItem('username') == null)
            // {
            //     $ionicHistory.nextViewOptions({
            //         disableAnimate: false,
            //         disableBack: true,
            //         historyRoot: true
            //     });
            //     $state.go('login');
            // }
            $scope.myDate = new Date();
            // Mon Jun 19 2017 00:02:28 GMT+0800 (CST)
            // var date_holder = ($scope.myDate).toString();
            // (new Utils()).showDate($scope.myDate);
            $rootScope.alarmList = {};
            if(localStorage.getItem('alarmList') != null){
                $rootScope.alarmList = angular.fromJson(localStorage.getItem('alarmList'));
            }
        });
        
        $scope.addAlarm = function(){
            console.log("add");
            $state.go('add');
        }

        $scope.removeAlarm = function(alarm){
            console.log(JSON.stringify(alarm));
            
            var alarmPopup = $ionicPopup.confirm({
                title: '刪除',
                template: '是否刪除提醒？',
                okText: '是',
                cancelText: '否'
            });

            alarmPopup.then(function(res){
                if(res){
                    $ionicPlatform.ready(function () {
                        if (ionic.Platform.isWebView()) {
                            cordova.plugins.notification.local.cancel(alarm.id,
                                function() {
                                    delete $rootScope.alarmList[alarm.id]
                                    localStorage.setItem('alarmList', angular.toJson($rootScope.alarmList));
                                    console.log("Cancel " + JSON.stringify(alarm));
                                }
                            );
                            cordova.plugins.notification.local.cancel(alarm.id + 1,
                                function() {
                                    console.log("Cancel Interval: " + JSON.stringify(alarm));
                                }
                            );
                        }
                    })
                }
            })
        }

        // just for debugging
        $scope.clearAlarm = function(){
            console.log("You clear all alarms.");
            $ionicPlatform.ready(function () {
                if (ionic.Platform.isWebView()) {
                    cordova.plugins.notification.local.cancelAll(
                        function() {
                            alert('ok, all canceled');
                            localStorage.removeItem('alarmList');
                            delete $rootScope.alarmList
                        }
                    );
                }
            })
            
        }
        
    })
    
    .controller('SoundCtrl', function($scope, $stateParams, $ionicHistory, $ionicPopup){

        console.log("SoundCtrl is ready");
        var confirmed = false;
        $scope.ring = [];
        $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
            $scope.ringtones = $stateParams.ringtones;
            $scope.choice = (localStorage.getItem('selectSound') == null) ? $scope.ringtones[0].Name : angular.fromJson(localStorage.getItem('selectSound')).Name;
        });

        $scope.playSound = function(ringtone){
            $scope.choice = ringtone.Name;
            $scope.ring = ringtone;
            document.addEventListener('deviceready', function () {
                var ringtones;
                cordova.plugins.NativeRingtones.playRingtone(ringtone.Url);
            }, false);
        }
        $scope.selectSound = function(){
            localStorage.setItem('selectSound', angular.toJson($scope.ring));
            console.log("select Sound: " + JSON.stringify($scope.ring));
            console.log("show Local: " + JSON.stringify(angular.fromJson(localStorage.getItem('selectSound'))));
            confirmed = true;
            $ionicHistory.goBack();
        }

        $scope.$on("$ionicView.beforeLeave", function(event, data){
            if(!confirm)
            {
                var alarmPopup = $ionicPopup.confirm({
                    title: '返回',
                    template: '是否保存選擇的鈴聲？',
                    okText: '保存',
                    cancelText: '不保存'
                });

                alarmPopup.then(function(res){
                    if(res){
                        localStorage.setItem('selectSound', angular.toJson($scope.ring));
                        $ionicHistory.goBack();
                    }else{
                        $ionicHistory.goBack();
                    }
                })
            }
        });
    })

    .controller('AddCtrl', function($scope, ionicTimePicker, $cordovaImagePicker, Utils, $state, $rootScope, $ionicPlatform, $ionicHistory, $cordovaLocalNotification, Alarm, $ionicPopup){

        console.log("AddCtrl is ready");
        $scope.alarm = [];
        $scope.ringtones = [];
        var localTimeOffSet = (new Date()).getTimezoneOffset();
        $scope.$on("$ionicView.beforeEnter", function(event, data){
            // GMT+0800 (CST)
            var current = new Date();
            document.getElementById("time").innerHTML = (new Utils()).formatClock(current.getHours(), current.getMinutes());
            $scope.alarm.time = current;
            $scope.alarm.image = 'img/smell.png';
            $scope.ringOnce = false;
            if(localStorage.getItem('selectSound') != null && $scope.ringtones[0] != null)
            {
                if(angular.fromJson(localStorage.getItem('selectSound')).Name != $scope.ringtones[0].Name)
                {
                    document.getElementById('sound').innerHTML = "自定義";
                }else{
                    document.getElementById('sound').innerHTML = "默認";
                }
            }
            $scope.alarm.sound = $scope.ringtones[0];
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
            console.log("ready to get into imagepicker");
            $ionicPlatform.ready(function () {
                console.log("IN");
                
                $cordovaImagePicker.getPictures(options)
                    .then(function (results) {
                        console.log("get pic");
                        for (var i = 0; i < results.length; i++) {
                            console.log("選擇圖片： " + results[i]);
                            document.getElementById('image').innerHTML = "自定義";
                            $scope.alarm.image = results[i];
                        }
                    }, function(error) {
                        alert("選擇失敗，請重試");
                });
            })
        }

        $scope.setSound = function(){
            $state.go('sound', {ringtones: $scope.ringtones});
        }

        document.addEventListener('deviceready', function () {
            console.log("run device ready");
            cordova.plugins.NativeRingtones.getRingtone(function(success) {
                $scope.ringtones = success;
                console.log(JSON.stringify($scope.ringtones));
            },
            function(err) {
                alert(err);
            });
            // TODO: Error loading
            // setTimeout(function() { console.log("Time out: " + ringtones); }, 3000); 
        }, false);
        
        $scope.setAlarm = function(){
            if($scope.alarm.sound == undefined || $scope.alarm.sound == null)
            {
                if($scope.ringtones == null)
                {
                    console.log("ringtones not ready");
                    return;
                }
                $scope.alarm.sound = $scope.ringtones[0];
            }
            console.log("setAlarm: " + JSON.stringify($scope.alarm.sound));
            
            $ionicPlatform.ready(function () {
                // prepare time
                var today = new Date();
                var day = today.getDate();
                var month = today.getMonth();
                var year = today.getFullYear();
                var hour = ($scope.alarm.time).getHours();
                var minute = ($scope.alarm.time).getMinutes();
                console.log(year + "/" + month + "/" + day);
                var startDate = new Date(year, month, day, hour, minute);
                var internalDate = new Date(startDate.getTime() + 60 * 1000);
                console.log(startDate);
                var id = hour*3600+minute*60;
                console.log("show id: " + id);//second
                console.log("show: " + hour*3600+minute*60);//millisecond
                $scope.alarm.id = id;

                if (ionic.Platform.isWebView()) {
                    // set day notif

                    // var soundUrl = $scope.alarm.sound.Url;
                    // console.log(soundUrl);
                    // console.log(soundUrl.substring(soundUrl.indexOf("audio")));
                    // var soundPath = "file://" + soundUrl.substring(soundUrl.indexOf("audio"));

                    $cordovaLocalNotification.schedule([{
                        id: $scope.alarm.id,
                        title: '吃藥提醒',
                        text: "夠鐘食藥啦！",
                        firstAt: startDate, 
                        // every: "day", // minute
                        every: "day",
                        sound: $scope.alarm.sound.Url,
                        // icon: "img/bell.png",
                        data: {imagePath: $scope.alarm.image}
                        // ongoing: true
                    },
                    {
                        id: $scope.alarm.id + 1,
                        title: '吃藥提醒 minute',
                        text: "夠鐘食藥啦！minute",
                        firstAt: internalDate, 
                        every: "minute", // minute
                        sound: $scope.alarm.sound.Url,
                        // icon: "img/bell.png",
                        data: {imagePath: $scope.alarm.image}
                        // ongoing: true
                    }]).then(function(result) {
                        console.log("You schedule the alarm successfully");
                        // add to list
                        $rootScope.alarmList = {};
                        if(localStorage.getItem('alarmList') != null){
                            $rootScope.alarmList = angular.fromJson(localStorage.getItem('alarmList'));
                        }
                        // unix_seconds of the alarm time is its id
                        var newAlarm = (new Alarm()).addAlarm($scope.alarm.id, ($scope.alarm.time).getHours(), ($scope.alarm.time).getMinutes(), (new Utils()).formatClock(($scope.alarm.time).getHours(), ($scope.alarm.time).getMinutes()));
                        $rootScope.alarmList[$scope.alarm.id] = newAlarm;
                        localStorage.setItem('alarmList', angular.toJson($rootScope.alarmList));
                        $ionicHistory.goBack();
                    
                    });

                    cordova.plugins.notification.local.on("click", function (notification) {
                        console.log(notification.data);
                        console.log(notification.id);
                        if(!$scope.ringOnce){
                            $scope.ringOnce = true;
                            var path = (angular.fromJson(notification.data)).imagePath;
                        
                            var myPopup = $ionicPopup.show({
                                template: '<img src=\"' + path +'\" width=\"100%\" height=\"100%\">',
                                title: '夠鐘食藥啦！',
                                buttons: [
                                {
                                    text: '關閉提醒',
                                    type: 'button-positive',
                                    onTap: function(e) {
                                        var updateId;
                                        var updateDate;
                                        if(notification.id % 60 == 1){
                                            // this is a internal alarm
                                            updateId = notification.id;
                                            updateDate = new Date((notification.at + 24*3600)*1000);
                                        }else{
                                            updateId = notification.id + 1;
                                            updateDate = new Date((notification.at + 24*3600 + 60)*1000);
                                        }
                                        console.log("updateDate: " + updateDate);

                                        cordova.plugins.notification.local.cancel(updateId,
                                            function() {
                                                console.log("Cancel Interval " + JSON.stringify(updateId));
                                            }
                                        );

                                        cordova.plugins.notification.local.update({
                                            id: updateId,
                                            title: '吃藥提醒 update',
                                            text: "夠鐘食藥啦！update",
                                            firstAt: updateDate, 
                                            every: "minute", // minute
                                            sound: notification.sound,
                                            // icon: "img/bell.png",
                                            data: {imagePath: path}
                                        }, function(){
                                            console.log("next day internal scheduled!")
                                        });
                                        
                                    }
                                }
                                ]
                            });

                            myPopup.then(function(res) {
                                $scope.ringOnce = false;
                                console.log('Tapped!', $scope.ringOnce);
                            });
                        }

                        cordova.plugins.notification.local.on("trigger", function(notification) {
                            console.log("triggered: " + JSON.stringify(notification));
                            document.addEventListener('deviceready', function () {
                                cordova.plugins.NativeRingtones.playRingtone(notification.sound);
                            }, false);
                        });
                        
                    });
                };

            })
        }

        $scope.$on("$ionicView.beforeLeave", function(event, data){
            
        });

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
/*

*/

