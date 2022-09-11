import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { CompletePackage, PackageInfoResponse } from "../../../types/package";

export default withApiAuth(async function Info(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  supabase
) {
  const userId = await (await supabase.auth.getUser()).data.user?.id;
  const packageId = req.query.id;

  if (!userId) {
    return res.status(500).json({ message: "something went wrong!" });
  }

  if (!packageId) {
    return res.status(400).json({ message: "missing fields!" });
  }

  //   Run queries with RLS on the server
  const { data } = await supabase
    .from("package_data")
    .select("*")
    .eq("id", packageId);

  if (!data || data?.length <= 0) {
    return res.json({});
  }

  // reformat data
  const row = data[0];

  // find the current balance for this account
  const formatted: CompletePackage = {
    id: row.id,
    createdAt: row.created_at,
    userId: row.user_id,
    initialBalance: row.initial_balance,
    currentBalance: -1, // initialize with fake balance for data fetching
    email: row.email,
    password: row.password,
  };

  // get package info
  const infoResponse: PackageInfoResponse = (
    await supabase.functions.invoke("get-package-info", {
      body: { packageId: row.id },
    })
  ).data;

  console.log(infoResponse);

  if (!infoResponse) {
    return res.status(500).json({ message: "something went wrong!" });
  }

  formatted.currentBalance = infoResponse?.accountBalance;

  // use a different internal nextjs api to get the account's current balance
  //  then, return an object with that parameter added on
  res.json(formatted);
});
