
const axios = require('axios');

const test = async (req, res) => {
    try {
        const response = await axios.get('http://68.183.109.146:7456/api/v1/collection/doodles-official/stats', {
            params: {
                'format': 'json'
            },
            headers: {
                'content-type': 'application/json',
                'url': 'https://api.opensea.io'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
}



module.exports = { test };