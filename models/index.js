// import all models
const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');
const Session = require('./Session');

// create associations
console.log(`Create associations: Each post has post owner, title, content`);
console.log(`Quantitative Rule: One User associates with one or more Posts`);
console.log(`Quantitative Rule: One Post associates with one User`);
console.log(`Qualitative Rule: User owns Post because User's removal will set Post's FK to NULL`);

User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

console.log(`Quantitative Rule: One Post associates with one or more Comments`);
console.log(`Quantitative Rule: One Comment associates with one Post`);
console.log(`Qualitative Rule: Post owns Comment because Post's removal will NULL Comment's FK`);

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'SET NULL'
});

console.log(`Create associations: The post being viewed has post owner, title, content, and comments`);
console.log(`Quantitative Rule: One User associates with one or more Comments`);
console.log(`Quantitative Rule: One Comment associates with one User`);
console.log(`Qualitative Rule: User owns Comment because User's removal will NULL Comment's FK`);

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});


module.exports = { User, Post, Comment, Session };