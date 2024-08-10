import Grids from "@/components/Grids/grids";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashbaordPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-4xl font-bold">Grids</h1>
        <Link href={"/new"}>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create a new grid
          </Button>
        </Link>
      </div>
      <Grids />
    </div>
  );
};

export default DashbaordPage;
