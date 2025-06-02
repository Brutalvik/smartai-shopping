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
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDrawerMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  // 🔐 Mock auth state — replace this with your real context/store
  const user = {
    firstName: "Vikram",
    email: "vikram@example.com",
    isLoggedIn: true,
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    onOpenChange(); // close drawer
  };

  const greetingLine = user.isLoggedIn
    ? `Hi, ${user.firstName}`
    : `Hi there 👋`;

  const subline = user.isLoggedIn
    ? "Ready to explore something exciting?"
    : "Welcome! Sign in to get started";

  return (
    <>
      <Avatar
        showFallback
        size="sm"
        src="https://images.unsplash.com/broken"
        className="cursor-pointer hover:opacity-80 transition"
        onClick={onOpen}
      />

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
                  <Avatar
                    src="https://images.unsplash.com/broken"
                    size="md"
                    showFallback
                    className="border border-default-200"
                  />
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
                    {user.isLoggedIn ? (
                      <DrawerItem
                        icon={<LogOut size={18} />}
                        label="Sign Out"
                        onClick={() => handleNavigate("/logout")}
                      />
                    ) : (
                      <DrawerItem
                        icon={<LogIn size={18} />}
                        label="Sign In"
                        onClick={() => handleNavigate("/signin")}
                      />
                    )}
                  </div>
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
