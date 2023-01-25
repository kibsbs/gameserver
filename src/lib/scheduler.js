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

    async botScoreJob(sid, fn) {
        const def = `update bot score ${sid}`;
        this.agenda.define(def, fn);
        await this.agenda.start();
        await this.agenda.every("5 seconds", def);;
    }

    /**
     * Creates a new job and deletes dead session
     * We use this because MongoDB's TTL function only gets called every 60s
     * and our session TTL is 30 seconds
     */
    async sessionJob() {
        const query = {
            updatedAt: { $lt: new Date( Date.now() - (global.gs.EXPIRED_SESSION_INTERVAL) ) },
            isJD5: false,
            isBot: false
        }
        const queryJD5 = {
            updatedAt: { $lt: new Date( Date.now() - (global.gs.EXPIRED_SESSION_INTERVAL_JD5) ) },
            isJD5: true,
            isBot: false
        }
        this.agenda.define("remove inactive sessions", async (job) => {
            // Find any session that has passed 30 seconds of inactivity
            const sessions = await sessionDb.find(query);
            const scores = await wdfScoreDb.find(query);
            if (sessions.length > 0 || scores.length > 0) {
                // Delete all inactive sessions and their score entries
                const toDelete = [...sessions, ...scores]
                const sessionIds = toDelete.map(s => s.sessionId);

                await sessionDb.deleteMany({ sessionId: sessionIds });
                await wdfScoreDb.deleteMany({ sessionId: sessionIds });

                global.logger.info(`Scheduler: Deleted ${sessions.length} inactive sessions and ${scores.length} scores from JD5 games`);
            }
        });
        this.agenda.define("remove inactive sessions JD5", async (job) => {
            // Find any session that has passed 30 seconds of inactivity
            const sessions = await sessionDb.find(queryJD5);
            const scores = await wdfScoreDb.find(queryJD5);
            if (sessions.length > 0 || scores.length > 0) {
                // Delete all inactive sessions and their score entries
                const toDelete = [...sessions, ...scores]
                const sessionIds = toDelete.map(s => s.sessionId);

                await sessionDb.deleteMany({ sessionId: sessionIds });
                await wdfScoreDb.deleteMany({ sessionId: sessionIds });

                global.logger.info(`Scheduler: Deleted ${sessions.length} inactive sessions and ${scores.length} scores from JD5 games`);
            }
        });
        await this.agenda.start();
        await this.agenda.every("30 seconds", "remove inactive sessions");
        await this.agenda.every("45 seconds", "remove inactive sessions JD5");
    }
}

module.exports = new Scheduler();