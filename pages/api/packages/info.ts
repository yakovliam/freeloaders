import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { CompletePackage } from "../../../types/package";

// DEPRECATED? not sure yet
export default withApiAuth(async function Info(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  supabase
) {
  const userId = await (await supabase.auth.getUser()).data.user?.id;
  const packageId = req.query.id;

  if (!userId) {
    return res.status(500).send("something went wrong!");
  }

  if (!packageId) {
    return res.status(400).send("missing fields");
  }

  //   Run queries with RLS on the server
  const { data } = await supabase
    .from("packages")
    .select("*")
    .eq("id", packageId);

  if (!data || data?.length <= 0) {
    return res.json({});
  }

  // reformat data
  const row = data[0];

  // find the current balance for this account
  const currentBalance = 0;

  const formatted: CompletePackage = {
    id: row.id,
    createdAt: row.created_at,
    userId: row.user_id,
    initialBalance: row.initial_balance,
    currentBalance: currentBalance, // find current balance
    email: row.email,
    password: row.password,
  };

  // use a different internal nextjs api to get the account's current balance
  //  then, return an object with that parameter added on
  res.json(formatted);
});
