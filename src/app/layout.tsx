import * as React from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Metadata } from "next";

// const theme = createTheme({
//   status: {
//     danger: orange[500],
//   },
// });

export const metadata: Metadata = {
  title: "Screen Recording",
  description: "Descrete Screen Recording",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        {/* <ThemeProvider theme={theme}> */}
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {props.children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
