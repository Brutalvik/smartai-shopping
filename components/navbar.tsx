"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";
import UserDrawerMenu from "@/components/Drawer/UserDrawerMenu";
import { Badge } from "@heroui/badge";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import { useAppSelector } from "@/store/hooks/hooks";
import {
  selectUser,
  selectUserEmail,
  selectIsLoggedIn,
} from "@/store/selectors";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <HeroUINavbar maxWidth="full" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit text-2xl">YVO</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full pr-[10px]"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex bg-default-100 rounded">
          <SearchInput />
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            startContent={<SearchIcon />}
            variant="flat"
          />
        </NavbarItem>
        <NavbarItem>
          <div className="hidden lg:flex flex-row items-center gap-2">
            <ThemeSwitch />

            <Badge
              color="primary"
              content={totalItems}
              isInvisible={!totalItems}
              size="md"
            >
              <ShoppingCart
                onClick={() => router.push("/cart")}
                className="hover:cursor-pointer"
              />
            </Badge>

            {user?.id ? (
              <UserDrawerMenu />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-row gap-2"
                >
                  {pathname !== "/auth/signin" && (
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="min-h-[36px]"
                      onPress={() => router.push("/auth/signin")}
                    >
                      Sign In
                    </Button>
                  )}
                  {pathname !== "/auth/register" && (
                    <Button
                      size="sm"
                      variant="solid"
                      color="primary"
                      className="min-h-[36px]"
                      onPress={() => router.push("/auth/register")}
                    >
                      Sign Up
                    </Button>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="lg:hidden basis-1 pr-[10px] flex items-center gap-2"
        justify="end"
      >
        <ThemeSwitch />

        <Badge
          color="primary"
          content={totalItems}
          size="md"
          isInvisible={!totalItems}
        >
          <ShoppingCart
            onClick={() => router.push("/cart")}
            className="hover:cursor-pointer"
          />
        </Badge>

        {user?.id ? (
          <UserDrawerMenu />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname + "-mobile"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-row gap-2"
            >
              {pathname !== "/auth/signin" && (
                <Button
                  size="sm"
                  variant="light"
                  className="min-h-[36px]"
                  onPress={() => router.push("/auth/signin")}
                >
                  Sign In
                </Button>
              )}
              {pathname !== "/auth/register" && (
                <Button
                  size="sm"
                  variant="solid"
                  color="primary"
                  className="min-h-[36px]"
                  onPress={() => router.push("/auth/register")}
                >
                  Sign Up
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </NavbarContent>

      <NavbarMenu>
        <SearchInput />
        <Button
          isExternal
          name="search"
          as={Link}
          className=" text-sm font-normal text-default-600 bg-default-100"
          startContent={<SearchIcon />}
          variant="flat"
        >
          Search
        </Button>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
