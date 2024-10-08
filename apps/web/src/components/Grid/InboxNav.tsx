import React, { type FC } from "react";
import { CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useInboxContext } from "./InboxContext";
import { TestimonialType } from "@/type/testimonials";
import { Button } from "../ui/button";

const InboxNav = () => {
  return (
    <div className="flex flex-col gap-2 py-4">
      <CardTitle className="px-4 py-2">INBOX</CardTitle>
      <Separator />
      <nav className="clear-start grid w-[200px] gap-4 px-4 py-2 text-start text-sm text-muted-foreground">
        <InboxButton inbox={TestimonialType.All} />
        <InboxButton inbox={TestimonialType.Text} />
      </nav>
    </div>
  );
};

const InboxButton: FC<{ inbox: TestimonialType }> = ({ inbox }) => {
  const { currentInbox, setCurrentInbox } = useInboxContext();

  return (
    <Button
      onClick={() => {
        setCurrentInbox(inbox);
      }}
      className="justify-start text-start"
      variant={currentInbox === inbox ? "default" : "link"}
    >
      {inbox}
    </Button>
  );
};

export default InboxNav;
