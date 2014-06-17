'use strict';

exports.list = function(req, res) {
    var location = req.query.location;

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    if(!location) {
        return res.send(500);
    }

    res.json([{name: 'demo'}]);
};
