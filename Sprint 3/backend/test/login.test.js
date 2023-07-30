const { login } = require('./../controllers/loginController');
const User = require('./../models/users'); // Assuming you have a User model for the database
const bcrypt = require('bcrypt'); // Assuming you have bcrypt installed and required

jest.mock('./../models/users', () => ({
  findOne: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('login', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
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

  it('should return "E-mail doesn\'t exist" when user is not found', async () => {
    req.body.email = 'nonexistent@example.com';
    req.body.password = 'testPassword';

    User.findOne.mockResolvedValue(null); // Mocking the User.findOne to return null (user not found)

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "E-mail doesn't exist",
      value: null,
      Received: req.body,
    });
  });

  it('should return "Wrong Password" when the password is incorrect', async () => {
    req.body.email = 'test132@gmail.com';
    req.body.password = 'wrongPassword';

    const mockUser = {
      email: 'test132@gmail.com',
      password: 'qwerty123',
    };

    User.findOne.mockResolvedValue(mockUser); // Mocking the User.findOne to return the mockUser

    bcrypt.compare.mockResolvedValue(false); // Mocking bcrypt.compare to return false (wrong password)

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Wrong Password',
    });
  });

  it('should successfully log in with the correct credentials', async () => {
    req.body.email = 'test132@gmail.com';
    req.body.password = 'qwerty123';

    const mockUser = {
      email: 'test132@gmail.com',
      password: 'qwerty123', // Replace with the hashed password you expect
    };

    User.findOne.mockResolvedValue(mockUser); // Mocking the User.findOne to return the mockUser

    bcrypt.compare.mockResolvedValue(true); // Mocking bcrypt.compare to return true (correct password)

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      status: 'success',
      data: {
        userExist: mockUser,
      },
    });
  });

  it('should handle errors and return a response with status 406', async () => {
    req.body.email = 'existing@example.com';
    req.body.password = 'correctPassword';

    User.findOne.mockRejectedValue(new Error('Database error')); // Mocking the User.findOne to reject with an error

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(406);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 'fail',
      message: new Error('Database error'),
    });
  }); 
});
