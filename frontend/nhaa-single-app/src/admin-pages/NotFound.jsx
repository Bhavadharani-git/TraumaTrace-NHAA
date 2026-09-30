import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-surface text-center px-4">
      <p className="text-display-lg text-primary">404</p>
      <p className="text-body-lg text-on-surface-variant">This page could not be found.</p>
      <Link to="/dashboard" className="text-secondary hover:underline text-body-md-medium">
        Return to Dashboard
      </Link>
    </div>
  );
}

