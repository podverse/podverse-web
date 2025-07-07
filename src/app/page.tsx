import React from "react";
import TestComponent from "../components/TestComponent/TestComponent";

// Sample server-side function
async function getServerMessage() {
  // This code runs on the server
  return "Hello from the server!";
}

export default async function Home() {
  const serverMessage = await getServerMessage();

  return (
    <div>
      <h1>Welcome to Podverse Web</h1>
      <p>{serverMessage}</p>
      <TestComponent />
    </div>
  );
}