const models = {
    User: require('./nosql/user.js'),
    Place: require('./nosql/place.js'),
    UserPlace: require('./nosql/userPlace.js'),
    Post: require('./nosql/post.js'),
}

module.exports = models;