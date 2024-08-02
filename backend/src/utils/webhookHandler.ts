import { Webhook } from "svix";
import bodyParser from "body-parser";
import { WEBHOOK_SECRET } from "../config/env";
import app from "..";
import { Request, Response } from "express";
import User from "../models/user.model"; // Import the User model

app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req: Request, res: Response) {
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    const headers = req.headers;
    const payload = req.body;

    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Error occurred -- no svix headers" });
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err: any) {
      console.log("Error verifying webhook:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }

    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0].email_address; // Adjust according to your event data structure
    const eventType = evt.type;

    if (eventType === "user.created") {
      try {
        const user = new User({ id, first_name, last_name, email, image_url });
        await user.save();
        console.log(`User with ID ${id} created and saved to the database.`);
      } catch (err: any) {
        console.log("Error saving user to database:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Error saving user to database" });
      }
    }

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", evt.data);

    return res.status(200).json({ success: true, message: "Webhook received" });
  }
);
