"use strict"
var net = require('net');
var svc = null;
const v1 = {
    check: function(service) {
        var self = this;
        svc = service;
        return Promise.resolve()
            .then(self.doCheck)
    },
    doCheck: function() {
        return new Promise(function(resolve, reject) {
            var client = new net.Socket();
            var checkResult = {state: -1, output: ""}
            client.connect(svc.server.port, svc.server.ip, function() {
                client.write(svc.check.plugin + "|" + svc.check.params + "|\n");
            });
            client.setTimeout(svc.check.timeout, function() {
              reject(new Error("Timeout"));
              client.destroy();
            })
            client.on('data', function(data) {
                if (data.toString().match(/^OS:/)) {
                    //OS Banner
                } else if (data.toString().match(/^PERF:/)) {
                    var resp = data.toString();
                    checkResult.performance_data = resp;
                } else {
                    //Actual Response - support multiline output
                    var resp = data.toString();
                    if(checkResult.state == -1) {
                      var components = resp.split("|");
                      checkResult.state = parseInt(components[0]);
                      checkResult.output += components[1];
                    } else {
                      checkResult.output += resp;
                    }

                }
            });
            client.on('close', function() {
                resolve(checkResult);
            });
            client.on('error', function(err) {
                reject(err);
            });
        })
    }
}

module.exports = v1;