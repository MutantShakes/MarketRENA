import React, { Component } from "react";
import Layout from "../../../components/Layout";
import BackButton from "../../../components/backButton";
import factory from "../../../ethereum/factory";
import web3 from "../../../ethereum/web3";
import {
  Form,
  Button,
  Message,
  Image,
  Icon,
  Segment,
  List,
  Grid,
} from "semantic-ui-react";
import { Router, Link } from "../../../routes";

class NewMarketCreation extends Component {
  state = {
    loading: false,
    Message: "",
    success: false,
    error: false,
  };

  static async getInitialProps(props) {
    const { name } = props.query;

    return { name };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ loading: true, Message: "", success: false, error: false });

    if (this.props.name === "Labour") {
      try {
        await factory.methods.createLabourMarket().send({ from: accounts[0] });

        this.setState({
          loading: false,
          success: true,
          Message: "Market succesfully created.",
        });
        setTimeout(() => Router.pushRoute(`/`), 3000);
      } catch (err) {
        this.setState({ Message: err.message, error: true });
      }
    } else if (this.props.name === "Goods") {
      try {
        await factory.methods.createPhysicalMarket().send({ from: address });

        this.setState({
          loading: false,
          success: true,
          Message: "Market succesfully created.",
        });
        setTimeout(() => Router.pushRoute(`/`), 3000);
      } catch (err) {
        this.setState({ Message: err.message, error: true });
      }
    }

    this.setState({ loading: false });
  };

  render() {
    // Reminder to add Modal in this
    return (
      <Layout>
        <BackButton name="New Market" />

        <Form
          onSubmit={this.onSubmit}
          error={this.state.error}
          success={this.state.success}
        >
          <Grid stackable>
            <Grid.Column width={5}>
              <Image size="medium" avatar src="/images/ETH_blockchain.jpeg" />
            </Grid.Column>
            <Grid.Column width={11}>
              <Message
                floating
                info
                header="Welcome to the Platfrom and start your Buisness
                journey with the decentralised network. Here payments are made
                easy and non-tamparable using Ethereum
                blockchain."
              />
              <Message info floating>
                <Message.Header>Creation Rules</Message.Header>
                <Message.List>
                  <Message.Item>
                    You can only create one Market at max.
                  </Message.Item>
                  <Message.Item>
                    Make sure you have enough ETH to make a market.
                  </Message.Item>
                </Message.List>
              </Message>
            </Grid.Column>
          </Grid>
          <Segment basic>
            <Message
              success
              visible={this.state.success}
              header="SUCCESS"
              content={this.state.Message}
            />
            <Message
              error
              visible={this.state.error}
              header="ERROR"
              content={this.state.Message}
            />
            <Button
              loading={this.state.loading}
              color="yellow"
              size="large"
              fluid
            >
              Create Market
            </Button>
          </Segment>
        </Form>
      </Layout>
    );
  }
}

export default NewMarketCreation;
