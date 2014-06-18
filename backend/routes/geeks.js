'use strict';

var async = require('async');
var prop = require('annofp').prop;
var Cache = require('mem-cache');
var cache = new Cache();

var token = require('../config').github;
var github = require('../lib/github')(token);


exports.list = function(req, res) {
    var location = req.query.location;

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    if(!location) {
        return res.json([]);
    }

    var data = cache.get(location);

    if(data) {
        return res.json(data);
    }

    github.users('location:' + location, function(err, d) {
        if(err) {
            console.error(err);

            return res.send(500);
        }

        var usernames = d.users.filter(function(user) {
            return user.type === 'user';
        }).map(prop('username'));

        async.map(usernames, github.user, function(err, users) {
            if(err) {
                console.error(err);

                return res.send(500);
            }

            var ret = users.map(function(v) {
                delete v.meta;
                delete v.plan;

                v.name = v.name || v.login;

                return v;
            });

            cache.set(location, ret);

            res.json(ret);
        });
    });
};
