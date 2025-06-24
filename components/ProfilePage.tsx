"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks";
import { clearUser } from "@/store/slices/userSlice";
import {
  selectUser,
  selectUserEmail,
  selectIsLoggedIn,
} from "@/store/selectors";

import { encodeUUID, formatPhoneNumber } from "@/utils/helper";

export default function BuyerProfilePage() {
  const user = useAppSelector(selectUser);
  const userEmail = useAppSelector(selectUserEmail);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  const [selectedTab, setSelectedTab] = useState("profile");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Tabs
          aria-label="Buyer Profile Tabs"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="profile" title="Profile" />
          <Tab key="settings" title="Settings" />
          <Tab key="orders" title="Orders" />
          <Tab key="security" title="Security" />
        </Tabs>
        <Button
          variant={isEditing ? "solid" : "flat"}
          color="primary"
          onPress={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="mt-6">
        {selectedTab === "profile" && (
          <div className="shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <Avatar
                  src={user.profilePic || "/images/profile-avatar.png"}
                  size="lg"
                />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full text-white opacity-0 hover:opacity-100 text-xs"
                  onClick={() => setShowAvatarModal(true)}
                >
                  Edit
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.given_name || ""}
                </h2>
                <p className="text-gray-500">{user.email || ""}</p>
                <p className="text-gray-500">
                  ID: {encodeUUID(user.id).encoded}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Phone Number", value: formatPhoneNumber(user.phone) },
                { label: "Address", value: user.address || "" },
                { label: "City", value: user.city || "" },
                { label: "Postal Code", value: user.postalCode || "" },
                { label: "Country", value: user.country || "" },
                { label: "Date of Birth", value: user.dateOfBirth || "" },
                {
                  label: "Preferred Payment",
                  value: user.preferredPayment || "",
                },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-sm font-medium text-gray-700">
                    {item.label}
                  </label>
                  <Input
                    value={item.value}
                    isDisabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "settings" && (
          <div className="shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={user.newsletterSubscribed || false}
                disabled
              />
              <span className="text-gray-700">Subscribed to newsletter</span>
            </label>
          </div>
        )}

        {selectedTab === "orders" && (
          <div className="shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            <p className="text-gray-500">No orders placed yet.</p>
          </div>
        )}

        {selectedTab === "security" && (
          <div className="shadow rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input
                type="password"
                value="********"
                isDisabled
                className="mt-1"
              />
            </div>
            <Button onPress={() => alert("Change password logic")}>
              Change Password
            </Button>
          </div>
        )}
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Change Profile Picture
            </h2>
            <Input type="file" className="mb-4" />
            <div className="flex justify-end gap-2">
              <Button onPress={() => setShowAvatarModal(false)} variant="flat">
                Cancel
              </Button>
              <Button
                onPress={() => setShowAvatarModal(false)}
                variant="solid"
                color="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
