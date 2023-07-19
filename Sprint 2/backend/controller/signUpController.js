const Candidate = require('../models/candidate');
const Employer = require('../models/employer');

const candidateSignup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
  
    try {
      // Check if a candidate with the same email already exists
      const existingCandidate = await Candidate.findOne({ email });
  
      if (existingCandidate) {
        return res.status(409).json({
            message: 'Candidate already exists',
            sucess: false,
            value: existingCandidate,
            Recevied: req.body});
      }
  
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new candidate instance
      
      const candidate = new Candidate({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        phone,
      });
  
      // Save the candidate to the database
      await candidate.save();
  
      // Return a success response
      return res.status(201).json({ message: 'Candidate created successfully', candidate });
    } catch (error) {
      console.error('Error during candidate signup:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };