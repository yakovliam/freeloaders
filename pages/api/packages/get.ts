import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { CompletePackage, ShellPackage } from "../../../types/package";

export default withApiAuth(async function Info(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  supabase
) {
  const userId = await (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return res.status(500).send("something went wrong!");
  }

  //   Run queries with RLS on the server
  const { data } = await supabase.from("packages").select("*");

  const formatted: CompletePackage[] = [];

  // reformat data
  data?.forEach((row) => {
    // find the current balance for this account
    const currentBalance = 0;

    formatted.push({
      id: row.id,
      createdAt: row.created_at,
      userId: row.user_id,
      initialBalance: row.initial_balance,
      currentBalance: currentBalance,
      email: row.email,
      password: row.password,
    });
  });

  res.json(formatted);
});
