
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { seedDatabase } from "@/utils/seed-database";

const Index = () => {
  useEffect(() => {
    // Seed the database with initial data
    seedDatabase().catch(console.error);
  }, []);

  // Redirect to home page
  return <Navigate to="/" replace />;
};

export default Index;
