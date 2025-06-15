import {
  ShoppingCart,
  Heart,
  User,
  Package,
  Store,
  Star,
  LogIn,
  LogOut,
  User2Icon,
  Upload,
  Plus,
} from "lucide-react";

export const buyerMenu = [
  {
    title: "Account",
    items: [
      { label: "My Orders", icon: Package, path: "/" },
      { label: "Wishlist", icon: Heart, path: "/wishlist" },
      { label: "Cart", icon: ShoppingCart, path: "/cart" },
      { label: "Profile", icon: User, path: "/profile" },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Become a Seller", icon: Store, path: "/auth/register-seller" },
      { label: "Join Membership", icon: Star, path: "/membership" },
    ],
  },
];

export const sellerMenu = [
  {
    title: "Seller Tools",
    items: [
      { label: "My Products", icon: Upload, path: "/seller/dasboard" },
      { label: "Profile", icon: User, path: "/profile" },
    ],
  },
  {
    title: "Explore",
    items: [{ label: "Join Membership", icon: Star, path: "/membership" }],
  },
];

export const authMenu = {
  signedOut: [
    { label: "Sign In", icon: LogIn, path: "/auth/signin" },
    { label: "Register", icon: User2Icon, path: "/auth/register" },
  ],
  signedIn: [
    { label: "Sign Out", icon: LogOut, path: "/signout", isSignOut: true },
  ],
};
