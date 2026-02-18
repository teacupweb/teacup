// Based on the provided Prisma schema

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  sessions?: Session[];
  accounts?: Account[];
  companies?: CompanyData[];
  companyId?: String;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
  user?: User;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  user?: User;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface CompanyData {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  domain: string;
  key: string;
  activity_data?: any[] | null; // Json type
  info?: any[] | null; // Json type
  sharing?: any[] | null; // Json type
  owner?: User;
  inboxes?: Inbox[];
  blogs?: Blog[];
  analytics?: Analytics[];
}

export interface Inbox {
  id: number;
  name: string;
  ownerId: string;
  owner?: CompanyData;
  data?: InboxData[];
}

export interface InboxData {
  id: number;
  inbox_id: number;
  createdAt: Date;
  data: string;
  inbox?: Inbox;
}

export interface Blog {
  id: string;
  createdAt: Date;
  title: string;
  image: string;
  data: string;
  ownerId: string;
  owner?: CompanyData;
}

export interface Analytics {
  fingerprint: string;
  ownerId: string;
  owner?: CompanyData;
  time: Date;
  buttons?: AnalyticsButton[];
  pages?: AnalyticsPage[];
  forms?: AnalyticsForm[];
}

export interface AnalyticsButton {
  id: string;
  time: Date;
  fingerprint: string;
  page: string;
  button: string;
  analytics?: Analytics;
}

export interface AnalyticsPage {
  id: string;
  time: Date;
  fingerprint: string;
  page: string;
  percentage: number;
  analytics?: Analytics;
}

export interface AnalyticsForm {
  id: string;
  time: Date;
  fingerprint: string;
  form: string;
  percentage: number;
  analytics?: Analytics;
}

// Legacy types for backward compatibility
export type ActivityDataType = {
  day: string;
  visits: number;
};

export type InfoItemType = {
  icon: string;
  title: string;
  data: string[] | number;
  description: string;
};

export type SharingMemberType = {
  name: string;
  email: string;
  status: string;
};

export type CompanyType = {
  id?: string;
  name: string;
  owner: string;
  domain: string;
  activity_data?: ActivityDataType[];
  info?: InfoItemType[];
  sharing?: SharingMemberType[];
  key: string;
};

export type blogType = {
  id?: number;
  title: string;
  image: string;
  data: string;
  owner: string;
};

export type inboxType = {
  id?: number;
  owner: string;
  name: string;
};
