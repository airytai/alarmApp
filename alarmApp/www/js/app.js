// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('AlarmApp', ['ionic', 'AlarmApp.controllers', 'AlarmApp.services', 'AlarmApp.server', 'ngCordova', 'ds.clock', 'ionic-timepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.constant('apiEndpoint', {
  url: 'http://selfcare.imse.hku.hk/alarmApp/ionic/'
})

.config(function($stateProvider, $urlRouterProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('login', {
              url: '/login',
              cache: false,
              templateUrl: 'templates/login.html',
              controller: 'LoginCtrl'
            })
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html',
                controller: 'AlarmCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            })
            .state('forgetPassword', {
                url: '/forgetPassword',
                templateUrl: 'templates/forgetPassword.html',
                controller: 'ForgetPasswordCtrl'
            })
            .state('sound', {
                url: '/sound',
                templateUrl: 'templates/sound.html',
                controller: 'SoundCtrl'
            })
            .state('add', {
                url: '/add',
                templateUrl: 'templates/add.html',
                controller: 'AddCtrl'
            });

        $urlRouterProvider.otherwise('/');

    });
