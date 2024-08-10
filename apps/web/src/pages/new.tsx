import NewGrid from "@/components/NewGrid";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import Link from "next/link";
import React from "react";

const NewPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Link href={"/dashboard"}>
        <Button className="w-fit text-primary" variant={"link"}>
          <StepBack className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
      <NewGrid />
    </div>
  );
};

export default NewPage;
