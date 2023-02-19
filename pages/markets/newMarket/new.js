import React, { Component, useState, useEffect } from "react";
import Layout from "../../../components/Layout";

import { Asset } from "../../../components/uploadVideo";
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
  Input,
  Modal,
  Card,
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
import factoryAddress from "../../../ethereum/factoryAddress";
import { AddVideo } from "../../../components/addVideo";
import { ModalMessage } from "../../../components/modal";

function NewMarketCreation() {
  const errorHandling = {
    loading: false,
    Message: "",
    success: false,
    error: false,
  };
  const router = useRouter();
  const { name } = router.query;
  const [openModal, setOpenModal] = useState("");
  const [msg, setMsg] = useState(errorHandling);
  const [marketOwned, setMarketOwned] = useState(true);
  const [assetId, setAssetId] = useState("");

  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const labourMarketOwned = useContractReads({
    contracts: [
      {
        address: factoryAddress,
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
    address: factoryAddress,
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

  return (
    <Layout>
      <BackButton name="New Market" />

      <Card.Group stackable itemsPerRow={2}>
        <Card raised link fluid onClick={() => setOpenModal("upload")}>
          <Card.Content>
            <Header icon>
              <Icon name="upload" />
              Upload Market Video
            </Header>
          </Card.Content>
        </Card>
        <Card raised link fluid onClick={() => setOpenModal("addVideo")}>
          <Card.Content>
            <Header icon>
              <Icon name="video" />
              Add Video
            </Header>
          </Card.Content>
        </Card>
      </Card.Group>

      <Modal
        open={openModal === "upload"}
        onOpen={() => setOpenModal("upload")}
        size="small"
      >
        <Icon name="close" link onClick={() => setOpenModal("")} />

        <Segment raised basic>
          <Header icon textAlign="center">
            <Icon name="upload" />
            Upload Market Video
          </Header>
          <Asset />
        </Segment>
      </Modal>

      <Modal
        open={openModal === "addVideo"}
        onClose={() => setOpenModal("")}
        onOpen={() => setOpenModal("addVideo")}
        size="mini"
      >
        <Icon name="close" link onClick={() => setOpenModal("")} />
        <Segment raised basic>
          <Header icon textAlign="center">
            <Icon name="video" />
            Add Video
          </Header>
          <Input
            style={{ marginTop: 10 }}
            fluid
            floated="center"
            icon="cloud upload"
            value={assetId}
            onChange={(event) => setAssetId(event.target.value)}
            placeholder="Enter playbackId..."
          />
          <AddVideo assetId={assetId} />
        </Segment>
      </Modal>

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
                <Icon name="globe" size="huge" />
              </Header>
              <Form onSubmit={onSubmit} error={isError} success={isSuccess}>
                <ModalMessage
                  message="Transaction Failed"
                  color="red"
                  openModal={isError}
                />
                <ModalMessage
                  message="Market Successfully created"
                  color="yellow"
                  openModal={isSuccess}
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Layout>
  );
}

export default NewMarketCreation;
