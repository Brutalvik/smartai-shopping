"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  addToast,
} from "@heroui/react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { CDN } from "@/config/config";
import { getFirstNameCapitalized, getInitial } from "@/utils/helper";
import { useState, useMemo } from "react";
import DrawerItem from "./DrawerItem";
import { avatarColors, getColorByName } from "@/components/Drawer/utils";
import {
  buyerMenu,
  sellerMenu,
  authMenu,
} from "@/components/Drawer/menuConfig";
import { Plus } from "lucide-react";

const UserDrawerMenu = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const isSeller = useMemo(
    () => user && user?.group?.toLowerCase() === "sellers",
    [user]
  );
  const currentMenu = isSeller ? sellerMenu : buyerMenu;

  const handleNavigate = (path: string) => {
    onOpenChange();
    setLoading(true);
    setTimeout(() => {
      router.push(path);
      setLoading(false);
    }, 200);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${CDN.userAuthApi}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        addToast({
          description: "Failed to Signout!",
          color: "danger",
          timeout: 1500,
        });
        return;
      }

      sessionStorage.clear();
      localStorage.removeItem("user");
      setUser(null);

      addToast({
        description: "You Signed Out",
        color: "default",
        timeout: 1500,
      });

      router.push("/");
      onClose();
    } catch {
      addToast({
        description: "Something went wrong!",
        color: "danger",
        timeout: 1500,
      });
    }
  };

  const avatarInitial = getInitial(user?.name);
  const { bg, fg } = getColorByName(user?.name || "Guest", avatarColors);
  const greetingLine = user
    ? `Hi ${getFirstNameCapitalized(user?.name as string)}!`
    : `Hi there 👋`;
  const subline = user
    ? "Ready to explore something exciting?"
    : "Welcome! Sign in to get started";

  const UserAvatar = () => (
    <Avatar
      showFallback
      size="sm"
      src={user?.name ? "" : "/user.png"}
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
                  {currentMenu.map((section, idx) => {
                    if (
                      !user &&
                      section.title.toLowerCase().includes("account")
                    )
                      return null;
                    if (
                      !user &&
                      section.title.toLowerCase().includes("my products")
                    )
                      return null;

                    return (
                      <div key={idx} className="space-y-2">
                        <p className="text-xs text-default-400 px-3 uppercase tracking-wide">
                          {section.title}
                        </p>
                        {section.items.map((item) => {
                          if (!user && item.label === "My Orders") return null;
                          const Icon = item.icon;
                          return (
                            <DrawerItem
                              key={item.label}
                              icon={<Icon size={18} />}
                              label={item.label}
                              onClick={() =>
                                (item as any).isSignOut
                                  ? handleSignout()
                                  : handleNavigate(item.path)
                              }
                            />
                          );
                        })}

                        {idx < currentMenu.length - 1 && (
                          <hr className="border-default-200" />
                        )}
                      </div>
                    );
                  })}

                  <hr className="border-default-200" />

                  <div className="space-y-2">
                    {(user?.name ? authMenu.signedIn : authMenu.signedOut).map(
                      (item) => {
                        const Icon = item.icon;
                        return (
                          <DrawerItem
                            key={item.label}
                            icon={<Icon size={18} />}
                            label={item.label}
                            onClick={() =>
                              (item as any).isSignOut
                                ? handleSignout()
                                : handleNavigate(item.path)
                            }
                          />
                        );
                      }
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
};

export default UserDrawerMenu;
