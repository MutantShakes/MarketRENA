import { Player, useAssetMetrics, useCreateAsset } from "@livepeer/react";
import { Livepeer } from "./player";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Progress,
  Card,
  Input,
  Icon,
  Modal,
  Popup,
} from "semantic-ui-react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import MarketFactory from "../ethereum/build/MarketFactory.json";
import { Router } from "../routes";
import { useRouter } from "next/router";

export function ModalMessage({ message, color, openModal }) {
  const [open, setOpenModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setOpenModal(openModal);
  }, [openModal]);
  return (
    <Modal
      size="mini"
      basic
      open={open}
      onClose={() => router.reload(window.location.pathname)}
      onOpen={() => setOpenModal(true)}
    >
      <Modal.Header as="h1" icon>
        <Icon color={color} size="huge" name="globe" />
        {message}
      </Modal.Header>

      <Modal.Actions>
        <Button fluid color={color} inverted onClick={() => Router.back()}>
          <Icon name="left arrow" /> Back
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
