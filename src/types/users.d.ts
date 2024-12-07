export interface Users {
  id: number;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  role: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  accounts: Account[];
  salesAsCustomer: Sale[];
  salesAsUser: Sale[];
  sessions: Session[];
  activity: UserActivity | null;
  profile: UserProfile | null;
}

export interface UserActivity {
  id: number;
  userId: number;
  registerIp: string | null;
  lastIp: string | null;
  agent: string | null;
  onlineTime: Date;
  user: User;
}

export interface UserProfile {
  id: number;
  userId: number;
  countryId: number;
  stateId: number;
  city: string | null;
  cp: string | null;
  document: string | null;
  documentNumber: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  country: Country;
  state: State;
  user: User;
}
