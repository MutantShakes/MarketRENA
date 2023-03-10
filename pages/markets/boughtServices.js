import React, { Component } from "react";
import Layout from "../../components/Layout";
import LabourMarket from "../../ethereum/labourMarket";
import BackButton from "../../components/backButton";
import { Table, Card, Image, Message, Button } from "semantic-ui-react";
import ServiceRow from "../../components/serviceRow";
import web3 from "../../ethereum/web3";

class BoughtServices extends Component {
  state = {
    account: "",
    complete: false,
    all: true,
  };
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

  async getAccount() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    this.setState({ account: account });
  }

  renderRowAll() {
    this.getAccount();
    return this.props.services.map((service, index) => {
      return (
        <ServiceRow
          key={index}
          id={index}
          service={service}
          buyer={this.state.account}
          header={this.getHeader(index).header}
          address={this.props.address}
          notCompleted={false}
        />
      );
    });
  }

  renderRowPending() {
    this.getAccount();
    return this.props.services.map((service, index) => {
      return (
        <ServiceRow
          key={index}
          id={index}
          service={service}
          buyer={this.state.account}
          header={this.getHeader(index).header}
          address={this.props.address}
          notCompleted={service.complete}
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
              <HeaderCell colSpan="4">
                <div className="ui two buttons">
                  <Button
                    color="yellow"
                    onClick={(event) =>
                      this.setState({ complete: false, all: true })
                    }
                    disabled={this.state.all}
                  >
                    All
                  </Button>

                  <Button
                    color="red"
                    onClick={(event) =>
                      this.setState({ complete: true, all: false })
                    }
                    disabled={this.state.complete}
                  >
                    Pending
                  </Button>
                </div>
              </HeaderCell>
            </Row>
          </Header>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Service</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Validation</HeaderCell>
            </Row>
          </Header>
          {this.state.all ? (
            <Body>{this.renderRowAll()}</Body>
          ) : (
            <Body>{this.renderRowPending()}</Body>
          )}
        </Table>
      </Layout>
    );
  }
}

export default BoughtServices;
