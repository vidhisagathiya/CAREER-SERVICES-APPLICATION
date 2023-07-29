import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import { List, ListItem, ListItemText } from "@mui/material";

const AllApplications = () => {
  const { user, refetchUser } = useContext(UserContext);

  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  let appId = 0;

  useEffect(() => {
    if (user && user.applied) {
      setLoading(true);
      Promise.all(
        user.applied.map((id) =>
          fetch(`http://localhost:9000/Posts/getPost/${id}`)
        )
      )
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then(async (appliedData) => {
          const appliedTo = [];
          for (const data of appliedData) {
            const application = data.data.myPost;
            const companyId = application.company;
            const companyResponse = await fetch(
              `http://localhost:9000/Users/Users/${companyId}`
            );
            const companyData = await companyResponse.json();
            const company = companyData.data.user;
            appliedTo.push({ ...application, company });
          }
          setApplications(appliedTo);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setApplications(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, refetchUser, Storage]);
  console.log(applications)
  return (
    <>
      <div className="container2">
        <p className="form-title2" style={{ paddingTop: "5%" }}>Applied Jobs</p>
        {loading && <div>Loading...</div>}
        {error && <div>{`Error fetching data: ${error}`}</div>}
        {applications && (
          <List>
            {applications.map((application) => {
              appId++;
              return (
                <ListItem key={application["_id"]}>
                  {console.log(`${application["title"]}`)}
                  <ListItemText
                    primary={`${appId}. ${application["title"]} | ${application["location"]}`} secondary={application["description"]}
                  />
                </ListItem>
              );
            })}

          </List>
        )}
      </div>
    </>
  );
};

export default AllApplications;