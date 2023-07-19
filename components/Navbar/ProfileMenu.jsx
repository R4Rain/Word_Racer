"use client"
import { useState, createElement } from 'react';
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const ProfileMenu = ({ items, user }) => {
  const { name, picture } = user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }
  
  return (
    <Menu open={isMenuOpen} handler={handleMenu} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-2 rounded-full py-0.5 pr-2 pl-1"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="Profile"
            src={picture?.url ? picture?.url : "/assets/default.png"}
          />
          <Typography variant="small" className="text-gray-500 normal-case md:inline-block hidden">
            { name }
          </Typography>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {items.map(({label, color, icon, handle}) => (
          <MenuItem
            key={label}
            onClick={handle}
            className={`flex items-center gap-2 rounded ${
              color
                ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                : ""
            }`}
          >
            {createElement(icon, {
              className: `h-4 w-4 ${color ? "text-red-500" : ""}`,
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="small"
              className="font-normal"
              color={color ? "red" : "inherit"}
            >
              {label}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default ProfileMenu;