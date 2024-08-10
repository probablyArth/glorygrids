import React from "react";
import UserAvatar from "./common/UserAvatar";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary-foreground p-4 font-bold text-background">
      <Link href={"/"}>
        <h1 className="text-3xl">Glory Grids</h1>
      </Link>
      <UserAvatar />
    </div>
  );
};

export default Navbar;
