const morgan = require('morgan');
// ISO timestamp included
module.exports = morgan(':date[iso] :method :url :status - :response-time ms');
