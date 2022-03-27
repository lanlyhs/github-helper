const { Octokit, App } = require("octokit");
const { throttling } = require("@octokit/plugin-throttling");
const MyOctokit = Octokit.plugin(throttling);

module.exports = new MyOctokit({
    throttle: {
        onRateLimit: (retryAfter, options) => {
            octokit.log.warn(
                `Request quota exhausted for request ${options.method} ${options.url}`
            );

            // Retry twice after hitting a rate limit error, then give up
            if (options.request.retryCount <= 2) {
                console.log(`Retrying after ${retryAfter} seconds!`);
                return true;
            }
        },
        onAbuseLimit: (retryAfter, options) => {
            // does not retry, only logs a warning
            octokit.log.warn(
                `Abuse detected for request ${options.method} ${options.url}`
            );
        },
    },
});
