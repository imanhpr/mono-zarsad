export type IUser = {
  id: number;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
  profile: IUserProfile;
  createdAt: string;
};

export type IUserProfile = {
  id: number;
  debtPrem: boolean;
  user: number;
};
