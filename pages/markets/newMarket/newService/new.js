import React, { Component } from "react";
import Layout from "../../../../components/Layout";
import BackButton from "../../../../components/backButton";
import { Form, Input, Button, Message } from "semantic-ui-react";
import { Router } from "../../../../routes";
import web3 from "../../../../ethereum/web3";
import LabourMarket from "../../../../ethereum/labourMarket";

class CreateService extends Component {
  state = {
    header: "",
    description: "",
    cost: "",
    loading: false,
    success: false,
    error: false,
    Message: "",
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const market = LabourMarket(this.props.address);

    const { cost, description, header } = this.state;

    this.setState({ loading: true, Message: "", success: false, error: false });

    try {
      await market.methods
        .createService(header, description, cost)
        .send({ from: accounts[0] });

      this.setState({
        loading: false,
        success: true,
        Message: "Service succesfully created.",
      });
      setTimeout(
        () =>
          Router.pushRoute(`/markets/Labour/newMarket/${this.props.address}`),
        3000
      );
    } catch (err) {
      this.setState({ Message: err.message, error: true });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <BackButton name="Service Creation" />
        <Form
          inverted
          size="large"
          onSubmit={this.onSubmit}
          error={this.state.error}
          success={this.state.success}
        >
          <Form.Field required>
            <label>Market Header</label>
            <Input
              required
              value={this.state.header}
              placeholder="Market Name"
              onChange={(event) =>
                this.setState({ header: event.target.value })
              }
            />
          </Form.Field>
          <Form.TextArea
            required
            label="Market Description"
            value={this.state.description}
            placeholder="write your market description here..."
            onChange={(event) =>
              this.setState({ description: event.target.value })
            }
          />
          <Form.Field required>
            <label>Service Cost</label>
            <Input
              required
              label="Wei"
              labelPosition="right"
              placeholder="Enter value in Wei"
              value={this.state.cost}
              onChange={(event) => this.setState({ cost: event.target.value })}
            />
          </Form.Field>
          <Message
            floating
            success
            visible={this.state.success}
            header="SUCCESS"
            content={this.state.Message}
          />
          <Message
            floating
            error
            visible={this.state.error}
            header="ERROR"
            content={this.state.Message}
          />
          <Button
            loading={this.state.loading}
            type="submit"
            size="large"
            fluid
            color="red"
          >
            Create Service
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CreateService;
