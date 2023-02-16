import React, { Component, useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Card,
  Button,
  Modal,
  Icon,
  Image,
  Grid,
  Segment,
  Input,
  Message,
} from "semantic-ui-react";
import { Router } from "../routes";
import { useAccount, useContractRead } from "wagmi";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import LabourMarket from "../ethereum/build/LabourMarket.json";
import { Livepeer } from "../components/player";
import Load from "../components/tempUpload";

function MarketPlaceIndex(props) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const [found, setNotFound] = useState(true);
  const { theme, setTheme } = useTheme();
  const [addressM, setAddress] = useState("");

  const { data, isError, isLoading } = useContractRead({
    address: addressM,
    abi: LabourMarket.abi,
    functionName: "seller",
  });

  const handleItemClick = (event, { name }) => {
    if (name !== "Labour") {
    } else if (isConnected) {
      router.push({ pathname: `/markets/${name}`, query: { name } });
      // Router.pushRoute(`/markets/${name}`);
    } else {
      setOpenModal(true);
    }
  };

  const takeToMarket = (event) => {
    setNotFound(true);
    if (!isConnected) {
      setOpenModal(true);
    } else if (!isError && !isLoading && isConnected) {
      router.push({
        pathname: `/markets/Labour/newMarket/${addressM}`,
        query: { name: "Labour", address: addressM },
      });
    } else {
      setNotFound(false);
    }
  };

  return (
    <Layout name="marketRENA">
      <Grid stackable>
        <Grid.Column width={6}>
          <Card fluid raised>
            <Card.Content>
              <Card.Header as="h1" textAlign="center">
                Search
                <Icon name="search" />
              </Card.Header>
              <Message error hidden={found}>
                Market not Found.
              </Message>

              <Input
                fluid
                required
                label="#"
                labelPosition="left"
                placeholder="Enter Market Address"
                value={addressM}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Card.Content>
            <Card.Content>
              <Button
                fluid
                disabled={addressM === ""}
                color="red"
                onClick={takeToMarket}
                labelPosition="right"
                icon="search"
              >
                Go to Market
                <Icon name="search" />
              </Button>
            </Card.Content>

            <Card.Content>
              <Livepeer playId="a1a4c2r1alvrr4oh" />
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={10}>
          <Card.Group stackable>
            <Card
              fluid
              name="Labour"
              header="Labour Market"
              meta=""
              description="Get Labour assistant with transactions through Ethereum."
              color="yellow"
              onClick={handleItemClick}
            />

            <Card
              fluid
              name="card1"
              header="Custom Market"
              meta=""
              description="New Market..."
              color="yellow"
              onClick={handleItemClick}
            />
            <Card
              fluid
              name="card2"
              header="Custom Market"
              meta=""
              description="New Market..."
              color="yellow"
              onClick={handleItemClick}
            />
            <Card
              fluid
              name="card3"
              header="Custom Market"
              meta=""
              description="New Market..."
              color="yellow"
              onClick={handleItemClick}
            />
          </Card.Group>
        </Grid.Column>
      </Grid>

      <Modal
        size="mini"
        basic
        open={openModal}
        onClose={() => setOpenModal(false)}
        onOpen={() => setOpenModal(true)}
      >
        <Modal.Header as="h1" icon>
          <Icon color="yellow" size="huge" name="globe" />
          Connect Wallet to continue.
        </Modal.Header>
        <Modal.Actions>
          <Button
            fluid
            color="yellow"
            inverted
            onClick={() => setOpenModal(false)}
          >
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </Layout>
  );
}

export default MarketPlaceIndex;
