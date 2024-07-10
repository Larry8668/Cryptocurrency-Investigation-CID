import { getRectOfNodes, getTransformForBounds } from "reactflow";

import { toPng } from "html-to-image";

function downloadImage(dataUrl) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = window.innerWidth;
const imageHeight = window.innerHeight;

const onClickPNG = (getNodes) => {
  const nodesBounds = getRectOfNodes(getNodes());
  const transform = getTransformForBounds(
    nodesBounds,
    imageWidth,
    imageHeight,
    0.5,
    2
  );

  toPng(document.querySelector(".react-flow__viewport"), {
    backgroundColor: "#fff",
    width: imageWidth,
    height: imageHeight,
    style: {
      width: imageWidth,
      height: imageHeight,
      transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
    },
  }).then(downloadImage);
};

function downloadAsJson(getNodes, getEdges, getViewport, centralNode) {
  const data = {
    nodes: getNodes(),
    edges: getEdges(),
    viewport: getViewport(),
  };
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `${centralNode}.json`);
  a.click();
}

export { onClickPNG, downloadAsJson };
