import React, { useState, useEffect, Component } from "react";
import Layout from "../../components/Layout";
import BackButton from "../../components/backButton";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Card,
  Grid,
  Button,
  Image,
  Icon,
  Segment,
  Header,
  List,
  Message,
  Divider,
  Modal,
  Popup,
} from "semantic-ui-react";

import { Link, Router } from "../../routes";
import LabourMarket from "../../ethereum/labourMarket";
import PhysicalMarket from "../../ethereum/physicalMarket";
import {
  useContract,
  useContractRead,
  useContractReads,
  useAccount,
} from "wagmi";
import MarketFactory from "../../ethereum/build/MarketFactory.json";
import { useRouter } from "next/router";

function DeployedMarkets() {
  const router = useRouter();
  const { name } = router.query;
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const errorHandling = {
    errorMessage: "",
    errorStatus: "hidden",
  };

  const [marketAddress, setMA] = useState("");
  const [copy, setCopy] = useState(false);
  const [msg, setMsg] = useState(errorHandling);
  const [markets, setMarkets] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: "0x479444C66a5fA9AC77E9FbD19620aE62a3a9bD52",
        abi: MarketFactory.abi,
        functionName: "getDeployedLabourMarkets",
      },
      {
        address: "0x479444C66a5fA9AC77E9FbD19620aE62a3a9bD52",
        abi: MarketFactory.abi,
        functionName: "getDeployedPhysicalMarkets",
      },
      {
        address: "0x479444C66a5fA9AC77E9FbD19620aE62a3a9bD52",
        abi: MarketFactory.abi,
        functionName: "getLabourMarket",
        args: [address],
      },
    ],
  });

  useEffect(() => {
    if (isDisconnected) {
      router.push("/");
    }
  }, [isConnected]);

  useEffect(() => {
    if (router.isReady && !isLoading) {
      if (name === "Labour") {
        setMarkets(data[0]);
      } else if (name === "Goods") {
        setMarkets(data[1]);
      }
    }
  }, [router.isReady, data]);

  const takeToMarket = async () => {
    setMsg((msg) => ({
      ...msg,

      errorMessage: "",
      errorStatus: "hidden",
    }));

    try {
      const myMarket = data[2];

      if (
        !myMarket ||
        myMarket == "0x0000000000000000000000000000000000000000"
      ) {
        setMsg((msg) => ({
          ...msg,
          errorMessage: "You have not created a Market yet.",
          errorStatus: "visible",
        }));
      } else {
        Router.pushRoute(`/markets/${name}/newMarket/${myMarket}`);
      }
    } catch (err) {
      setMsg((msg) => ({
        ...msg,
        errorMessage: err.message,
        errorStatus: "visible",
      }));
    }
    setTimeout(
      () => setMsg((msg) => ({ ...msg, errorStatus: "hidden" })),
      3000
    );
  };

  const viewMarket = (address) => {
    return (
      <div className="ui two buttons">
        <Button
          color="red"
          animated="fade"
          onClick={(event) =>
            Router.pushRoute(`/markets/${name}/newMarket/${address}`)
          }
        >
          <Button.Content visible>View Market</Button.Content>
          <Button.Content hidden>
            <Icon name="cart arrow down" />
          </Button.Content>
        </Button>

        <Button
          color="yellow"
          onClick={(event) =>
            //navigator.clipboard.writeText(address)
            Router.pushRoute(`/markets/${name}/boughtServices/${address}`)
          }
        >
          View Purchases
        </Button>
      </div>
    );
  };

  const copied = (event, { address }) => {
    navigator.clipboard.writeText(address);

    setCopy(true);
    setTimeout(() => setCopy(false), 1000);
  };

  // const renderMarkets = () => {
  const items = markets.map((address) => {
    return (
      <Card raised fluid style={{ overflowWrap: "break-word" }}>
        <Card.Content>
          <Card.Header>{address}</Card.Header>

          <Card.Meta>
            <Popup
              on="click"
              open={copy}
              content="Copied to clipboard"
              trigger={
                <Icon
                  address={address}
                  name="copy outline"
                  size="large"
                  link
                  onClick={copied}
                />
              }
            />
            Address of the Market
          </Card.Meta>
        </Card.Content>
        <Card.Content>{viewMarket(address)}</Card.Content>
      </Card>

      // header: address,
      // meta: copyAddress(address),
      // fluid: true,
      // // description: this.viewMarket(address),
      // style: { overflowWrap: "break-word" },
      // extra: viewMarket(address),
      // raised: true,
      // color: "yellow",
    );
  });

  //   return <Card.Group items={items} centered />;
  // };

  const bname = name + " Market";

  return (
    <Layout>
      <BackButton name={bname} />

      <Grid stackable>
        <Grid.Column width={11}>
          <Card.Group centered>{items}</Card.Group>
        </Grid.Column>

        <Grid.Column width={5}>
          <Card.Group centered>
            <Card raised>
              <Image src="/images/marketCreate.jpeg" />
              <Card.Content>
                <Card.Header>Want to Start your own Market?</Card.Header>
                <Card.Meta>Market Creation</Card.Meta>
                <Card.Description>
                  Do your exchange of services here with transactions made
                  decentralised with <strong>Ethereum</strong>.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Link route={`/markets/${name}/newMarket`}>
                  <Button color="yellow" animated="vertical" fluid>
                    <Button.Content visible>Create Market</Button.Content>
                    <Button.Content hidden>
                      <Icon name="money bill alternate outline" />
                    </Button.Content>
                  </Button>
                </Link>
              </Card.Content>
            </Card>

            <Card raised>
              <Message
                className={msg.errorStatus}
                style={{ overflowWrap: "break-word" }}
                error
                header="ERROR"
                content={msg.errorMessage}
              />
              <Image src="/images/viewMarket.png" />
              <Card.Content>
                <Card.Header>View your Market here</Card.Header>
                <Card.Meta>Your Markets</Card.Meta>
                <Card.Description>
                  Do your exchange of services here with transactions made
                  decentralised with <strong>Ethereum</strong>.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button
                  onClick={() => takeToMarket()}
                  loading={msg.loading}
                  color="red"
                  animated="vertical"
                  fluid
                >
                  <Button.Content visible>View My Market</Button.Content>
                  <Button.Content hidden>
                    <Icon name="shopping basket" />
                  </Button.Content>
                </Button>
              </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default DeployedMarkets;