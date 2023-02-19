import { Player, useAssetMetrics, useCreateAsset } from "@livepeer/react";
import { Livepeer } from "./player";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Progress, Card, Input, Icon } from "semantic-ui-react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import MarketFactory from "../ethereum/build/MarketFactory.json";
import { ModalUpload } from "./modalUpload";

export function AddVideo({ assetId }) {
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const { config } = usePrepareContractWrite({
    address: "0xfcAEeC326A8fB329ce5E80Ce0DC3150EdeA9a290",
    abi: MarketFactory.abi,
    functionName: "uploadLabourVideo",
    args: [assetId],
    overrides: {
      from: address,
    },
  });

  const contractWrite = useContractWrite(config);

  const waitFor = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    contractWrite.write();
  };

  return (
    <>
      <ModalUpload
        message="Video Successfully added"
        color="yellow"
        openModal={waitFor.isSuccess}
        playbackId={assetId}
      />
      <Button
        style={{ marginTop: 10 }}
        fluid
        loading={waitFor.isLoading || contractWrite.isLoading}
        color="red"
        disabled={false}
        onClick={onSubmit}
      >
        <Icon name="video" />
        Add Video
      </Button>
    </>
  );
}
