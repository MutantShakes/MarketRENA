import { useCreateAsset } from "@livepeer/react";
import { useState, useEffect } from "react";
import { Livepeer } from "./player";
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
  Progress,
} from "semantic-ui-react";
import { Router, Link } from "../routes";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useRouter } from "next/router";
import MarketFactory from "../ethereum/build/MarketFactory.json";

export default function Load() {
  const [video, setVideo] = useState(null);
  const [er, setError] = useState("");

  const {
    mutate: createAsset,
    data: asset,
    status,
    progress,
    error,
  } = useCreateAsset(
    video
      ? {
          sources: [{ name: "Short Video", file: video }],
        }
      : null
  );

  const handleChange = async () => {
    try {
      createAsset();
    } catch (err) {
      setError(err.message);
    }
  };

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

  useEffect(() => {
    if (status === "success") {
      setAssetId(asset[0].playbackId);
    }
  }, [asset]);

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

  return (
    <>
      <Input
        type={"file"}
        accept={"video/*"}
        onChange={(e) => {
          const file = e.target.files[0];
          setVideo(file);
        }}
      />
      <Button
        color="red"
        style={{ marginTop: 12 }}
        fluid
        disabled={false}
        onClick={handleChange}
      >
        <Icon name="upload" />
        Upload Video
      </Button>
      <Progress percent={Math.round(progress?.[0].progress * 100)} progress>
        Uploading Files
      </Progress>

      <h3>
        Status: {status},Error: {error},Progress: {progress?.[0].phase}
      </h3>

      {asset?.[0]?.playbackId && progress?.[0].phase !== "failed" && (
        <Button
          color="red"
          style={{ marginTop: 12 }}
          fluid
          disabled={false}
          onClick={onSubmit}
        >
          Add Video
        </Button>
      )}
    </>
  );
}
