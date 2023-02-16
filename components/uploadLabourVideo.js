import React, { Component, useState } from "react";
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
  Header,
  Search,
  Divider,
} from "semantic-ui-react";
import { Router, Link } from "../../../routes";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useRouter } from "next/router";
import MarketFactory from "../ethereum/build/MarketFactory.json";

function uploadLabourVideo() {
  const router = useRouter();
  const { name } = router.query;

  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const errorHandling = {
    loading: false,
    Message: "",
    success: false,
    error: false,
  };

  const [msg, setMsg] = useState(errorHandling);
  const [openModal, setOpenModal] = useState(false);
  const [assetId, setAssetId] = useState("");

  const { config } = usePrepareContractWrite({
    address: "0x479444C66a5fA9AC77E9FbD19620aE62a3a9bD52",
    abi: MarketFactory.abi,
    functionName: "uploadLabourVideo",
    args: [assetId],
    overrides: {
      from: address,
    },
  });

  const contractWrite = useContractWrite(config);

  const { data, isLoading, isError, isSuccess } = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    onSuccess() {
      setTimeout(Router.back(), 2000);
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    contractWrite.write();
  };

  // Reminder to add Modal in this
  return (
    <Layout>
      <BackButton name="New Market" />

      <Segment placeholder inverted style={{ backgroundColor: "#0d0d0d" }}>
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical hidden />

          <Grid.Row verticalAlign="middle">
            <Grid.Column>
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

            <Grid.Column>
              <Header icon>
                <Icon name="globe" size="huge" color="yellow" />
              </Header>
              <Form onSubmit={onSubmit} error={isError} success={isSuccess}>
                <Message
                  success
                  style={{ overflowWrap: "break-word" }}
                  visible={isSuccess}
                  header="SUCCESS"
                  content="Market Successfully created."
                />
                <Message
                  style={{ overflowWrap: "break-word" }}
                  error
                  visible={isError}
                  header="ERROR"
                  content="Transaction Failed"
                />

                <Button
                  disabled={!contractWrite.write}
                  loading={isLoading}
                  color="yellow"
                  size="large"
                  fluid
                >
                  Create Market
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Layout>
  );
}

export default uploadLabourVideo;
