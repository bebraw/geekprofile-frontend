'use strict';

var github = new (require('github'))({
    version: '3.0.0',
    protocal: 'https',
    timeout: 5000
});

function auth(token) {
    if(token) {
        github.authenticate({
            type: 'oauth',
            token: token
        });
    }
    else {
        console.warn('No GitHub auth token was provided!');
    }

    return {
        users: users,
        user: user,
        members: members
    };
}
module.exports = auth;

function users(keyword, cb) {
    github.search.users({
        keyword: keyword
    }, cb);
}

function user(nick, cb) {
    github.user.getFrom({
        user: nick
    }, cb);
}

function members(org, cb) {
    github.orgs.getMembers({
        org: org
    }, cb);
}