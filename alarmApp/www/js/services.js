angular.module('AlarmApp.services', [])

    .factory('Alarm', function() 
    {
        return function(){
            self.addAlarm = function(id, hour, minute, string)
            {
                var alarm = {
                    id : id,
                    hour: hour,
                    minute: minute,
                    string: string
                };
                return alarm;
            }

            return self;
        }
    })

    .factory('Utils', function() {
        return function(){
            // input: date string (i.e. 2018-11-21T08:45)
            // output: timestamp (in ms)
            // parseDateStr: function(dateStr) {
            //     var date = new Date(dateStr + '-0000');
            //     // TODO: this should be date.getTimezoneOffset();
            //     // otherwise there will be issues related to DST
            //     var timezone = new Date().getTimezoneOffset(); 
            //     var timestamp = date.getTime() + timezone * 60000;
            //     return timestamp;
            // },
            // convertToUTC: function(time) {
            //     var ddl = new Date(time * 1000);
            //     var timezone = ddl.getTimezoneOffset();
            //     var date = (ddl.getTime() - timezone * 60000) / 1000;
            //     return new Date(date * 1000);
            // }
            self.showDate = function(date_object)
            {
                // 01234567891011121314151617181920212223
                // Mon Jun 19  2 0 1 7   0 0 : 0 7 : 4 5 GMT+0800 (CST)
                // var day_week = date_string.substring(0, 3);
                // var month = date_string.substring(4, 7);
                // var date = date_string.substring(8,10);
                // var year = date_string.substring(11,15);
                // var noon = date_string.substring(16,18);
                var hour = addZero(date_object.getHours());
                var noon = checkNoon(hour);
                if(noon == "下午")
                {
                    if(hour != 12)
                    {
                        hour -= 12;
                    }
                }
                var minute = addZero(date_object.getMinutes());
                var date = addZero(date_object.getDate());
                var month = addZero(date_object.getMonth()+1);
                var year = date_object.getFullYear();
                var day = date_object.getDay();
                
                // document.getElementById("date").innerHTML = 
                //     "<p style=\"font-size:12pt; height:16pt; color:black\">"+year+"年"+month+"月"+date+"日</p> \
                //             <p style=\"font-size:14pt; height:14pt; color:black\">"+noon+"</p> \
                //             <p style=\"font-size:16pt; height:14pt; color:black\">"+hour+":"+minute+"</p>";

            },
            self.formatClock = function(hour, minute)
            {
                if(hour < 12)
                {
                    return "上午 " + addZero(hour) + ":" + addZero(minute);
                }
                if(hour == 12)
                {
                    return "下午 " + addZero(hour) + ":" + addZero(minute);
                }
                return "下午 " + addZero(hour-12) + ":" + addZero(minute);
            },
            self.checkNoon = function(i)
            {
                if(i<12)
                {
                    return "上午";
                }else{
                    return "下午";
                }
            },
            self.addZero = function(i)
            {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }

            return self;
    	};
    })