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
import { LogIn, UserPlus, ShoppingCart, Heart, X } from "lucide-react";

export default function UserDrawerMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Avatar
        showFallback
        size="sm"
        src="https://images.unsplash.com/broken"
        className="cursor-pointer"
        onClick={onOpen}
      />

      <Drawer
        isOpen={isOpen}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
            },
            exit: {
              x: 100,
              opacity: 0,
            },
          },
        }}
        onOpenChange={onOpenChange}
        size="sm"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Hi User Name
              </DrawerHeader>
              <DrawerBody>
                <p>This drawer has custom enter/exit animations.</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
