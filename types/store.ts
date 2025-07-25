export interface UserState {
  id: string;
  sub: string;
  email: string;
  name: string;
  phone: string;
  group: string;
  given_name: string;
  family_name: string;
  business_name?: string;
  preferredLocale?: string;
  accessTokenExpiresAt?: number | undefined;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  preferredPayment?: string;
  newsletterSubscribed?: boolean;
  profilePic?: string;
}
