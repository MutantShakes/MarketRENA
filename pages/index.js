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

function MarketPlaceIndex(props) {
  const marketSearch = {
    labour: true,
    goods: false,
  };
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(marketSearch);
  const [found, setNotFound] = useState(true);
  const { theme, setTheme } = useTheme();
  const [addressM, setAddress] = useState("");

  const { data, isError, isLoading } = useContractRead({
    address: addressM,
    abi: LabourMarket.abi,
    functionName: "seller",
  });

  const handleItemClick = (event, { name }) => {
    if (name === "Goods") {
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
    } else if (!isError && !isLoading && isConnected && search.labour) {
      router.push({
        pathname: `/markets/Labour/newMarket/${addressM}`,
        query: { name: "Labour", address: addressM },
      });
    } else if (isConnected && search.goods) {
      router.push({
        pathname: `/markets/Goods/newMarket/${addressM}`,
        query: { name: "Goods", address: addressM },
      });
    } else {
      setNotFound(false);
    }
  };

  return (
    <Layout name="marketRENA">
      <Grid stackable>
        <Grid.Column width={6}>
          <Card fluid>
            <Card.Content>
              <Button.Group fluid>
                <Button
                  color="yellow"
                  disabled={search.labour}
                  onClick={() =>
                    setSearch({ ...search, labour: true, goods: false })
                  }
                >
                  Labour
                </Button>
                <Button
                  color="red"
                  disabled={search.goods}
                  onClick={() =>
                    setSearch({ ...search, labour: false, goods: true })
                  }
                >
                  Goods
                </Button>
              </Button.Group>
            </Card.Content>
            <Card.Content>
              <Input
                fluid
                required
                label="#"
                labelPosition="left"
                placeholder="Enter Market Address"
                value={addressM}
                onChange={(event) => setAddress(event.target.value)}
              />
              <Message error hidden={found}>
                Market not Found.
              </Message>
            </Card.Content>
            <Card.Content>
              <Button
                fluid
                color="yellow"
                disabled={search.goods}
                onClick={takeToMarket}
              >
                Go to Market
              </Button>
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
              color="purple"
              onClick={handleItemClick}
            />

            <Card
              fluid
              name="Goods"
              header="Goods Market"
              meta=""
              description="Buy and Sell physical goods at this decentralised platform."
              color="yellow"
              onClick={handleItemClick}
            />
          </Card.Group>
        </Grid.Column>
      </Grid>

      <Modal size="mini" basic open={openModal}>
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
