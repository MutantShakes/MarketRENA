import React, { Component } from "react";
import { Icon, Segment } from "semantic-ui-react";
import { Router } from "../routes";

class BackButton extends Component {
  render() {
    const { name } = this.props;
    return (
      <h3>
        <Icon
          size="large"
          name="arrow alternate circle left outline"
          link={true}
          onClick={() => Router.back()}
        />
        {name}
      </h3>
    );
  }
}

export default BackButton;
