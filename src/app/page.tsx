import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ScreenRecorder from "@/components/ScreenRecorder";

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ height: "100vh" }}>
          <ScreenRecorder />
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Home;
