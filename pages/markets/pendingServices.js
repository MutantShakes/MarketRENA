import React, { Component } from "react";
import Layout from "../../components/Layout";
import LabourMarket from "../../ethereum/labourMarket";
import BackButton from "../../components/backButton";
import { Table, Card, Image } from "semantic-ui-react";
import PendingServiceRow from "../../components/pendingServiceRow";
import web3 from "../../ethereum/web3";

class PendingServices extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const market = LabourMarket(address);
    const sellerAddress = await market.methods.seller().call();
    const servicesCount = await market.methods.getServiceCount().call();

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

    return { address, sellerAddress, services, serviceTypes, market };
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
        <PendingServiceRow
          key={index}
          id={index}
          service={service}
          sellerAddress={this.props.sellerAddress}
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
        <Table celled padded color="brown">
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Service</HeaderCell>
              <HeaderCell>Buyer Address</HeaderCell>
              <HeaderCell>Status</HeaderCell>

              <HeaderCell>Finalise</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow()}</Body>
        </Table>
      </Layout>
    );
  }
}

export default PendingServices;
