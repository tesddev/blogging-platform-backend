const marked = require('marked');
const Post = require('../models/post');
const successStatusCode = process.env.successStatusCode || 200;
const badRequestResponseCode = process.env.badRequestResponseCode || 400

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const htmlContent = marked.parse(post.content);
        res.status(200).json({ title: post.title, content: htmlContent });
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch post', details: error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}, 'title content authorId');

        const formattedPosts = posts.map(post => ({
            postId: post._id,
            postPreview: post.content.substring(0, 100),
            title: post.title,
            authorId: post.authorId,
            htmlContent: marked.parse(post.content)
        }));
        
        res.status(200).json({
            succeeded: true,
            message: "Action was successful",
            statusCode: successStatusCode,
            resultData: formattedPosts
        })
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch posts', details: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const post = new Post({ 
            ...req.body, 
            authorId: req.user.id
        });

        await post.save();
        res.status(201).json({
            succeeded: true,
            message: "Action was successful",
            statusCode: successStatusCode,
            resultData: 'Post created successfully'
        })
    } catch (error) {
        res.status(500).json({ error: 'Unable to create post', details: error.message });
    }
};

const editPost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({
            succeeded: true,
            message: "Post updated successfully",
            statusCode: 200,
            resultData: updatedPost,
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to update post', details: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({
            succeeded: true,
            message: "Post deleted successfully",
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete post', details: error.message });
    }
};

module.exports = { getPost, createPost, getAllPosts, editPost, deletePost };
