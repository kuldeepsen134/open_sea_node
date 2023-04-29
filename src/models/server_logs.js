const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    level:{
      type: String,
    },
    message:{
      type: String,
    },
    timestamp: {
      type: Date,
    },
  });
  
const server_logs = new mongoose.model('Log', logSchema);
module.exports = server_logs;
  