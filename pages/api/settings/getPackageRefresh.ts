import { withApiAuth } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { FreePackageRefreshTimeInHoursResponse } from "../../../types/package";

export default withApiAuth(async function getPackageRefresh(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  supabase
) {
  // get package info
  const response = await supabase.functions.invoke(
    "get-free-package-refresh-time"
  );

  if (!response) {
    return res.status(500).json({ message: "something went wrong!" });
  }

  const freePackageRefreshTimeResponse: FreePackageRefreshTimeInHoursResponse =
    { time: response.data.time };

  res.json(freePackageRefreshTimeResponse);
});
