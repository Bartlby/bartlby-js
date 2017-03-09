"use strict"

import {debug} from 'debug'
const logger = debug("bartlby/scheduler")

class Scheduler {
  constructor(boss) {
    logger("init")
    var self = this;
    self.boss = boss;
    self.cycleActive = false;
    self.interval = setInterval(_ => {
      if(self.cycleActive) {
        logger("skipping unfinished")
        return;
      }
      self.cycleActive = true;
      
      Promise.resolve()
          .then(self.workload)
          .then(self.boss.work)
          .then(self.commit)
          .then(function() {
            self.cycleActive = false;
          })
          .then(function() {
            logger("CYCLE DONE")
          })
          .catch(error => {
            logger("ERROR: ", error)
            self.cycleActive = false;
          })
      
    }, 5000)
  }
  commit(results) {
      logger("Results 1", results)
      return Promise.resolve();
  }
  workload() {
    return new Promise((resolve, reject) => {
      var data = [
        {id: 1},
        {id: 2}
      ]
      resolve(data);
      //reject("a")
    })
  }
}

export default Scheduler;