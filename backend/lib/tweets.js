'use strict';

var qs = require('querystring');

var async = require('async');
var zip = require('annozip');
var fp = require('annofp');
var first = fp.first;
var filter = fp.filter;
var id = fp.id;
var prop = fp.prop;


var Twitter = require('simple-twitter');


module.exports = function(config) {
    return getTweets.bind(null, config);
};

function getTweets(config, o, cb) {
    var client = new Twitter(config.key, config.secret, config.token, config.tokenSecret);
    var result = [];
    var maxId, terminate;

    async.doUntil(function(cb) {
        getStatuses({
            client: client,
            user: o.user,
            maxId: maxId
        }, function(err, statuses) {
            if(err) {
                return cb(err);
            }

            var newerThanDate = statuses.filter(function(v) {
                return v.date >= o.date;
            });

            result = result.concat(newerThanDate);

            if((newerThanDate.length < statuses.length) || !statuses.length) {
                terminate = true;
            }
            else {
                maxId = statuses.slice(-1)[0].id;
            }

            cb();
        });
    }, function() {
        return terminate;
    }, function(err) {
        if(err) {
            return cb(err);
        }

        return cb(null, result);
    });
}

function getStatuses(o, cb) {
    var opts = {
        count: 100,
        'screen_name': o.user || '',
        'trim_user': true,
        'exclude_replies': true,
        'include_rts': true
    };

    if(o.maxId) {
        opts['max_id'] = o.maxId;
    }

    o.client.get('statuses/user_timeline', '?' + qs.stringify(opts), function(err, data) {
        if(err) {
            return cb(err);
        }

        data = JSON.parse(data);

        var parts = [
            data.map(prop('text')),
            data.map(prop('id')),
            data.map(prop('created_at')).map(toDate),
            data.map(prop('entities')).map(prop('urls')).map(first).map(prop('expanded_url'))
        ];
        cb(null, zip.apply(null, parts).map(filter.bind(null, id)).filter(lengthEquals(parts.length)).map(function(v) {
            return {
                text: v[0],
                id: v[1],
                date: new Date(v[2]),
                url: v[3]
            };
        }));
    });
}

function lengthEquals(amt) {
    return function(arr) {
        return arr.length === amt;
    };
}

function toDate(str) {
    return new Date(str);
}
