import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabase";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-08-01",
  });
  const signingSecret = process.env.STRIPE_ENDPOINT_SECRET_KEY!;
  // Get the signature sent by Stripe
  const signature = req.headers["stripe-signature"]!;
  const buf = await buffer(req);
  let receivedEvent;
  try {
    receivedEvent = stripe.webhooks.constructEvent(
      buf,
      signature,
      signingSecret
    );
  } catch (err) {
    return res.status(400).send(`something went wrong: ${err}`);
  }
  console.log(`🔔 Event received: ${receivedEvent.id}`);

  switch (receivedEvent.type) {
    case "checkout.session.completed":
      const session: any = receivedEvent.data.object;

      // get customer email
      const email = session.customer_details.email;
      console.log(`💸 Payment made by a customer with the email ${email}`);

      // get user's id by their email
      const response = await supabase
        .from("user_data")
        .select("id")
        .eq("email", email);

      if (!response.data || response.data.length <= 0) {
        console.error(
          `No data returned from supabase ${JSON.stringify(response)}`
        );
        return res.status(500).json({
          message: `No data returned from supabase ${JSON.stringify(response)}`,
        });
      }

      const id = response.data[0].id!;

      // create new package
      supabase.functions.invoke("create-new-package", {
        body: JSON.stringify({ userId: id }),
      });

      break;
    // ... handle other retrievedEvent types
    default:
      console.log(`Unhandled retrievedEvent type ${receivedEvent.type}`);
  }

  res.json({ id: receivedEvent.id });
};

export default handler;
