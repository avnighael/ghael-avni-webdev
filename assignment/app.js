var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/WAM');
mongoose.Promise = require('q').Promise;

require('./services/user.service.server');
require('./services/website.service.server');
require('./services/widget.service.server');
require('./services/page.service.server');