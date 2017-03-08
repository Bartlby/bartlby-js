const v1 = require('./connectors/legacy/v1')
const v2 = require('./connectors/legacy/v2')



const svc_obj = {
    server: {
        ip: "192.168.239.120",
        port: 9030
    },
    check: {
        plugin: "bartlby_load",
        params: "-w 10 -c 10 -p",
        timeout: 2000
    }
}


var r = v1.check(svc_obj)
    .then(function(result) {
        console.log("AGENT V1:")
        console.log(result);
    })
    .catch(function(error) {
        console.log("Error: ", error.message)
    });


const svc_obj_agent_v2 = {
    server: {
        ip: "sheldon.krone.at",
        port: 9030
    },
    check: {
        plugin: "bartlby_load",
        params: "-w 10 -c 10 -p",
        timeout: 2000
    }
}

var r = v2.check(svc_obj_agent_v2)
    .then(function(result) {
        console.log("AGENT V2: SSL")
        console.log(result);
    })
    .catch(function(error) {
        console.log("Error: ", error.message)
    });