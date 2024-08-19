import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";

export default function GenerateEmbedButton({
  gridSlug,
}: {
  gridSlug: string;
}) {
  const [embedCode, setEmbedCode] = useState("");

  const generateEmbedCode = () => {
    const code = `<iframe src="${env.NEXT_PUBLIC_EMBEDS_CLIENT_BASE_URL}/${gridSlug}" width="100%" height="500" frameborder="0"></iframe>`;
    setEmbedCode(code);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={generateEmbedCode}>Generate Embed</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Embed Code</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="embed-code" className="text-right">
              Code
            </Label>
            <Input
              id="embed-code"
              value={embedCode}
              readOnly
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={() => navigator.clipboard.writeText(embedCode)}>
          Copy to Clipboard
        </Button>
      </DialogContent>
    </Dialog>
  );
}
