import React, { Component } from "react";
import { Table, Button, Modal, Icon, Label } from "semantic-ui-react";
import LabourMarket from "../ethereum/labourMarket";
import { Router } from "../routes";

class ServiceRow extends Component {
  state = {
    loading: false,
    error: false,
    success: false,
    cancel: false,
    msg: "",
  };

  replaceRoute = (event) => {
    Router.replaceRoute(
      `/markets/Labour/pendingServices/${this.props.address}`
    );
    this.setState({ success: false, cancel: false });
  };

  sellerApprove = async () => {
    this.setState({ loading: true, msg: "" });
    try {
      const market = LabourMarket(this.props.address);
      await market.methods.sellerApproval(this.props.id).send({
        from: this.props.sellerAddress,
      });
      this.setState({ success: true });
    } catch (err) {
      this.setState({ error: true, msg: err.message });
    }
    this.setState({ loading: false });
  };

  sellerCancel = async () => {
    this.setState({ loading: true, msg: "" });
    try {
      const market = LabourMarket(this.props.address);
      await market.methods.cancelRequestSeller(this.props.id).send({
        from: this.props.sellerAddress,
      });
      this.setState({ success: true, cancel: true });
    } catch (err) {
      this.setState({ error: true, msg: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    const { Row, Cell } = Table;

    return (
      <Row>
        <Cell>{this.props.service.requestTime}</Cell>
        <Cell>
          <Label ribbon size="large" color="yellow">
            {this.props.header}
          </Label>
        </Cell>
        <Cell>{this.props.service.buyer}</Cell>
        {this.props.service.complete ? (
          <Cell positive>Completed</Cell>
        ) : (
          <Cell warning>Pending</Cell>
        )}

        <Cell>
          {this.props.service.complete ? (
            <Icon color="green" name="checkmark" size="large" />
          ) : (
            <div className="ui two buttons">
              <Button
                color="yellow"
                onClick={this.sellerApprove}
                loading={this.state.loading}
                fluid
                disabled={!this.props.service.buyerApprove}
              >
                Finalise
              </Button>
              <Button
                color="red"
                onClick={this.sellerCancel}
                loading={this.state.loading}
                fluid
              >
                Cancel
              </Button>
            </div>
          )}

          <Modal size="mini" basic open={this.state.error}>
            <Modal.Header as="h1" icon>
              <Icon color="red" size="huge" name="globe" />
              Something went Wrong
            </Modal.Header>
            <Modal.Actions>
              <Button fluid color="red" inverted onClick={this.replaceRoute}>
                OK
              </Button>
            </Modal.Actions>
          </Modal>

          <Modal size="mini" basic open={this.state.success}>
            {this.state.cancel ? (
              <Modal.Header as="h1" icon>
                <Icon color="yellow" size="huge" name="globe" />
                Cancellation successfull
              </Modal.Header>
            ) : (
              <Modal.Header as="h1" icon>
                <Icon color="yellow" size="huge" name="globe" />
                Finalisation successfull
              </Modal.Header>
            )}

            <Modal.Actions>
              <Button fluid color="yellow" inverted onClick={this.replaceRoute}>
                OK
              </Button>
            </Modal.Actions>
          </Modal>
        </Cell>
      </Row>
    );
  }
}

export default ServiceRow;
