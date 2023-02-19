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
import MarketFactory from "../ethereum/build/MarketFactory.json";
import { Livepeer } from "../components/player";

function MarketPlaceIndex(props) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const [found, setNotFound] = useState(true);
  const { theme, setTheme } = useTheme();
  const [addressM, setAddress] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");

  const { data, isError, isLoading, isSuccess } = useContractRead({
    address: "0xfcAEeC326A8fB329ce5E80Ce0DC3150EdeA9a290",
    abi: MarketFactory.abi,
    functionName: "getLabourMarket",
    args: [sellerAddress],
  });

  console.log(data);

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
    } else if (addressM === "") {
      if (isSuccess) {
        router.push({
          pathname: `/markets/Labour/newMarket/${data}`,
          query: { name: "Labour", address: data },
        });
      }
    } else if (addressM !== "") {
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
                Search Market
                <Icon name="search" />
              </Card.Header>
              <Message error hidden={found}>
                Market not Found.
              </Message>

              <Input
                disabled={sellerAddress !== ""}
                fluid
                required
                label="#"
                labelPosition="left"
                placeholder="Enter Market Address"
                icon="search"
                value={addressM}
                onChange={(event) => setAddress(event.target.value)}
              />
              <Input
                disabled={addressM !== ""}
                style={{ marginTop: 10 }}
                fluid
                required
                label="@"
                labelPosition="left"
                placeholder="Enter Seller Address"
                icon="search"
                value={sellerAddress}
                onChange={(event) => setSellerAddress(event.target.value)}
              />
            </Card.Content>
            <Card.Content>
              <Button
                fluid
                disabled={addressM === "" && sellerAddress === ""}
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
              <Livepeer playId="3ff8a0vbr217nob0" title="Website Tutorial" />
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
              color="black"
              onClick={handleItemClick}
            />

            <Card
              fluid
              name="card1"
              header="Custom Market"
              meta=""
              description="New Market..."
              color="black"
              onClick={handleItemClick}
            />
            <Card
              fluid
              name="card2"
              header="Custom Market"
              meta=""
              description="New Market..."
              color="black"
              onClick={handleItemClick}
            />
            <Card
              fluid
              name="card3"
              header="Custom Market"
              meta=""
              description="New Market..."
              color="black"
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
