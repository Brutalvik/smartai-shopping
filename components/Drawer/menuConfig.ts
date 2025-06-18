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
  PanelsTopLeft,
  ChartNoAxesCombined,
  Computer,
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
    title: "Home",
    items: [{ label: "Profile", icon: User, path: "/profile" }],
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

export const sellerTools = [
  {
    label: "My Products",
    icon: PanelsTopLeft,
    tabKey: "products",
  },
  {
    label: "Sales",
    icon: Computer,
    tabKey: "sales",
  },
  {
    label: "Add Product",
    icon: Upload,
    tabKey: "upload",
  },
  {
    label: "Analytics",
    icon: ChartNoAxesCombined,
    tabKey: "analytics",
  },
];
