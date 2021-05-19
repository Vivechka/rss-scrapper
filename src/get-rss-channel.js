const scenario = require("./scenario/axios/rssChannel")
const _ = require("lodash")
const fs = require("fs")
const chalk = require("chalk")
const cliProgress = require('cli-progress')

let config = require("../config/rss-test-config.json")

let Queue = require("queue-promise")

async function processing () {

    let data = []

    const queue = new Queue({
      concurrent: 10,
      interval: 2
    });

    const progressBar = new cliProgress.SingleBar({
        format: ' {bar} {percentage}% | {value}/{total} | elapsed: {duration_formatted} | estimated: {eta_formatted} Current URL: '+chalk.green('{url}'),
        hideCursor: true
    })

    progressBar.start(config.length,0)

    queue.on("resolve", res => {
        progressBar.update(data.length,{url: source.url})
    })

    queue.on('end', () => {
       progressBar.stop()
        fs.writeFileSync(
            require.resolve("../config/rss-test-config.json"),
            JSON.stringify(data, null, " ")
        )
    })

    config.forEach( source => {
        queue.enqueue(() => scenario.run(source)
                .then( res => {
                    data.push(res)
                    progressBar.update(data.length,{url: source.url})
                    return res
                }))
    })

    queue.start()
}

processing()
