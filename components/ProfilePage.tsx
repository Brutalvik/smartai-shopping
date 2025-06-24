"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState({
    name: "Vikram Canada",
    email: "vikcanada90@gmail.com",
    phone: "+1 825-882-2199",
    address: "123 Main Street, Calgary, AB, Canada",
    city: "Calgary",
    postalCode: "T2X 1A1",
    country: "Canada",
    profilePic: "/images/profile-avatar.png",
    preferredPayment: "Visa ending in 1234",
    dateOfBirth: "1990-07-15",
    gender: "Male",
    newsletterSubscribed: true,
  });

  const [selectedTab, setSelectedTab] = useState("profile");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6">
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

      <div className="mt-6">
        {selectedTab === "profile" && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <Avatar src={profile.profilePic} size="lg" />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full text-white opacity-0 hover:opacity-100 text-xs"
                  onClick={() => setShowAvatarModal(true)}
                >
                  Edit
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Phone Number", value: profile.phone },
                { label: "Address", value: profile.address },
                { label: "City", value: profile.city },
                { label: "Postal Code", value: profile.postalCode },
                { label: "Country", value: profile.country },
                { label: "Date of Birth", value: profile.dateOfBirth },
                { label: "Gender", value: profile.gender },
                { label: "Preferred Payment", value: profile.preferredPayment },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-sm font-medium text-gray-700">
                    {item.label}
                  </label>
                  <Input value={item.value} isDisabled className="mt-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "settings" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profile.newsletterSubscribed}
                disabled
              />
              <span className="text-gray-700">Subscribed to newsletter</span>
            </label>
          </div>
        )}

        {selectedTab === "orders" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            <p className="text-gray-500">No orders placed yet.</p>
          </div>
        )}

        {selectedTab === "security" && (
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
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

      <Modal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Change Profile Picture</h2>
          <Input type="file" className="mb-4" />
          <div className="flex justify-end gap-2">
            <Button onPress={() => setShowAvatarModal(false)} variant="light">
              Cancel
            </Button>
            <Button onPress={() => setShowAvatarModal(false)} variant="solid">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
