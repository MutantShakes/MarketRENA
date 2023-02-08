import React, { Component } from "react";
import { Icon, Segment } from "semantic-ui-react";
import { Router } from "../routes";

class BackButton extends Component {
  render() {
    const { name } = this.props;
    return (
      <Segment inverted basic style={{ backgroundColor: "#0d0d0d" }}>
        <h3>
          <Icon
            inverted
            size="large"
            name="arrow alternate circle left outline"
            link={true}
            onClick={() => Router.back()}
          />
          {name}
        </h3>
      </Segment>
    );
  }
}

export default BackButton;
