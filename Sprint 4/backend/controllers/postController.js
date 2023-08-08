const Post = require('../models/posts');
const User = require('../models/users');

const createPost = async (req, res) => {
    const rec_post = req.body;
    const increment = (await Post.collection.stats()).size.toString();

    rec_post._id = rec_post.title + "-" + increment;
    rec_post.company = rec_post.company;
    try {
        const newPost = await Post.create(rec_post);
        res.status(200).json({
            success: true,
            status: 'success',
            value: newPost
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 'failed to create',
            message: error,
            value: req.body,
            warning: 'try again'
        });
    }
};

const getPostById = async (req, res) => {
    try {
        const post_id = req.params.id;
        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(404).json({
                success: false,
                results: "Post not found",
                status: 'Failed',
            });
        }

        res.status(200).json({
            success: true,
            status: 'success',
            results: req.params._id,
            data: {
                myPost: post
            }
        });
    } catch (error) {
        res.status(406).json({
            success: false,
            status: 'Failed',
            message: error
        });
    }

};

const getAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find();

        res.status(200).json({
            success: true,
            status: 'success',
            results: allPosts.length,
            data: {
                all_Post: allPosts
            }
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            status: 'Failed',
            message: error
        });
    }

};

const getPostsByCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const posts = await Post.find({ company: companyId });

        res.status(200).json({
            success: true,
            status: "success",
            data: {
                posts: posts,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: "Failed to fetch posts",
            message: error,
        });
    }

};

const applyPost = async (req, res) => {

    try {

        const { _id } = req.body
        const user = await User.findById({ _id })
        const post = await Post.findById(req.params.id)
        const employer = await User.findById(user.company)

        const alreadyApplied = await Post.find({ _id: req.params.id }, {
            candidates: {
                $elemMatch: {
                    id: user.id
                }
            }
        })


        if (alreadyApplied[0].candidates.length != 0) {
            return res.status(404).json({
                success: false,
                results: "You have already applied for this position",
                status: 'Failed',
                data: alreadyApplied,
                candid: alreadyApplied[0].candidates
            })
        }

        const candidate = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            contact_info: {
                phone: user.phone,
                email: user.email
            },
            CV: user.CV
        }

        const employerStatus = {
            id: post.id,
            userId: user.id,
            name: user.name + " " + user.lastname,
            status: "pending"
        }

        const candidateStatus = {
            id: post.id,
            name: employer.company,
            status: "applied",
        }


        const updateUser = await User.findByIdAndUpdate(req.body._id,
            {
                $push: { applied: candidateStatus }
            })
        const updateEmployer = await User.findByIdAndUpdate(myPost.company,
            {
                $push: { applied: employerStatus }
            })

        const updatePost = await Post.findByIdAndUpdate(req.params.id,
            {
                $push: { candidates: candidate }
            })


        res.status(200).json({
            success: true,
            status: 'success'
        })

    } catch (error) {
        res.status(407).json({
            success: false,
            status: 'fail',
            message: error
        })
    }

};

const applyToPost = async (req, res) => {

    const { userId, postId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { $addToSet: { applied: postId } });

        await Post.findByIdAndUpdate(postId, { $addToSet: { candidates: userId } });

        res.status(200).json({
            success: true,
            status: "success",
            message: "Successfully applied to the post",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: "failed",
            message: error,
        });
    }

};

const updatePost = async (req, res) => {

    try {
        const removeCandidatesfromUsers = await User.updateMany({
            applied: {
                $elemMatch: {
                    id: req.params.id
                }
            }
        }, {
            $pull: {
                applied: { id: req.params.id }
            }
        })

        const modify = req.body
        modify.candidates = []
        const post = await Post.findByIdAndUpdate(req.params.id, modify)
        post.candidates = []

        res.status(200).json({
            success: true,
            status: 'success',
            data: {
                myPost: post
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'fail',
            message: error
        })
    }

};


const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        await User.updateMany(
            { applied: postId },
            { $pull: { applied: postId } }
        );

        await User.updateMany(
            { interviews: postId },
            { $pull: { interviews: postId } }
        );

        const deletedPost = await Post.findByIdAndDelete(postId);

        res.status(204).json({
            success: true,
            status: 'successfully deleted',
            data: deletedPost,
        });
    } catch (error) {
        res.status(407).json({
            success: false,
            status: 'fail',
            message: error,
        });
    }

};

const deleteAllPosts = async (req, res) => {
    try {
        const deletePosts = await Post.deleteMany({})

        res.status(200).json({
            success: true,
            status: 'success',
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            status: 'fail',
            message: error,
        })
    }
};

const getCandidatesByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                status: 'failed',
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            status: 'success',
            data: {
                candidates: post.candidates,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 'failed',
            message: error,
        });
    }

};

const addSelectedCandidate = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $addToSet: { selectedCandidates: req.params.userId },
                $pull: { candidates: req.params.userId },
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            status: 'success',
            data: {
                post: post,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 'fail',
            message: error,
        });
    }

};

const getSelectedCandidates = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                status: 'fail',
                message: 'Post not found',
            });
        }

        const selectedCandidateObjects = await User.find({
            _id: { $in: post.selectedCandidates },
        });

        res.status(200).json({
            success: true,
            status: 'success',
            data: {
                selectedCandidates: selectedCandidateObjects,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 'fail',
            message: error,
        });
    }

};

const getIdPosts = async (req,res) => {
    const {company} = req.body;
    try{
        const allPosts = await Post.find({company});
        res.status(200).json({
            success: true,
            status:'success',
            results:allPosts.length,
            data:{
                all_Post: allPosts
            }
        })
    }catch(error){
        res.status(404).json({
            success: false,
            status:'fail',
            message: error
        })
    }
};

module.exports = { createPost, getPostById, getAllPosts, getPostsByCompany, applyPost, applyToPost, updatePost, deletePost, deleteAllPosts, getCandidatesByPostId, addSelectedCandidate, getSelectedCandidates, getIdPosts};