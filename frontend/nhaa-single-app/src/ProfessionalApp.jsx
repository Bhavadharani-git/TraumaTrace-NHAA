import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./professional/router";
import "./professional/styles.css";

const router = getRouter();

export default function ProfessionalApp() {
  if (window.location.pathname !== "/") {
    window.history.replaceState({}, "", "/");
  }

  return <RouterProvider router={router} />;
}