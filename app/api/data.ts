// pages/api/data.ts

import type { NextApiRequest, NextApiResponse } from "next";

// Function to handle incoming GET requests
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // You can send any data as a response
    const data = {
      message: "Hello from the server!",
      success: true,
      timestamp: new Date().toISOString(),
    };

    // Sending response back to the client
    res.status(200).json(data);
  } else {
    // If method is not GET, return a 405 error (Method Not Allowed)
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
