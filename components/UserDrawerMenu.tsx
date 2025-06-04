"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import {
  LogIn,
  ShoppingCart,
  Heart,
  User,
  Package,
  Star,
  LogOut,
  Store,
  User2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast";
import { CDN } from "@/config/config";
import { getFirstNameCapitalized } from "@/utils/helper";

// 🎨 Color utility
const avatarColors = [
  { bg: "#FF6B6B", fg: "#FFFFFF" },
  { bg: "#6BCB77", fg: "#FFFFFF" },
  { bg: "#4D96FF", fg: "#FFFFFF" },
  { bg: "#FFD93D", fg: "#000000" },
  { bg: "#FF9F1C", fg: "#000000" },
  { bg: "#845EC2", fg: "#FFFFFF" },
  { bg: "#2C3E50", fg: "#FFFFFF" },
  { bg: "#00C9A7", fg: "#000000" },
  { bg: "#E63946", fg: "#FFFFFF" },
  { bg: "#1D3557", fg: "#FFFFFF" },
];

function getColorByName(name: string) {
  const code = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[code % avatarColors.length];
}

export default function UserDrawerMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const { user } = useUser();

  const handleNavigate = (path: string) => {
    router.push(path);
    onOpenChange();
  };

  const handleLogout = async () => {
    try {
      await fetch(`${CDN.userAuthApi}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      sessionStorage.clear();
      localStorage.removeItem("user"); // optional if used
      toast.success("You've been signed out.");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Something went wrong during logout.");
    }
  };

  const avatarInitial = user?.name?.charAt(0).toUpperCase() || "";
  const { bg, fg } = getColorByName(user?.name || "Guest");

  const greetingLine = user
    ? `Hi ${getFirstNameCapitalized(user?.name as string)} !`
    : `Hi there 👋`;
  const subline = user?.name
    ? "Ready to explore something exciting?"
    : "Welcome! Sign in to get started";

  const UserAvatar = () => (
    <Avatar
      showFallback
      size="sm"
      src="https://images.unsplash.com/broken"
      name={avatarInitial}
      onClick={onOpen}
      className="cursor-pointer hover:opacity-80 transition"
      classNames={{
        name: "text-lg font-bold",
        fallback: "rounded-full",
      }}
      style={{
        backgroundColor: bg,
        color: fg,
      }}
    />
  );

  return (
    <>
      <UserAvatar />

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        motionProps={{
          variants: {
            enter: { opacity: 1, x: 0 },
            exit: { x: 100, opacity: 0 },
          },
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-3">
                  <UserAvatar />
                  <div>
                    <p className="text-base font-semibold">{greetingLine}</p>
                    <p className="text-xs text-default-500">{subline}</p>
                  </div>
                </div>
              </DrawerHeader>

              <DrawerBody>
                <div className="space-y-4 text-sm text-default-700">
                  <div className="space-y-2">
                    <DrawerItem
                      icon={<Package size={18} />}
                      label="My Orders"
                      onClick={() => handleNavigate("/orders")}
                    />
                    <DrawerItem
                      icon={<Heart size={18} />}
                      label="Wishlist"
                      onClick={() => handleNavigate("/wishlist")}
                    />
                    <DrawerItem
                      icon={<ShoppingCart size={18} />}
                      label="Cart"
                      onClick={() => handleNavigate("/cart")}
                    />
                    <DrawerItem
                      icon={<User size={18} />}
                      label="Profile"
                      onClick={() => handleNavigate("/profile")}
                    />
                  </div>

                  <hr className="border-default-200" />

                  <div className="space-y-2">
                    <DrawerItem
                      icon={<Store size={18} />}
                      label="Become a Seller"
                      onClick={() => handleNavigate("/seller")}
                    />
                    <DrawerItem
                      icon={<Star size={18} />}
                      label="Join Membership"
                      onClick={() => handleNavigate("/membership")}
                    />
                  </div>

                  <hr className="border-default-200" />

                  <div className="space-y-2">
                    {user?.name ? (
                      <DrawerItem
                        icon={<LogOut size={18} />}
                        label="Sign Out"
                        onClick={handleLogout}
                      />
                    ) : (
                      <DrawerItem
                        icon={<LogIn size={18} />}
                        label="Sign In"
                        onClick={() => router.push("/auth/signin")}
                      />
                    )}
                  </div>

                  <hr className="border-default-200" />

                  <DrawerItem
                    icon={<User2Icon size={18} />}
                    label="Register"
                    onClick={() => {
                      router.push("/auth/register");
                      onClose();
                    }}
                  />
                </div>
              </DrawerBody>

              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

const DrawerItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-default-100 transition"
    >
      <span className="text-default-600">{icon}</span>
      <span className="text-default-800 font-medium">{label}</span>
    </button>
  );
};
