"use client";


import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ScriptFormProps {
    websiteId: string;
    domain: string;
}

export default function ScriptForm({ websiteId, domain }: ScriptFormProps) {
    const router = useRouter();


    const Script = `<script
    defer
    data-website-id="${websiteId}"
    data-domain="${domain}"
    src="${domain}/analytics.js">
    </script>`;

    const onCopy = () => {
        navigator.clipboard.writeText(Script);
        toast.success("Script copied to clipboard");
    };

    const handleDone = () => {
        router.push("/dashboard");
    };

    return (
        <div className="flex justify-center mt-10">
            <Card className="max-w-xl w-full">

                <CardHeader>
                    <CardTitle>Install the WebTrack Script</CardTitle>
                    <CardDescription>
                        Copy and paste the following script into the{" "}
                        <code className="font-mono text-sm">&lt;head&gt;</code> section of your
                        website&apos;s HTML.
                    </CardDescription>
                </CardHeader>

                <Separator className="bg-zinc-200 dark:bg-zinc-800" />

                <CardContent className="space-y-6 pt-6">
                    <div className="relative">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onCopy}
                            className="absolute top-2 right-2 z-10 text-zinc-400 hover:text-white"
                        >
                            <Copy size={16} />
                        </Button>

                        <SyntaxHighlighter
                            language="html"
                            style={vscDarkPlus}
                            customStyle={{
                                borderRadius: "0.5rem",
                                fontSize: "0.875rem",
                                margin: 0,
                                paddingRight: "3rem",
                            }}
                        >
                            {Script}
                        </SyntaxHighlighter>
                    </div>

                    <Button className="w-full" onClick={handleDone}>
                        Ok, I&apos;ve installed the script
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}