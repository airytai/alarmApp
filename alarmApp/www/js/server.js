angular.module('AlarmApp.server',[])

    .factory('Server', function($http, apiEndpoint){
        
        var headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        return {

            login: function(username, password) 
            {
                return $http.post(apiEndpoint.url + 'login.php', {
                        username: username,
                        password: password
                    })
                    .success(function(response) {
                        console.log("login success: " + JSON.stringify(response));
                        return response;
                    })
                    .error(function(response) {
                        console.log("login error: " + JSON.stringify(response));
                        return response;
                    });
            },

            register: function(name, email)
            {
                return $http.post(apiEndpoint.url + 'userregist.php', {
                        name: name,
                        email: email
                    })
                    .success(function(response) {
                        console.log("register success: " + JSON.stringify(response));
                        return response;
                    })
                    .error(function(response) {
                        console.log("register error: " + JSON.stringify(response));
                        return response;
                    });
            },

            forgetPassword: function(email)
            {
                return $http.post(apiEndpoint.url + 'forgetpwd-alarm.php', {
                        email: email
                    })
                    .success(function(response) {
                        console.log("forgetPassword success: " + JSON.stringify(response));
                        return response;
                    })
                    .error(function(response) {
                        console.log("forgetPassword error: " + JSON.stringify(response));
                        return response;
                    });
            }
        }
    })