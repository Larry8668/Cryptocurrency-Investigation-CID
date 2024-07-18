import ReactDOM from "react-dom/client";
import ErrorPage from "./error-page";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import LandingPageComponent from "./components/LandingPageComponent.jsx";
import { ElkPage } from "./elkjs/ElkPage.jsx";
import { ReactFlowProvider } from "reactflow";
import { GlobalProvider } from "./context/GlobalContext";
import GetSSEData from "./utils/GetSSEData.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageComponent />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/elkjs",
    element: <ElkPage />,
  },
  {
    path: "elkjs/:centralNodeAddress",
    element: <ElkPage />,
  },
  {
    path: "sse",
    element: <GetSSEData />,
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
