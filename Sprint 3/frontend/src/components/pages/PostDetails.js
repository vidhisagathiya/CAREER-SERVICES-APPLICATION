import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { List, ListItem, ListItemText, Button } from '@mui/material';

const PostDetails = () => {
  const { postId } = useParams();
  const [candidateIds, setCandidateIds] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const response = await fetch(`http://localhost:9000/Posts/${postId}/selectedCandidates`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setSelectedCandidates(data.data.selectedCandidates);
      } catch (err) {
        console.error('Error fetching selected candidates:', err);
      }
    };

    fetchSelectedCandidates();
  }, [postId]);


  const handleSelectForInterview = async (candidateId) => {
    try {
      await fetch(`http://localhost:9000/Posts/Posts/${postId}/selectCandidate/${candidateId}`, {
        method: 'PATCH',
      });
      await fetch(`http://localhost:9000/Users/Users/${candidateId}/addInterview/${postId}`, {
        method: 'PATCH',
      });
      // Refresh the candidates list to reflect the change
      setCandidates(candidates.filter((candidate) => candidate._id !== candidateId));
    } catch (err) {
      console.error('Error selecting candidate for interview:', err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await fetch(`http://localhost:9000/Posts/deletePost/${postId}`, {
        method: 'DELETE',
      });
      // Redirect to another page after successful deletion, e.g., the home page
      // Replace this with the desired path
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:9000/Posts/${postId}/candidates`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }
        return response.json();
      })
      .then((actualData) => {
        setCandidateIds(actualData.data.candidates);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setCandidateIds(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId]);

  useEffect(() => {
    if (candidateIds) {
      setLoading(true);
      Promise.all(candidateIds.map((id) => fetch(`http://localhost:9000/Users/Users/${id}`)))
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((candidateData) => {
          setCandidates(candidateData.map((data) => data.data.user));
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setCandidates([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [candidateIds]);

  return (
    <div className="container2">
      <p className="form-title2" style={{ paddingTop: "5%" }}>Applied Candidates</p>
      {loading && <div>Loading...</div>}
      {error && <div>{`Error fetching data: ${error}`}</div>}
      <div className="flex">
        <p style={{ fontWeight: '700', fontSize: '17px', margin: '15px 0 0' }}>Candidate Names</p>
        <p style={{ fontWeight: '700', fontSize: '17px', margin: '15px 0 0' }}>Email Address</p>
        {/* <p style={{ fontWeight: '700', fontSize: '17px', textDecoration: 'underline', margin: '15px 0 0' }}>Resume</p> */}
        <p style={{ fontWeight: '700', fontSize: '17px', margin: '15px 0 0' }}>Status</p>
      </div>
      <List>
        {candidates &&
          candidates.map((candidate, index) => (
            <ListItem key={index}>
              <ListItemText primary={candidate.name} style={{ textAlign: 'center' }} />
              <ListItemText primary={candidate.email} style={{ textAlign: 'center' , marginRight:'0px' }} />
              {/* <ListItemText primary={candidate.name} style={{ textAlign: 'center' }} /> */}
              <Button variant="outlined" onClick={() => handleSelectForInterview(candidate._id)} style={{ minWidth: '195px', maxHeight: '30px', fontSize: '13px', textTransform: 'capitalize', marginRight:'5px' }}>
                Select for Interview
              </Button>
            </ListItem>
          ))}
        {selectedCandidates &&
          selectedCandidates.map((candidate, index) => (
            <ListItem key={index}>
              <ListItemText primary={candidate.name} />
              <Button variant="contained" color="warning">
                Already Selected
              </Button>
            </ListItem>
          ))}
      </List>
      <div className="bt">
        <Button variant="contained" color="error" style={{ margin: '25px auto' }} onClick={handleDeletePost} >
          Delete Post
        </Button>
      </div>
    </div>
  );

};

export default PostDetails;
