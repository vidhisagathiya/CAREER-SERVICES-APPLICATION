import React from 'react';

const JobPostingList = ({ jobPostings, onDelete }) => {
  return (
    <div>
      <h2>Job Postings List</h2>
      <ul>
        {jobPostings.map((posting) => (
          <li key={posting.id}>
            {posting.title} - {posting.company}
            <button onClick={() => onDelete(posting.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobPostingList;