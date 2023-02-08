import React, { Component } from "react";
import { Table, Button, Modal, Icon, Label } from "semantic-ui-react";
import LabourMarket from "../ethereum/labourMarket";
import { Router } from "../routes";

class ServiceRow extends Component {
  state = {
    loading: false,
    error: false,
    success: false,
    msg: "",
    cancel: false,
  };
  buyerApprove = async () => {
    this.setState({ loading: true, msg: "" });
    try {
      const market = LabourMarket(this.props.address);
      await market.methods.buyerApproval(this.props.id).send({
        from: this.props.buyer,
      });
      this.setState({ success: true, icon: "checkmark", color: "green" });
      Router.replaceRoute(
        `/markets/Labour/boughtServices/${this.props.address}`
      );
    } catch (err) {
      this.setState({
        error: true,
        msg: err.message,
      });
    }
    this.setState({ loading: false });
  };

  buyerCancel = async () => {
    this.setState({ loading: true, msg: "" });
    try {
      const market = LabourMarket(this.props.address);
      await market.methods.cancelServiceBuyer(this.props.id).send({
        from: this.props.buyer,
      });
      this.setState({
        success: true,
        cancel: true,
      });
      Router.replaceRoute(
        `/markets/Labour/boughtServices/${this.props.address}`
      );
    } catch (err) {
      this.setState({
        error: true,
        msg: err.message,
      });
    }
    this.setState({ loading: false });
  };

  render() {
    const { Row, Cell } = Table;

    return (
      <Row hidden={this.props.buyer !== this.props.service.buyer}>
        <Cell>{this.props.service.requestTime}</Cell>
        <Cell>
          <Label ribbon size="large" color="red">
            {this.props.header}
          </Label>
        </Cell>

        {this.props.service.complete ? (
          <Cell positive>Completed</Cell>
        ) : (
          <Cell warning>Pending</Cell>
        )}

        <Cell>
          {this.props.service.complete ? (
            <Icon color="green" name="checkmark" size="large" />
          ) : (
            <div className="ui two buttons ">
              <Button
                color="yellow"
                onClick={this.buyerApprove}
                loading={this.state.loading}
                disabled={this.props.service.buyerApprove}
                fluid
              >
                Validate
              </Button>
              <Button
                color="red"
                onClick={this.buyerCancel}
                loading={this.state.loading}
                disabled={this.props.service.buyerApprove}
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
              <Button
                fluid
                color="red"
                inverted
                onClick={() => this.setState({ error: false })}
              >
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
                Validation successfull
              </Modal.Header>
            )}
            <Modal.Actions>
              <Button
                fluid
                color="yellow"
                inverted
                onClick={() => this.setState({ success: false })}
              >
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
