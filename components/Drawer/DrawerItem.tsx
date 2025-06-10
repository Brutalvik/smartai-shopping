// components/drawer/DrawerItem.tsx
import React from "react";

interface DrawerItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-default-100 transition"
  >
    <span className="text-default-600">{icon}</span>
    <span className="text-default-800 font-medium">{label}</span>
  </button>
);

export default DrawerItem;
