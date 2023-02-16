import React, { Component } from "react";
import { Menu, Icon, Segment, Container } from "semantic-ui-react";
import { Router } from "../routes";
import { ConnectButton } from "@rainbow-me/rainbowkit";

class Header extends Component {
  state = { activeItem: "marketRENA" };

  handleItemClick = (event, { name }) => {
    Router.pushRoute(`/`);
    //this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item
            icon="globe"
            name="marketRENA"
            onClick={this.handleItemClick}
          />

          <Menu.Menu position="right">
            <Menu.Item>
              <ConnectButton />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

export default Header;
