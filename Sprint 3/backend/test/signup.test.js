const { createUser } = require('.././controllers/signUpController');
const User = require('.././models/users');
const bcrypt = require('bcrypt');

jest.mock('.././models/users'); // Mocking the User model

describe('createUser (SignUp) function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                company: 'Test Company',
                password: 'test12356',
                User_type: 'employer', // or 'User'
                // Add other required properties
            },
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user', async () => {
        User.findOne.mockResolvedValue(null);
        User.collection = { stats: jest.fn(() => ({ size: 10 })) };
        bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
        User.create.mockResolvedValue(req.body);

        await createUser(req, res);

        expect(User.findOne).toHaveBeenCalledTimes(2); // Once for email and once for company
        expect(bcrypt.hash).toHaveBeenCalledWith('test12356', 10);
        expect(User.create).toHaveBeenCalledWith({
            ...req.body,
            password: 'hashedPassword',
            _id: 'Test Companyundefined', // Adjust the expected _id accordingly
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            status: 'success',
            value: req.body,
        });
    });

    it('should return an error when email already exists', async () => {
        User.findOne.mockResolvedValue({ email: 'test@example.com' });

        await createUser(req, res);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'E-mail already exists',
            value: { email: 'test@example.com' },
            Received: req.body,
        });
    });

    
it('should return an error when company already exists', async () => {
    User.findOne
        .mockResolvedValueOnce(null) // For email check
        .mockResolvedValueOnce({ company: 'Test Company' }); // For company check

    await createUser(req, res);

    expect(User.findOne).toHaveBeenCalledTimes(2); // Once for email and once for company
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'company already exists',
        value: { company: 'Test Company' },
        Received: req.body,
    });
});
    // Add more test cases as needed
});
