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
  id: string;
  createdAt: string;
  userId: string;
  initialBalance: number;
};
