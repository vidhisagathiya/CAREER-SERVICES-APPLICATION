const { createPost, getPostById, getAllPosts, getPostsByCompany, applyToPost, updatePost, deletePost, deleteAllPosts, getCandidatesByPostId, addSelectedCandidate, getSelectedCandidates, getIdPosts } = require('.././controllers/postController');
const Post = require('.././models/posts');
const User = require('.././models/users');

jest.mock('.././models/posts', () => ({
    collection: {
      stats: jest.fn(),
    },
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
  }));

jest.mock('.././models/users', () => ({
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateMany: jest.fn(),
    find: jest.fn(),
  }));
  
  // Unit Testing for createPost Function
  describe('createPost', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {
          title: 'Test Post Title',
          company: 'Test Company',
          // ... Other fields ...
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create post successfully', async () => {
      const mockStats = {
        size: 10, // Simulating the size for the increment
      };
  
      Post.collection.stats.mockResolvedValue(mockStats); // Mocking Post.collection.stats to return the mockStats
  
      const mockNewPost = { _id: 'Test Post Title-10', ...req.body };
      Post.create.mockResolvedValue(mockNewPost); // Mocking Post.create to return the mockNewPost
  
      await createPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        value: mockNewPost,
      });
    });
  
    it('should handle errors and return a response with status 400', async () => {
      Post.collection.stats.mockRejectedValue(new Error('Backend error')); // Mocking Post.collection.stats to reject with an error
  
      await createPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'failed to create',
        message: new Error('Backend error'), // The error message will be an error string.
        value: req.body,
        warning: 'try again',
      });
    });
  });


  // Unit Testing for getPostById
  describe('getPostById', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          id: 'testPostId',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should retrieve post by ID successfully', async () => {
      const mockPost = {
        _id: 'testPostId',
        title: 'Test Post',
      };
  
      Post.findById.mockResolvedValue(mockPost); // Mocking Post.findById to return the mockPost
  
      await getPostById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        results: req.params.id,
        data: {
          myPost: mockPost,
        },
      });
    });
  
    it('should handle post not found and return a response with status 404', async () => {
      Post.findById.mockResolvedValue(null); // Mocking Post.findById to return null (post not found)
  
      await getPostById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        results: 'Post not found',
        status: 'Failed',
      });
    });
  
    it('should handle errors and return a response with status 406', async () => {
      Post.findById.mockRejectedValue(new Error('Backend error')); // Mocking Post.findById to reject with an error
  
      await getPostById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'Failed',
        message: new Error('Backend error'),
      });
    });
  });

  // Unit Test for getAllPosts function
  describe('getAllPosts', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should retrieve all posts successfully', async () => {
      const mockPosts = [
        { _id: 'post1', title: 'Post 1' },
        { _id: 'post2', title: 'Post 2' },
      ];
  
      Post.find.mockResolvedValue(mockPosts); // Mocking Post.find to return the mockPosts
  
      await getAllPosts(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        results: mockPosts.length,
        data: {
          all_Post: mockPosts,
        },
      });
    });
  
    it('should handle errors and return a response with status 404', async () => {
      Post.find.mockRejectedValue(new Error('Backend error')); // Mocking Post.find to reject with an error
  
      await getAllPosts(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'Failed',
        message: new Error('Backend error'),
      });
    });
  });


  // Unit test for getPostsByCompany function
  describe('getPostsByCompany', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          companyId: 'testCompanyId',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should retrieve posts by company successfully', async () => {
      const mockPosts = [
        { _id: 'post1', title: 'Post 1', company: 'testCompanyId' },
        { _id: 'post2', title: 'Post 2', company: 'testCompanyId' },
      ];
  
      Post.find.mockResolvedValue(mockPosts); // Mocking Post.find to return the mockPosts
  
      await getPostsByCompany(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        data: {
          posts: mockPosts,
        },
      });
    });
  
    it('should handle errors and return a response with status 400', async () => {
      Post.find.mockRejectedValue(new Error('Backend error')); // Mocking Post.find to reject with an error
  
      await getPostsByCompany(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'Failed to fetch posts',
        message: new Error('Backend error'),
      });
    });
  });


  // Unit Test for applyToPost function
  describe('applyToPost', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {
          userId: 'testUserId',
          postId: 'testPostId',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should apply to a post successfully', async () => {
      await applyToPost(req, res);
  
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('testUserId', {
        $addToSet: { applied: 'testPostId' },
      });
  
      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith('testPostId', {
        $addToSet: { candidates: 'testUserId' },
      });
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        message: 'Successfully applied to the post',
      });
    });
  
    it('should handle errors and return a response with status 400', async () => {
      User.findByIdAndUpdate.mockRejectedValue(new Error('Backend error')); // Mocking User.findByIdAndUpdate to reject with an error
  
      await applyToPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'failed',
        message: new Error('Backend error'),
      });
    });
  });

  // Unit testing for updateMany function
  describe('updatePost', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          id: 'testPostId',
        },
        body: {
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should update post successfully', async () => {
      User.updateMany.mockResolvedValue({}); // Mocking User.updateMany to resolve with an empty object
      Post.findByIdAndUpdate.mockResolvedValue({}); // Mocking Post.findByIdAndUpdate to resolve with an empty object
  
      await updatePost(req, res);
  
      expect(User.updateMany).toHaveBeenCalledWith(
        {
          applied: {
            $elemMatch: {
              id: 'testPostId',
            },
          },
        },
        {
          $pull: {
            applied: { id: 'testPostId' },
          },
        }
      );
  
      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
        'testPostId',
        expect.objectContaining({
          candidates: [],
        })
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        data: {
          myPost: {candidates: []},
        },
      });
    });
  
    it('should handle errors and return a response with status 500', async () => {
      User.updateMany.mockRejectedValue(new Error('Backend error')); // Mocking User.updateMany to reject with an error
  
      await updatePost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: new Error('Backend error'),
      });
    });
  });


  // Unit testing for deletePost function

  describe('deletePost', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          id: 'testPostId',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should delete post successfully', async () => {
      User.updateMany.mockResolvedValue({}); // Mocking User.updateMany to resolve with an empty object
      Post.findByIdAndDelete.mockResolvedValue({ _id: 'testPostId', title: 'Test Post' }); // Mocking Post.findByIdAndDelete to resolve with the deleted post
  
      await deletePost(req, res);
  
      expect(User.updateMany).toHaveBeenCalledWith(
        { applied: 'testPostId' },
        { $pull: { applied: 'testPostId' } }
      );
  
      expect(User.updateMany).toHaveBeenCalledWith(
        { interviews: 'testPostId' },
        { $pull: { interviews: 'testPostId' } }
      );
  
      expect(Post.findByIdAndDelete).toHaveBeenCalledWith('testPostId');
  
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'successfully deleted',
        data: { _id: 'testPostId', title: 'Test Post' },
      });
    });
  
    it('should handle errors and return a response with status 407', async () => {
      User.updateMany.mockRejectedValue(new Error('Backend error')); // Mocking User.updateMany to reject with an error
  
      await deletePost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(407);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: new Error('Backend error'),
      });
    });
  });

  // Unit Testing for deleteAllPost function
  describe('deleteAllPosts', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should delete all posts successfully', async () => {
      Post.deleteMany.mockResolvedValue({}); // Mocking Post.deleteMany to resolve with an empty object
  
      await deleteAllPosts(req, res);
  
      expect(Post.deleteMany).toHaveBeenCalled();
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
      });
    });
  
    it('should handle errors and return a response with status 404', async () => {
      Post.deleteMany.mockRejectedValue(new Error('Backend error')); // Mocking Post.deleteMany to reject with an error
  
      await deleteAllPosts(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: new Error('Backend error'),
      });
    });
  });


  // Unit testing for getCandidatesByPostId function
  describe('getCandidatesByPostId', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          postId: 'testPostId',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should get candidates by post ID successfully', async () => {
      const mockPost = {
        _id: 'testPostId',
        candidates: [
          { id: 'candidate1', name: 'Candidate 1' },
          { id: 'candidate2', name: 'Candidate 2' },
        ],
      };
  
      Post.findById.mockResolvedValue(mockPost); // Mocking Post.findById to return the mockPost
  
      await getCandidatesByPostId(req, res);
  
      expect(Post.findById).toHaveBeenCalledWith('testPostId');
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        data: {
          candidates: mockPost.candidates,
        },
      });
    });
  
    it('should handle errors and return a response with status 400', async () => {
      Post.findById.mockRejectedValue(new Error('Backend error')); // Mocking Post.findById to reject with an error
  
      await getCandidatesByPostId(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'failed',
        message: new Error('Backend error'),
      });
    });
  
    it('should handle post not found and return a response with status 404', async () => {
      Post.findById.mockResolvedValue(null); // Mocking Post.findById to return null (post not found)
  
      await getCandidatesByPostId(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'failed',
        message: 'Post not found',
      });
    });
  });

  // Unit testing for addSelectedCandidate function
  describe('addSelectedCandidate', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          postId: 'testPostId',
          userId: 'testUserId',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should add selected candidate to post successfully', async () => {
      const mockPost = {
        _id: 'testPostId',
        selectedCandidates: ['existingUserId'],
        candidates: ['testUserId', 'existingUserId'],
      };
  
      Post.findByIdAndUpdate.mockResolvedValue(mockPost); // Mocking Post.findByIdAndUpdate to return the mockPost
  
      await addSelectedCandidate(req, res);
  
      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
        'testPostId',
        {
          $addToSet: { selectedCandidates: 'testUserId' },
          $pull: { candidates: 'testUserId' },
        },
        { new: true, runValidators: true }
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        data: {
          post: mockPost,
        },
      });
    });
  
    it('should handle errors and return a response with status 400', async () => {
      Post.findByIdAndUpdate.mockRejectedValue(new Error('Backend error')); // Mocking Post.findByIdAndUpdate to reject with an error
  
      await addSelectedCandidate(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: new Error('Backend error'),
      });
    });
  });

  // Unit Testing for getSelectedCandidates function
  describe('getSelectedCandidates', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          postId: 'testPostId',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should get selected candidates for post successfully', async () => {
      const mockPost = {
        _id: 'testPostId',
        selectedCandidates: ['candidate1', 'candidate2'],
      };
  
      const mockSelectedCandidates = [
        { _id: 'candidate1', name: 'Candidate 1' },
        { _id: 'candidate2', name: 'Candidate 2' },
      ];
  
      Post.findById.mockResolvedValue(mockPost); // Mocking Post.findById to return the mockPost
      User.find.mockResolvedValue(mockSelectedCandidates); // Mocking User.find to return the mockSelectedCandidates
  
      await getSelectedCandidates(req, res);
  
      expect(Post.findById).toHaveBeenCalledWith('testPostId');
  
      expect(User.find).toHaveBeenCalledWith({
        _id: { $in: mockPost.selectedCandidates },
      });
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        data: {
          selectedCandidates: mockSelectedCandidates,
        },
      });
    });
  
    it('should handle errors and return a response with status 400', async () => {
      Post.findById.mockRejectedValue(new Error('Backend error')); // Mocking Post.findById to reject with an error
  
      await getSelectedCandidates(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: new Error('Backend error'), // The error message will be an error string.
      });
    });
  
    it('should handle post not found and return a response with status 404', async () => {
      Post.findById.mockResolvedValue(null); // Mocking Post.findById to return null (post not found)
  
      await getSelectedCandidates(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: 'Post not found',
      });
    });
  });

  // Unit Testing for getIdPosts function
  describe('getIdPosts', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {
          company: 'testCompany',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should get posts by company successfully', async () => {
      const mockPosts = [
        { _id: 'post1', title: 'Post 1', company: 'testCompany' },
        { _id: 'post2', title: 'Post 2', company: 'testCompany' },
      ];
  
      Post.find.mockResolvedValue(mockPosts); // Mocking Post.find to return the mockPosts
  
      await getIdPosts(req, res);
  
      expect(Post.find).toHaveBeenCalledWith({ company: 'testCompany' });
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        results: mockPosts.length,
        data: {
          all_Post: mockPosts,
        },
      });
    });
  
    it('should handle errors and return a response with status 404', async () => {
      Post.find.mockRejectedValue(new Error('Backend error')); // Mocking Post.find to reject with an error
  
      await getIdPosts(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: new Error('Backend error'),
      });
    });
  });