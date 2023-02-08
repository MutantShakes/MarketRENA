import React, { Component } from "react";
import { Menu, Icon, Segment } from "semantic-ui-react";
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
      <Menu inverted secondary stackable size="huge">
        <Menu.Item fitted="vertically">
          <Icon color="yellow" name="globe" size="huge" />
        </Menu.Item>
        <Menu.Item
          name="marketRENA"
          color="yellow"
          active={activeItem === "marketRENA"}
          onClick={this.handleItemClick}
        />

        <Menu.Menu position="right">
          <Menu.Item>
            <ConnectButton />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;
