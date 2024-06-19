import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import GraphComponent from "./components/Graph.jsx";
import ErrorPage from "./error-page";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import LandingPageComponent from "./components/LandingPageComponent.jsx";
import Test from "./custom-tree/Test.jsx";
import { ElkPage } from "./elkjs/ElkPage.jsx";
import { ReactFlowProvider } from "reactflow";
import { GlobalProvider } from "./context/GlobalContext";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageComponent />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/search",
    element: <App />,
  },
  {
    path: "graph/:walletId",
    element: <GraphComponent />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/elkjs",
    element: <ElkPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GlobalProvider>
    <NextUIProvider>
      <ReactFlowProvider>
        <RouterProvider router={router} />
      </ReactFlowProvider>
    </NextUIProvider>
  </GlobalProvider>
);
