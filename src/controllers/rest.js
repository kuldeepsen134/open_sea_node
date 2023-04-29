const axios = require("axios");
const responseSuccess = require("../helpers/responseSuccess")
const responseError = require("../helpers/responseError")


const getdata = async (req, res) => {
    const queryObj = Object.entries(req.query)
    let query = "?"
    queryObj.forEach(v => {
        query = query + `${v[0]}=${v[1]}&`
    })
    console.log(query);
    const options = {
        method: 'GET',
        url: 'http://68.183.109.146:4000',
        headers: {
            'url': `https://api.opensea.io/api${req.path}${query}`,
            'useProxy': 'true',
            'useAPI': 'true',
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        responseSuccess(req, res, 200, response.data)
    }).catch(function (error) {
        responseError(req, res, error.response.status || 404, error.message)
    });
}
module.exports = { getdata };