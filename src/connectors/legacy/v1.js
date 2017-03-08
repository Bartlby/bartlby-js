"use strict"
import net from 'net';
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
            var bench_start = new Date();
            var checkResult = {state: -1, output: "", bench: -1}
            var tcp_out = [];
            client.connect(svc.server.port, svc.server.ip, function() {
                client.write(svc.check.plugin + "|" + svc.check.params + "|\n");
            });
            client.setTimeout(svc.check.timeout, function() {
              reject(new Error("Timeout"));
              client.destroy();
            })
            client.on('data', function(data) {
                //Actual Response - support multiline output
                var resp = data.toString();
                tcp_out.push(resp.replace(/\n/g, ""));

            });
            client.on('close', function() {
                var result_found = false;
                tcp_out.forEach(function(line) {
                  if (line.match(/^OS:/)) {
                      //OS Banner
                  } else if (line.match(/^PERF:/)) {
                      checkResult.performance_data = line;
                  } else {
                      if(result_found == false) {
                        let components = line.split("|");
                        console.log("LINE: ", line);
                        checkResult.state = parseInt(components[0]);
                        checkResult.output += components[1];
                        result_found = true;
                        
                      } else {
                          checkResult.output += line;
                      }
                      
                  }
                })
                checkResult.bench = { ms: new Date() - bench_start };
                resolve(checkResult);
            });
            client.on('error', function(err) {
                reject(err);
            });
        })
    }
}

export default v1;