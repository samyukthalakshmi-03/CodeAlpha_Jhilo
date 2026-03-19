const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ message: 'Post ID and content are required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      post: postId,
      author: req.userId,
      content
    });

    await comment.save();
    post.comments.push(comment._id);
    await post.save();

    await comment.populate('author', 'username avatar');

    // Create comment notification (only if the commenter is not the post author)
    if (post.author.toString() !== req.userId) {
      const notification = new Notification({
        toUser: post.author,
        fromUser: req.userId,
        type: 'comment',
        post: postId,
        content: content.substring(0, 100) // Store first 100 chars of comment
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Comment created', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .populate('likes', 'username');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update comment
router.put('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { content } = req.body;
    if (content) comment.content = content;

    await comment.save();
    res.json({ message: 'Comment updated', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete comment
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const postId = comment.post;
    await Comment.findByIdAndDelete(req.params.commentId);

    // Remove comment from post
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: req.params.commentId }
    });

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like comment
router.post('/:commentId/like', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    comment.likes.push(req.userId);
    await comment.save();

    res.json({ message: 'Comment liked', likeCount: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unlike comment
router.post('/:commentId/unlike', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.likes = comment.likes.filter((id) => id.toString() !== req.userId);
    await comment.save();

    res.json({ message: 'Comment unliked', likeCount: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
