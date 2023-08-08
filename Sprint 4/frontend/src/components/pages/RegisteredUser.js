const { currentTheme } = useTheme();
  const textColor = currentTheme === "light" ? "black" : "white";

  return (
    <div>
      <Container>
        <h2>Registered Students</h2>
        {students.map((student) => (
          <Paper key={student._id} style={{ color: textColor, marginBottom: "10px" }}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Name"
                value={student.name}
                variant="outlined"
                disabled
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Email"
                value={student.email}
                variant="outlined"
                disabled
              />
            </Box>
            {/* Add more information as needed */}
          </Paper>
        ))}
      </Container>
    </div>
  );
}

export default RegisteredStudents;