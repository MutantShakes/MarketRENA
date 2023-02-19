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
import { AddVideo } from "./addVideo";

export function Asset() {
  const [video, setVideo] = useState(null);
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const {
    mutate: createAsset,
    data: asset,
    status,
    progress,
    error,
    isError,
  } = useCreateAsset(
    video
      ? {
          sources: [{ name: video.name, file: video }],
        }
      : null
  );
  const { data: metrics } = useAssetMetrics({
    assetId: asset?.[0].id,
    refetchInterval: 30000,
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
      setVideo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": ["*.mp4"],
    },
    maxFiles: 1,
    onDrop,
  });

  const isLoading = useMemo(
    () =>
      status === "loading" ||
      (asset?.[0] && asset[0].status?.phase !== "ready"),
    [status, asset]
  );

  const progressFormatted = useMemo(
    () =>
      progress?.[0].phase === "failed"
        ? "Failed to process video."
        : progress?.[0].phase === "waiting"
        ? "Waiting..."
        : progress?.[0].phase === "uploading"
        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
        : progress?.[0].phase === "processing"
        ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
        : null,
    [progress]
  );
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

  const waitFor = useWaitForTransaction({
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
    <div>
      {!asset && (
        <Card fluid {...getRootProps()}>
          <input {...getInputProps()} />
          <Card.Content>
            <Icon name="file" />
            Drag and drop or browse files
          </Card.Content>

          {error?.message && <p>{error.message}</p>}
        </Card>
      )}

      <div>
        <Card fluid>
          <Card.Content>
            <Card.Header>
              <Progress
                percent={Math.round(progress?.[0].progress * 100)}
                indicating
                error={progress?.[0].phase === "failed"}
                size="small"
              />
            </Card.Header>

            <Card.Meta>
              {video ? (
                <Card.Meta>{video.name}</Card.Meta>
              ) : (
                <Card.Meta>Select a video file to upload.</Card.Meta>
              )}
            </Card.Meta>

            {asset?.[0]?.playbackId && progress?.[0].phase === "success" && (
              <AddVideo assetId={asset[0].playbackId} />
            )}
            {!asset?.[0].id && (
              <Button
                onClick={() => {
                  createAsset?.();
                }}
                disabled={isLoading || !createAsset}
                floated="right"
              >
                {progressFormatted ? <p>{progressFormatted}</p> : <p>Upload</p>}
              </Button>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
