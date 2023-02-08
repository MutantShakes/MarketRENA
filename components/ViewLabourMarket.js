import React, { Component } from "react";
import { Card, Icon, Button, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import LabourMarket from "../ethereum/labourMarket";
import { Router } from "../routes";

class MarketDescription extends Component {
  state = {
    loading: false,
    errorMessage: "",
    errorStatus: "hidden",
  };

  buyService = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ loading: true });

    const market = LabourMarket(this.props.address);

    try {
      await market.methods.buyService(this.props.id).send({
        from: accounts[0],
        value: this.props.serviceType.value,
      });
      Router.replaceRoute(`/markets/Labour/newMarket/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message, errorStatus: "visible" });
    }
    this.setState({ loading: false });
  };

  render() {
    const { serviceType, address, color } = this.props;

    return (
      <Card raised>
        <Card.Content>
          <Message
            className={this.state.errorStatus}
            style={{ overflowWrap: "break-word" }}
            error
            header="ERROR"
            content={this.state.errorMessage}
          />
          <Card.Header>{serviceType.header}</Card.Header>
          <Card.Meta>Price: {serviceType.value} Wei</Card.Meta>
          <Card.Description>{serviceType.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <p>
            <Icon name="circle" color={color} />
            Availability
          </p>
          <Button
            disabled={!serviceType.availability}
            onClick={this.buyService}
            loading={this.state.loading}
            color="yellow"
            animated="fade"
            fluid
          >
            <Button.Content visible>Buy Service</Button.Content>
            <Button.Content hidden>
              <Icon name="angle double right" />
            </Button.Content>
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

export default MarketDescription;
