const User = require('../models/users');
const { getUser, getAllUsers, updateUser, deleteUser, deleteAllUsers, addInterview } = require('../controllers/userController');

jest.mock('.././models/users', () => ({
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
}));

// Unit test for get user by ID
describe('getUser', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {
                id: 'testUserId',
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

    it('should return "User not found" when user is not found', async () => {
        User.findById.mockResolvedValue(null); // Mocking User.findById to return null (user not found)

        await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            results: 'User not found',
            status: 'Failed',
            data: req.body,
        });
    });

    it('should successfully retrieve the user with valid id', async () => {
        const mockUser = {
            _id: 'testUserId',
            name: 'Test User',
            //password: 'testPassword',
        };

        User.findById.mockResolvedValue(mockUser); // Mocking User.findById to return the mockUser

        await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            status: 'success',
            results: 'testUserId',
            data: { myUser: mockUser },
        });
    });

    it('should handle errors and return a response with status 406', async () => {
        User.findById.mockRejectedValue(new Error('Database error')); // Mocking User.findById to reject with an error

        await getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(406);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 'fail',
            message: new Error('Database error'),
        });
    });
});



// Unit test for get all users (Admin functionality)
describe('getAllUsers', () => {
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

    it('should retrieve all users successfully', async () => {
        const mockUsers = [
            { _id: 'user1', name: 'User 1' },
            { _id: 'user2', name: 'User 2' },
        ];

        User.find.mockResolvedValue(mockUsers); // Mocking User.find to return the mockUsers

        await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            status: 'success',
            results: mockUsers.length,
            data: {
                all_users: mockUsers,
            },
        });
    });

    it('should handle errors and return a response with status 500', async () => {
        User.find.mockRejectedValue(new Error('Database error')); // Mocking User.find to reject with an error

        await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 'fail',
            message: new Error('Database error'), 
            value: null,
        });
    });
});

// Unit test to update user
describe('updateUser', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {
                userId: 'testUserId',
            },
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return "Invalid updates!" for invalid updates', async () => {
        req.body = {
            invalidField: 'Invalid Value',
        };

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 'fail',
            message: 'Invalid updates!',
        });
    });

    it('should update user successfully with valid updates', async () => {
        req.body = {
            name: 'Updated Name',
            company: 'Updated Company',
        };

        const mockUpdatedUser = {
            _id: 'testUserId',
            name: 'Updated Name',
            company: 'Updated Company',
        };

        User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser); // Mocking User.findByIdAndUpdate to return the mockUpdatedUser

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            status: 'success',
            data: {
                user: mockUpdatedUser,
            },
        });
    });

    it('should handle user not found and return a response with status 404', async () => {
        req.body = {
            name: 'Updated Name',
        };

        User.findByIdAndUpdate.mockResolvedValue(null); // Mocking User.findByIdAndUpdate to return null (user not found)

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 'fail',
            message: 'User not found',
        });
    });

    it('should handle errors and return a response with status 500', async () => {
        req.body = {
            name: 'Updated Name',
        };

        User.findByIdAndUpdate.mockRejectedValue(new Error('Database error')); // Mocking User.findByIdAndUpdate to reject with an error

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 'fail',
            message: new Error('Database error'),
        });
    });
});

// Unit test to delete user by id (Admin Functionality)
describe('deleteUser', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
          id: 'testUserId',
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
  
    it('should delete user successfully', async () => {
      const mockDeletedUser = {
        _id: 'testUserId',
        name: 'Deleted User',
      };
  
      User.findByIdAndDelete.mockResolvedValue(mockDeletedUser); // Mocking User.findByIdAndDelete to return the mockDeletedUser
  
      await deleteUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockDeletedUser,
      });
    });
  
    it('should handle errors and return a response with status 500', async () => {
      User.findByIdAndDelete.mockRejectedValue(new Error('Database error')); // Mocking User.findByIdAndDelete to reject with an error
  
      await deleteUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: new Error('Database error'), 
      });
    });
  });


// Unit testing for deleting all users (Admin Functionality)
describe('deleteAllUsers', () => {
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
  
    it('should delete all users successfully', async () => {
      User.deleteMany.mockResolvedValue({}); // Mocking User.deleteMany to return an empty object
  
      await deleteAllUsers(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        success: true,
      });
    });
  
    it('should handle errors and return a response with status 500', async () => {
      User.deleteMany.mockRejectedValue(new Error('Database error')); // Mocking User.deleteMany to reject with an error
  
      await deleteAllUsers(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: new Error('Database error'), 
        success: false,
      });
    });
  });



  // Unit testing for adding an interview 

  describe('addInterview', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        params: {
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
  
    it('should add interview successfully', async () => {
      const mockUpdatedUser = {
        _id: 'testUserId',
        name: 'Updated User',
        interviews: ['existingPostId'],
      };
  
      User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser); // Mocking User.findByIdAndUpdate to return the mockUpdatedUser
  
      await addInterview(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 'success',
        data: {
          user: mockUpdatedUser,
        },
      });
    });
  
    it('should handle errors and return a response with status 500', async () => {
      User.findByIdAndUpdate.mockRejectedValue(new Error('Database error')); // Mocking User.findByIdAndUpdate to reject with an error
  
      await addInterview(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: new Error('Database error'),
        success: false,
      });
    });
  });