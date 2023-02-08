import React, { Component } from "react";
import Layout from "../../components/Layout";
import LabourMarket from "../../ethereum/labourMarket";
import BackButton from "../../components/backButton";
import { Table, Card, Image, Message } from "semantic-ui-react";
import ServiceRow from "../../components/serviceRow";
import web3 from "../../ethereum/web3";

class BoughtServices extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const market = LabourMarket(address);
    const sellerAddress = await market.methods.seller().call();
    const servicesCount = await market.methods.getServiceCount().call();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const serviceTypesCount = await market.methods
      .getServiceTypesCount()
      .call();

    const services = await Promise.all(
      Array(parseInt(servicesCount))
        .fill()
        .map((element, index) => {
          return market.methods.services(index).call();
        })
    );

    const serviceTypes = await Promise.all(
      Array(parseInt(serviceTypesCount))
        .fill()
        .map((element, index) => {
          return market.methods.serviceTypes(index).call();
        })
    );

    return { account, address, sellerAddress, services, serviceTypes, market };
  }

  getHeader(index) {
    const { services, serviceTypes } = this.props;
    const id = services[index].serviceType;
    const header = serviceTypes[id].header;

    return { header };
  }

  renderRow() {
    return this.props.services.map((service, index) => {
      return (
        <ServiceRow
          key={index}
          id={index}
          service={service}
          buyer={this.props.account}
          header={this.getHeader(index).header}
          address={this.props.address}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout name="Services Purchased">
        <BackButton name="Services Purchased" />
        <Card.Group itemsPerRow={2} stackable>
          <Card style={{ overflowWrap: "break-word" }} raised>
            <Card.Content>
              <Card.Header>{this.props.address}</Card.Header>
              <Card.Meta>Market Address</Card.Meta>
            </Card.Content>
          </Card>
          <Card style={{ overflowWrap: "break-word" }} raised>
            <Card.Content>
              <Card.Header>{this.props.sellerAddress}</Card.Header>
              <Card.Meta>Seller Address</Card.Meta>
            </Card.Content>
          </Card>
        </Card.Group>

        <Table stackable celled striped selectable color="brown">
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Service</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Validation</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow()}</Body>
        </Table>
      </Layout>
    );
  }
}

export default BoughtServices;
