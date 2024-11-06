const config = require('config');
console.log(config.get('db'));

exports.mysql = {
    master:{
        host                :          config.get('db.host'),
        user                :          config.get('db.user'),
        password            :          config.get('db.password'),
        database            :          config.get('db.database'),
        port                :          config.get('db.port')
    }
}

exports.redis = {
    master:{
        host                :          config.get('redis.host'),
        password            :          config.get('redis.password'),
        port                :          config.get('redis.port'),
        prefix              :          config.get('redis.prefix')
    }
}

exports.mongo = {
    master:{
        url                 :          config.get('mongo.url'),
        // db                  :          config.get('mongo.db')
    }
},

exports.selectedDb = config.get('selectedDb');
