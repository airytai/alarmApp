angular.module('AlarmApp.services', [])

    .factory('Alarm', function() 
    {
        return function(){
            self.addAlarm = function(id, time, content)
            {
                var alarm = {
                    id : id,
                    time: time,
                    content: content
                };
                return alarm;
            }

            return self;
        }
    })

    .factory('Utils', function() {
    	return {
            // input: date string (i.e. 2018-11-21T08:45)
            // output: timestamp (in ms)
            parseDateStr: function(dateStr) {
                var date = new Date(dateStr + '-0000');
                // TODO: this should be date.getTimezoneOffset();
                // otherwise there will be issues related to DST
                var timezone = new Date().getTimezoneOffset(); 
                var timestamp = date.getTime() + timezone * 60000;
                return timestamp;
            },
            convertToUTC: function(time) {
                var ddl = new Date(time * 1000);
                var timezone = ddl.getTimezoneOffset();
                var date = (ddl.getTime() - timezone * 60000) / 1000;
                return new Date(date * 1000);
            }
    	};
    })