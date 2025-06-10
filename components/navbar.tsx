"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";
import UserDrawerMenu from "@/components/UserDrawerMenu";
import { Badge } from "@heroui/badge";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import SearchInput from "@/components/SearchInput";

export const Navbar = () => {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <HeroUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Adjusted NavbarBrand for left alignment and 10px margin */}
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
          <div className="flex flex-row gap-2">
            <ThemeSwitch />
            <UserDrawerMenu />
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
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pr-[10px]" justify="end">
        <ThemeSwitch />
        <NavbarItem>
          <UserDrawerMenu />
        </NavbarItem>
        <NavbarItem className="mt-2">
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
        </NavbarItem>
        <NavbarMenuToggle />
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
