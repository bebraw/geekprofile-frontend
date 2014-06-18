'use strict';
var finder = require('find-rss');
var parse = require('parse-rss');


exports.get = function getRSS(url, cb) {
    // note, fails without www
    finder(url, function(err, res) {
        if(err) {
            return cb(err);
        }

        if(res.length) {
            parse(res[0].url, function(err, res) {
                if(err) {
                    return cb(err);
                }

                cb(null, res.slice(0, 10).map(function(v) {
                    return {
                        title: v.title,
                        url: v.link,
                        //description: v.description, (whole entry)
                        //date: v.date,
                        //categories: v.categories
                    };
                }));
            });
        }
    });
};
