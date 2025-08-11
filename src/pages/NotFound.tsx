import { useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  console.error("404 Error: User attempted to access non-existent route:", location.pathname);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>No match for <code>{location.pathname}</code></p>
    </div>
  );
}

