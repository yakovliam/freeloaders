import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { UserLastRefreshResponse } from "../../../types/user";

export default withApiAuth(async function getLastRefreshTime(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  supabase
) {
  const userId = await (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return res.status(500).json({ message: "something went wrong!" });
  }

  const { data } = await supabase
    .from("user_data")
    .select("last_free_package")
    .eq("id", userId);

  if (!data || data?.length <= 0) {
    return res.json({});
  }

  // reformat data
  const row = data[0];
  const lastRefreshTimestamp = new Date(row.last_free_package);

  const userLastRefreshResponse: UserLastRefreshResponse = {
    lastRefreshTimestamp: lastRefreshTimestamp,
  };

  res.json(userLastRefreshResponse);
});
