export type CompletePackage = {
  id: string;
  createdAt: string;
  userId: string;
  email: string;
  password: string;
  initialBalance: number;
  currentBalance: number;
};

export type ShellPackage = {
  email: string;
  password: string;
};

export type PackageInfoResponse = {
  userId: string;
  userLevel: string;
  phone: string;
  referring: string;
  referred: string;
  accountReferred: string;
  token: string;
  accountNumber: string;
  accountBalance: number;
  zipcode: string;
};

export type FreePackageRefreshTimeInHoursResponse = {
  time: number;
};
