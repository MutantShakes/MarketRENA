import { Player } from "@livepeer/react";
import Image from "next/image";
import * as React from "react";

import homePage from "../public/images/home_page_icon2.jpeg";

const PosterImage = () => {
  return (
    <Image
      alt="Image...."
      src={homePage}
      layout="fill"
      objectFit="cover"
      priority
      placeholder="blur"
    />
  );
};

const playbackId = "6d7el73r1y12chxr";

export function Livepeer({ playId }) {
  return (
    <Player
      title="Market Demo"
      playbackId={playId}
      autoPlay={false}
      showTitle={true}
      showPipButton
      poster={<PosterImage />}
      theme={{
        borderStyles: { containerBorderStyle: "hidden" },
        radii: { containerBorderRadius: "10px" },
      }}
    />
  );
}
