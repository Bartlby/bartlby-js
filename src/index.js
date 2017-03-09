import { debug } from 'debug'

//Check Types
import v1 from "./connectors/legacy/v1"
import v2 from "./connectors/legacy/v2"

import Scheduler from "./scheduler"
import Boss from "./boss"

// Logging
const logger = debug("bartlby")

var config = {
  worker: 3
}


logger("Bartlby Init")
const boss = new Boss();
const sched = new Scheduler(boss);


process.on('SIGINT', function() {
    logger("Caught interrupt signal");
    process.exit();
});


/*





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
    .then(result => {
        logger("AGENT V1:")
        logger(result);
    })
    .catch(({message}) => {
        logger("Error: ", message)
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
    .then(result => {
        logger("AGENT V2: SSL")
        logger(result);
    })
    .catch(({message}) => {
        logger("Error: ", message)
    });
    */