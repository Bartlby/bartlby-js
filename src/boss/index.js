import {
    debug
} from 'debug'
const logger = debug("bartlby/Boss")

class Boss {
    constructor() {
        logger("init")

    }

    work(data) {
        const self = this;

        logger(`handle ${data.length} Jobs`)

        const proms = [];

        data.forEach((svc) => {
            proms.push(self.doSingle(svc.service))
        })

        return Promise.all(proms);
    }
    static doSingle(svc) {
        return new Promise((resolve, reject) => {
            const ts = Math.floor(Date.now() / 1000);

            svc.last.check = ts;
            //FIXME check if notification and stuff
            resolve(svc)
        })
    }

}

export default Boss;