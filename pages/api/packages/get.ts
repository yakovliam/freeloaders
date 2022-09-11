import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { CompletePackage, PackageInfoResponse } from "../../../types/package";

export default withApiAuth(async function Get(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  supabase
) {
  const userId = await (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return res.status(500).json({ message: "something went wrong!" });
  }

  //   Run queries with RLS on the server
  const { data } = await supabase.from("package_data").select("*");

  if (!data) {
    return res.status(500).json({ message: "something went wrong!" });
  }

  const formatted: CompletePackage[] = [];

  for (let index = 0; index < data.length; index++) {
    const row = data[index];

    const obj = {
      id: row.id,
      createdAt: row.created_at,
      userId: row.user_id,
      initialBalance: row.initial_balance,
      currentBalance: -1,
      email: row.email,
      password: row.password,
    };

    // get package info
    const infoResponse: PackageInfoResponse = (
      await supabase.functions.invoke("get-package-info", {
        body: JSON.stringify({ packageId: row.id }),
      })
    ).data;

    if (infoResponse) {
      obj.currentBalance = infoResponse.accountBalance;
    }

    formatted.push(obj);
  }

  res.json(formatted);
});
