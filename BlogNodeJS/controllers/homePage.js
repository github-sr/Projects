const post = require('../database/models/Post')

module.exports = async (req,res) => {
    const posts = await post.find({})

    // console.log(posts)

    res.render('index', {
        posts
    })
};

