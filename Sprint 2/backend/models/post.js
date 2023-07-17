const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date_posted: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  candidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
    },
  ],
  selectedCandidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;