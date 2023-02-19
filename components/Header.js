import React, { Component } from "react";
import { Menu, Icon, Segment, Container, Image } from "semantic-ui-react";
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
          <Menu.Item onClick={this.handleItemClick}>
            <Image
              avatar
              size="mini"
              src="/images/logo.png"
              style={{ marginRight: "1.5em" }}
            />
            MarketRENA
          </Menu.Item>

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
