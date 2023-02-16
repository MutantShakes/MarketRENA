import React from "react";
import { Container, Segment, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Header from "./Header";

const Layout = (props) => {
  return (
    <div>
      <Header name={props.name} />

      <Container style={{ marginBottom: 20, marginTop: "7em" }}>
        {props.children}
      </Container>
    </div>
  );
};

export default Layout;
