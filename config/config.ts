export const CDN = {
  userAuthApi: process.env.NEXT_PUBLIC_AUTH_URL,
  socialAuthApi: process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_DOMAIN,
  cognitoClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  cognitoClientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET,
  awsRegion: process.env.NEXT_PUBLIC_COGNITO_REGION,
  sellerProductsApi: process.env.NEXT_PUBLIC_SELLER_PRODUCTS_URL,
  cognitoSocialAuthApi: process.env.NEXT_PUBLIC_COGNITO_AUTH_URL,
  socialCallbackUrl: process.env.NEXT_PUBLIC_FRONTEND_SOCIAL_CALLBACK_URL,
  jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET,
  buyer: "buyer",
  seller: "seller",
};
