var ParamObj = {
    Debug: 1,
    DataMap: null,
    HashMap: new Object(),
    findParameter: function (parameter) {
        var entry = null;
        if (parameter in this.HashMap) {
            entry = this.HashMap[parameter];
        } else
        if (this.DataMap == null) {
        } else {
            $.each(this.DataMap.map, function (i, f) {
                ParamObj.HashMap[f.Parameter] = f;
                if (f.Parameter === parameter) {
                    entry = f;
                    return (false);
                }
            })
        }
        return (entry);
    },
    getValue: function (parameter, attribute) {
        var value = null;
        var entry = null;
        if ((entry = this.findParameter(parameter)) == null) {
        } else
        if (typeof(entry[attribute]) === 'undefined') {
        } else {
            value = entry[attribute];
        }
        return (value);
    },
    processData: function (data) {
        if (this.Debug > 0) {
            console.log('ParamObj.getData(); executing ...');
        }
        if (data != null) {
            var jsonmap = JSON.stringify(data.map, RepeatObj.replacer);
            this.DataMap = new OS_Map(eval(jsonmap));
        }
        if (this.DataMap == null) {
            console.log('ParamObj.getData() Invalid Data!');
        } else
        if (this.DataMap.map == null) {
            console.log('ParamObj.getData() Invalid Data map!');
        } else {
        }
    },
    getData: function (jsonfilename, callback) {
        console.log('ParamObj.getData(); requesting...');
        var This = this;
        var username = Controller.UserId; // Username; // 'nginx';
        var password = Controller.Password; //'Neolation$123';
        function setHeader(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        }
        $.ajax({
            url: jsonfilename,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                ParamObj.processData(data);
                callback();
            },
            error: function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                alert("Request Failed: " + err + ' filename=[' + jsonfilename + ']');
                callback();
            },
            beforeSend: setHeader
        });
    },
    getParametersData: function (callback) {
        console.log('ParamObj(); requesting...');
        ParamObj.getData('/data/Parameters.json', callback); //?nocache=' + (new Date()).getTime);
//        $.getJSON('../data/Parameters.json?nocache=' + (new Date()).getTime(), function (data) {
//           ParamObj.getData(data);
//        });
    },
    translateNames: function (names) {
        var newnames = [];
        for (var i = 0; i < names.length; i++) {
            var param;
            if ((param = this.findParameter(names[i])) == null) {
                newnames.push(names[i]);
            } else
            if (empty(param.DisplayName)) {
                newnames.push(names[i]);
            } else {
                newnames.push(param.DisplayName);
            }
        }
        return (newnames);
    }
}