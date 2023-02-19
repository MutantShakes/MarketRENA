import React, { Component } from "react";
import Layout from "../../../components/Layout";
import BackButton from "../../../components/backButton";
import {
  Segment,
  Icon,
  Grid,
  Card,
  Button,
  List,
  Header,
  Message,
} from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import LabourMarket from "../../../ethereum/labourMarket";
import MarketDescription from "../../../components/ViewLabourMarket";

class MarketView extends Component {
  static async getInitialProps(props) {
    const { address, name } = props.query;
    const market = LabourMarket(address);
    const serviceTypesCount = await market.methods
      .getServiceTypesCount()
      .call();
    const sellerAddress = await market.methods.seller().call();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const serviceTypes = await Promise.all(
      Array(parseInt(serviceTypesCount))
        .fill()
        .map((element, index) => {
          return market.methods.serviceTypes(index).call();
        })
    );

    return {
      address,
      serviceTypes,
      serviceTypesCount,
      sellerAddress,
      account,
      name,
    };
  }

  createService = (event) => {
    Router.pushRoute(
      `/markets/Labour/newMarket/${this.props.address}/newService`
    );
  };

  viewPendingService = (event) => {
    Router.pushRoute(`/markets/Labour/pendingServices/${this.props.address}`);
  };

  getColorState(index) {
    if (this.props.serviceTypes[index].availability === true) {
      return "green";
    } else {
      return "red";
    }
  }

  renderCards() {
    return this.props.serviceTypes.map((serviceType, index) => {
      return (
        <MarketDescription
          serviceType={serviceType}
          key={index}
          id={index}
          address={this.props.address}
          color={this.getColorState(index)}
        />
      );
    });
  }

  render() {
    const isDisabled = this.props.sellerAddress === this.props.account;
    return (
      <Layout>
        <BackButton name="Services Provided" />

        <Grid stackable>
          <Grid.Column width={11}>
            <Card.Group stackable itemsPerRow={2}>
              {this.renderCards()}
            </Card.Group>
          </Grid.Column>
          <Grid.Column width={5}>
            <Card fluid raised style={{ overflowWrap: "break-word" }}>
              <Card.Content>
                <Button.Group vertical fluid>
                  <Button
                    fluid={true}
                    onClick={this.createService}
                    disabled={!isDisabled}
                    content="Create Service"
                    icon="add circle"
                    color="red"
                    labelPosition="right"
                  />
                  <Button
                    fluid={true}
                    onClick={this.viewPendingService}
                    disabled={!isDisabled}
                    content="Pending Service"
                    icon="question circle outline"
                    color="yellow"
                    labelPosition="right"
                  />
                </Button.Group>
              </Card.Content>
              <Card.Content>
                <Card.Header>{this.props.sellerAddress}</Card.Header>
                <Card.Meta> Address of the Seller </Card.Meta>
              </Card.Content>
              <Card.Content>
                <Card.Description>
                  <Header>Market Description </Header>
                  <List bulleted>
                    <List.Item>
                      <strong>Market Address:</strong> {this.props.address}
                    </List.Item>
                    <List.Item>
                      <strong> Services Provided:</strong>{" "}
                      {this.props.serviceTypesCount}
                    </List.Item>
                  </List>
                </Card.Description>
              </Card.Content>
              <Card.Content>
                <Button
                  fluid={true}
                  onClick={() =>
                    Router.pushRoute(
                      `/markets/${this.props.name}/boughtServices/${this.props.address}`
                    )
                  }
                  content="View Purchases "
                  icon="globe"
                  color="red"
                  labelPosition="left"
                />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default MarketView;
