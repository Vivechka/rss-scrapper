const { extend, differenceBy, last } = require("lodash")
let axios = require("axios")
let cheerio = require("cheerio")
let md5 = require("md5")

/**
 * This function get common information about source and all news from xml of site
 *
 * @function getChannelMetadata
 * @param {object} data - object that contains information about source
 * @returns {object} the updated object that inputs
 */

let getChannelMetadata = data => {
    $ = cheerio.load(data.update.xml, { xmlMode: true })

    let title = $('channel > title').text();
    let description = $('channel > description').text();

    let image = $('channel image url').text();

    let lastMessages = []

    $('channel item').each( (i, elem) => {
        let titleT = $(elem).find('title').text();
        let text = $(elem).find('description').text();

        let link = $(elem).find('link').text();

        let createdAt = $(elem).find('pubDate').text();

        lastMessages.push({
            source:"rss channel",
            link,
            title: titleT,
            text,
            md5: md5(text),
            createdAt
        })
    })

    return extend( data, {
        title,
        description,
        image,
        lastMessages
    })
}

/**
 * This function get common information about source and all news from xml of site
 *
 * @function getMetadataDiff
 * @param {object} config - object that contains previous information about source
 * @param {object} newConfig - object that contains updated information about source
 * @returns {object} object with array of unique massages
 */

let getMetadataDiff = (config, newConfig) => {

    if(config.update && (config.update.md5 == newConfig.update.md5) ) return null
    
    config.lastMessages  = config.lastMessages || []
    newConfig.lastMessages = newConfig.lastMessages || []

    return {
        messages: differenceBy(newConfig.lastMessages, config.lastMessages,"md5")
    }
}

/**
 * This function get common information about source and all news from xml of site
 *
 * @async
 * @function getChannelInfo
 * @param {object} config - object that contains previous information about source
 * @returns {object} config with updated information and unique messages
 */

async function getChannelInfo(config){
    return axios(
            {
                method:"GET",
                url: config.url
            }
        ).then( response => {
            let newConfig = extend({url:config.url},{
                update:{
                        xml:response.data,
                        updatedAt: new Date(),
                        md5: md5(response.data)
                    }
                }
            )

            newConfig = extend(newConfig, getChannelMetadata(newConfig))

            newConfig.diff = getMetadataDiff(config, newConfig)

            return newConfig

        })
 }

module.exports = {
    run: getChannelInfo
}
