import { useEffect } from "react";
import PortalPage from "./components/PortalPage";
import { initPortal } from "./portalController";

export default function App() {
  useEffect(() => {
    initPortal();

    return () => {
      // Portal controller uses global browser listeners.
      // No additional cleanup is required here.
    };
  }, []);

  return <PortalPage />;
}
