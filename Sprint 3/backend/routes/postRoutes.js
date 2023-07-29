const express = require('express');
const postRouter = express.Router();

const postController = require('./../controllers/postController');

postRouter
    .route('/')
    .get(postController.getAllPosts)
    .delete(postController.deleteAllPosts);

postRouter  
    .route('/:id')
    .patch(postController.applyPost);

postRouter
    .route('/postJob')
    .post(postController.createPost);

postRouter
    .get('/getPost/:id', postController.getPostById);

postRouter
    .delete('/deletePost/:id', postController.deletePost);

postRouter
    .route("/apply")
    .post(postController.applyToPost);

postRouter
    .route('/company/:companyId')
    .get(postController.getPostsByCompany);

postRouter
    .route('/:postId/candidates')
    .get(postController.getCandidatesByPostId);

postRouter.patch('/Posts/:postId/selectCandidate/:userId', postController.addSelectedCandidate);

postRouter.get('/:postId/selectedCandidates', postController.getSelectedCandidates);

postRouter
    .route('/updatePost/:id')   
    .patch(postController.updatePost);

module.exports = postRouter;
