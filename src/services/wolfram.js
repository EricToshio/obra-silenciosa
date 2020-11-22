const axios = require('axios');
const qs = require('qs');

/**
 * Get solution from wolfram alpha
 * Input should be Array of 3 sensor message with 'value', 'lat' and 'long'
 * Output maybe an Array
 */
const getSolution = async (sensors) => {
    const equation = sensors.map(sensor => `${sensor.value} = k + 10 log((${sensor.lat}-a)^2+(${sensor.long}-b)^2)`).join(' ; ')
    const queryString = qs.stringify({
        appid: process.env.WOLFRAM_APP_ID,
        input: equation,
        output: 'json',
        scantimeout: 100,
        podtimeout: 100,
        parsetimeout: 100,
        totaltimeout: 100,
        podtitle: 'Solutions',
    })

    const response = await axios.get(`http://api.wolframalpha.com/v2/query?${queryString}`);
    return response.data.queryresult.pods[0].subpods.map(solution => solution.plaintext);
}

module.exports = { getSolution }