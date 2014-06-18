'use strict';

var async = require('async');
var prop = require('annofp').prop;
var Cache = require('mem-cache');

var token = require('../config').github;
var github = require('../lib/github')(token);


var matchers = decorate({
    nick: getUser,
    location: getByLocation
}, cacheData);

exports.list = function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    match(req.query, matchers, respond.bind(null, res));
};

function match(query, alternatives, respond) {
    var altNames = Object.keys(alternatives);

    for(var i = 0, len = altNames.length; i < len; i++) {
        var alt = altNames[i];
        var v = query[alt];

        if(v) {
            return alternatives[alt](v, respond);
        }
    }

    respond(new Error('Query did not match'));
}

function respond(res, err, data) {
    if(err) {
        console.error(err);

        return res.send(500);
    }

    res.json(data);
}

function decorate(o, fn) {
    var ret = {};

    Object.keys(o).forEach(function(k) {
        ret[k] = fn(o[k]);
    });

    return ret;
}

function cacheData(fn) {
    var cache = new Cache();

    return function(a, cb) {
        var data = cache.get(a);

        if(data) {
            return cb(null, data);
        }

        fn(a, function(err, d) {
            if(err) {
                return cb(err);
            }

            cache.set(a, d);

            cb(null, d);
        });
    };
}

function getByLocation(location, cb) {
    github.users('location:' + location, function(err, d) {
        if(err) {
            return cb(err);
        }

        var usernames = d.users.map(prop('username'));

        async.map(usernames, getUser, function(err, users) {
            if(err) {
                return cb(err);
            }

            cb(null, users.filter(function(v) {
                return v.type === 'User';
            }));
        });
    });
}

function getUser(nick, cb) {
    github.user(nick, function(err, d) {
        if(err) {
            return cb(err);
        }

        cb(null, {
            name: d.name || d.login,
            nick: d.login,
            homepage: d.blog,
            email: d.email,
            gravatar: d.gravatar_id,
            followers: d.followers,
            following: d.following,
            id: d.id,
            type: d.type
        });
    });
}
