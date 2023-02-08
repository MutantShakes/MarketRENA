import React from "react";
import { Container, Segment, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Header from "./Header";

const Layout = (props) => {
  return (
    <Container fluid>
      <style>
        {`
    html, body {
      background-color: #0d0d0d
 !important;
    }

  `}
      </style>
      <Header name={props.name} />

      <Container style={{ marginBottom: 20 }}>{props.children}</Container>
    </Container>
  );
};

export default Layout;
