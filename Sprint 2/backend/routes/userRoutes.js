const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

userRouter
    .route('/:id')    
    .get(userController.getUser)    
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

userRouter
    .route('/')
    .get(userController.getAllUsers)
    .delete(userController.deleteAllUsers);

userRouter
    .route('/:id/Posts')
    .get(postController.getIdPosts)
    .post(postController.createPost);

userRouter
    .route('/:id/Posts/:id')
    .get(postController.getPostById)
    .delete(postController.deletePost)
    .patch(postController.updatePost);

userRouter.get('/Users/:userId', userController.getUserById);

userRouter.patch('/:userId/update', userController.updateUser);

userRouter.patch('/Users/:userId/addInterview/:postId', userController.addInterview);

module.exports = userRouter;