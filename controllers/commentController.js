const Comment = require('../models/comment');
const successStatusCode = process.env.successStatusCode || 2000;
const badRequestResponseCode = process.env.badRequestResponseCode || 400

const postComment = async (req, res) => {
    const comment = new Comment({ ...req.body, userId: req.user.id });
    await comment.save();
    res.status(200).json({
        succeeded: true,
        message: "Action was successful",
        statusCode: successStatusCode,
        resultData: "Comment added"
    })
};

module.exports = postComment