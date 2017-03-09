import {debug} from 'debug'
const logger = debug("bartlby/Boss")

class Boss {
  constructor(workerCount) {
    logger("init")
    
  }
  
  work(data) {
    var self = this;
    logger(`handle ${data.length} Jobs`)
    
      var proms = [];
      data.forEach(function(svc) {
        proms.push(self.doSingle(svc.service))
      })
      return Promise.all(proms);
  }
  doSingle(svc) {
    
    return new Promise((resolve, reject) => {
      var ts = Math.floor(Date.now() / 1000);
      svc.last.check = ts;
      //FIXME check if notification and stuff
      resolve(svc)
    })
  }

}

export default Boss;