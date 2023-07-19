"use client"
import { createElement } from "react";
import {
  Typography,
  MenuItem,
} from "@material-tailwind/react";
import Link from "next/link";

const NavList = ({ items }) => {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-10 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {items.map(({ label, icon, link }, key) => (
        <Link href={link} key={key}>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal"
          >
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              { createElement(icon, { className: "h-[18px] w-[18px]" }) }{" "}{label}
            </MenuItem>
          </Typography>
        </Link>
      ))}
    </ul>
  );
}

export default NavList;