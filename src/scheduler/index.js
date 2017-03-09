import {
    MongoClient
} from 'mongodb';
import {
    debug
} from 'debug'
const logger = debug("bartlby/scheduler")

class Scheduler {
    constructor(boss) {
        logger("init")
        const self = this;
        self.boss = boss;
        self.cycleActive = false;
        Promise.resolve()
            .then(self.connectDB.bind(this))
            .then(_ => {
                console.log(" CONNECTED ")
            })
            .then(self.startCycles.bind(this))
            .catch(error => {
                console.error("FAILED", error)
            });

    }
    startCycles() {
        var self = this;
        self.interval = setInterval(_ => {
            if (self.cycleActive) {
                logger("skipping unfinished")
                return;
            }
            self.cycleActive = true;

            Promise.resolve()
                .then(self.workload.bind(this))
                .then(self.boss.work.bind(self.boss))
                .then(self.commit.bind(this))
                .then(() => {
                    self.cycleActive = false;
                })
                .then(() => {
                    logger("CYCLE DONE")
                })
                .catch(error => {
                    logger("ERROR: ", error)
                    self.cycleActive = false;
                })

        }, 5000)
    }
    updateSingle(svc) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.db.collection("services").update({
                _id: svc._id
            }, svc, (err, doc) => {
                resolve(doc)
            })
        })
    }
    commit(results) {
        var self = this;
        var proms = [];
        results.forEach(function(svc) {
            proms.push(self.updateSingle(svc));
        })
        return Promise.all(proms);
    }
    connectDB() {
        var self = this;
        return new Promise((resolve, reject) => {
            MongoClient.connect("mongodb://localhost:27017/BARTLBY", function(err, db) {
                if (!err) {
                    self.db = db;
                    resolve()
                } else {
                    reject(err);
                }
            });
        })

    }
    workload() {
        var self = this;
        return new Promise((resolve, reject) => {
            var ts = Math.floor(Date.now() / 1000);
            var collection = self.db.collection('services');
            collection.aggregate([
              {
                $project: {
                    _id: 0,
                    diff: {
                        $subtract: [ts, "$last.check"]
                    },
                    service: "$$ROOT"
                }
                
            },
            {
              $project: {
                needsCheck: { $gt: [ "$diff", "$service.check.interval" ] },
                diff: "$diff",
                service: "$service"
              }
            },
            {
              $match: {
                needsCheck: true
              }
            }            
            ]).toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            })

            //reject("a")
        });
    }
}

export default Scheduler;