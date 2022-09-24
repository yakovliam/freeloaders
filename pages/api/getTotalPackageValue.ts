import { NextApiRequest, NextApiResponse } from "next";
import { PackageValueResponse } from "../../types/packageValueResponse";
import { supabase } from "../../utils/supabase";

async function getTotalPackageValue(
  req: NextApiRequest,
  res: NextApiResponse<PackageValueResponse | any>
) {
  // get package info
  const response = await supabase.functions.invoke("get-total-package-value");

  if (!response) {
    return res.status(500).json({ message: "something went wrong!" });
  }

  res.json(response.data as PackageValueResponse);
}

export default getTotalPackageValue;
