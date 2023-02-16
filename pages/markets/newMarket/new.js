import React, { Component, useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import Load from "../../../components/tempUpload";

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
  useContractReads,
} from "wagmi";
import { useRouter } from "next/router";
import MarketFactory from "../../../ethereum/build/MarketFactory.json";

function NewMarketCreation() {
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
  const [marketOwned, setMarketOwned] = useState(true);

  const labourMarketOwned = useContractReads({
    contracts: [
      {
        address: "0xfcAEeC326A8fB329ce5E80Ce0DC3150EdeA9a290",
        abi: MarketFactory.abi,
        functionName: "labourMarketOwned",
        args: [address],
      },
    ],
  });

  useEffect(() => {
    if (labourMarketOwned.isSuccess) {
      setMarketOwned(labourMarketOwned.data[0]);
    }
  }, [labourMarketOwned, address]);

  const { config } = usePrepareContractWrite({
    address: "0xfcAEeC326A8fB329ce5E80Ce0DC3150EdeA9a290",
    abi: MarketFactory.abi,
    functionName: "createLabourMarket",
    overrides: {
      from: address,
    },
  });

  const contractWrite = useContractWrite(config);

  const { data, isLoading, isError, isSuccess } = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    onSuccess(data) {
      console.log("Success:", data);
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

      <Segment placeholder>
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical />

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
                  disabled={!contractWrite.write || marketOwned}
                  loading={isLoading}
                  color="yellow"
                  size="large"
                  fluid
                >
                  Create Market
                </Button>
              </Form>
              <Load />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Layout>
  );
}

export default NewMarketCreation;
