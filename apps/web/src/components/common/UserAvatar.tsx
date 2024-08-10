import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";

const UserAvatar = () => {
  const { status } = useSession();

  return (
    <>
      {status === "loading" ? (
        <LoadingAvatar />
      ) : status === "authenticated" ? (
        <AuthenticatedAvatar />
      ) : (
        <UnAuthenticatedAvatar />
      )}
    </>
  );
};

const UnAuthenticatedAvatar = () => {
  return (
    <Button
      variant={"default"}
      onClick={() => {
        void signIn();
      }}
    >
      Log in
    </Button>
  );
};

const AuthenticatedAvatar = () => {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user as unknown as Session["user"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              void router.push("/dashboard");
            }}
          >
            Dashboard
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              void signOut();
            }}
            className="bg-red-500 text-white"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LoadingAvatar = () => {
  return (
    <div className="flex items-center justify-center rounded-full bg-background p-4 text-foreground shadow-md">
      loading...
    </div>
  );
};

export default UserAvatar;
