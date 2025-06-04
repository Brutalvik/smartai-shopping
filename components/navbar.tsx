"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { Avatar } from "@heroui/avatar";
import UserDrawerMenu from "@/components/UserDrawerMenu";
import { RiShoppingCart2Line } from "react-icons/ri";
import { Badge } from "@heroui/badge";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

export const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();
  const { totalItems } = useCart();
  console.log("USER ", user);
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="Search..."
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit text-2xl">YVO</p>
          </NextLink>
        </NavbarBrand>
        {/* <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul> */}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          {/* <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link> */}
        </NavbarItem>
        <NavbarItem className="hidden lg:flex bg-default-100 rounded">
          {searchInput}
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            startContent={<SearchIcon />}
            variant="flat"
          />
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <UserDrawerMenu />
        </NavbarItem>
        <NavbarItem className="mt-2">
          <Badge color="primary" content={totalItems}>
            <RiShoppingCart2Line
              fontSize={30}
              className="hover:cursor-pointer"
              fontWeight={900}
              onClick={() => router.push("/cart")}
            />
          </Badge>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarItem>
          <UserDrawerMenu />
        </NavbarItem>
        <NavbarItem className="mt-2">
          <Badge color="primary" content={totalItems}>
            <RiShoppingCart2Line
              fontSize={30}
              className="hover:cursor-pointer"
              fontWeight={900}
              onClick={() => router.push("/cart")}
            />
          </Badge>
        </NavbarItem>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
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
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))} */}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
