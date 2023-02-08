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
} from "semantic-ui-react";
import { Router } from "../routes";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

function PurchaseDetails(props) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const handleItemClick = (event, { name }) => {
    if (isConnected) {
      router.push({ pathname: `/markets/${name}`, query: { name } });
      // Router.pushRoute(`/markets/${name}`);
    } else {
      setOpenModal(true);
    }
  };

  return (
    <Layout name="marketRENA">
      <Grid stackable>
        <Grid.Column width={6}></Grid.Column>
        <Grid.Column width={10}>
          <Card.Group stackable>
            <Card
              fluid
              name="Labour"
              header="Labour Market"
              meta=""
              description="Get Labour assistant on transactions through Ethereum."
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

export default PurchaseDetails;
