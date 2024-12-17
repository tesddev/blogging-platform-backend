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

const deleteComment = async (req, res) => {
    try {
        // Fetch the comment by ID
        const comment = await Comment.findById(req.params.id);

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(req.params.id);

        // Send success response
        res.status(200).json({
            succeeded: true,
            message: 'Comment deleted successfully',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).json({
            error: 'Unable to delete comment',
            details: error.message
        });
    }
};

module.exports = { postComment, deleteComment }