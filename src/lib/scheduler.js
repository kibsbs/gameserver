const cron = require("cron");
const Agenda = require("agenda");

const time = require("time");
const sessionDb = require("./models/session");
const wdfScoreDb = require("./models/wdf-score");

class Scheduler {
    constructor() {
        this.agenda = new Agenda({ mongo: global.dbClient.db("scheduler") });
    }

    newJob(def = "No definiton", time, fn) {
        global.logger.info(`Scheduler: New job assigned for ${time}: ${def}`)
        const job = new cron.CronJob(new Date(time), fn);
        return job.start();
    }

    /**
     * Creates a new job and deletes dead session
     * We use this because MongoDB's TTL function only gets called every 60s
     * and our session TTL is 30 seconds
     */
    async sessionJob() {
        this.agenda.define("remove inactive sessions", async (job) => {
            // Find any session that has passed 30 seconds of inactivity
            const sessions = await sessionDb.find({ isBot: false, updatedAt: { $lt: new Date( Date.now() - (30 * 1000) ) } });
            if (sessions.length > 0) {
                // Delete all inactive sessions and their score entries
                const sessionIds = sessions.map(s => s.sessionId);

                await sessionDb.deleteMany({ sessionId: sessionIds });
                await wdfScoreDb.deleteMany({ sessionId: sessionIds });

                global.logger.info(`Scheduler: Deleted ${sessions.length} inactive sessions and their scores`);
            }
        });
        await this.agenda.start();
        await this.agenda.every("30 seconds", "remove inactive sessions");
    }
}

module.exports = new Scheduler();