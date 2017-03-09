import net from 'net';
let svc = null;
const v1 = {
    check(service) {
        const self = this;

        svc = service;
        
return Promise.resolve().
            then(self.doCheck)
    },
    doCheck() {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const bench_start = new Date();
            const checkResult = {
 "state": -1,
"output": "",
"bench": -1
};
            const tcp_out = [];

            client.connect(svc.server.port, svc.server.ip, () => {
                client.write(`${svc.check.plugin}|${svc.check.params}|\n`);
            });
            client.setTimeout(svc.check.timeout, () => {
              reject(new Error("Timeout"));
              client.destroy();
            })
            client.on('data', (data) => {
                //Actual Response - support multiline output
                const resp = data.toString();

                tcp_out.push(resp.replace(/\n/g, ""));

            });
            client.on('close', () => {
                let result_found = false;

                tcp_out.forEach((line) => {
                  if (line.match(/^OS:/)) {
                      //OS Banner
                  } else if (line.match(/^PERF:/)) {
                      checkResult.performance_data = line;
                  } else if (result_found == false) {
                        const components = line.split("|");

                        console.log("LINE: ", line);
                        checkResult.state = parseInt(components[0]);
                        checkResult.output += components[1];
                        result_found = true;
                        
                      } else {
                          checkResult.output += line;
                      }
                })
                checkResult.bench = { "ms": new Date() - bench_start };
                resolve(checkResult);
            });
            client.on('error', (err) => {
                reject(err);
            });
        })
    }
}

export default v1;