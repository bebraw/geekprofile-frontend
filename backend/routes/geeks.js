'use strict';

var async = require('async');
var prop = require('annofp').prop;

var token = require('../config').github;
var github = require('../lib/github')(token);


exports.list = function(req, res) {
    var location = req.query.location;

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    if(!location) {
        return res.json([]);
    }

    console.log('location', location);

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

            res.json(users.filter(function(v) {
                return v.hireable;
            }).map(function(v) {
                delete v.meta;
                delete v.plan;

                return v;
            }));
        });
    });
};
