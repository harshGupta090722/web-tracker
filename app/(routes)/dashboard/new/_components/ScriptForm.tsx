"use client";

import { useState } from "react";
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
import { Check, Copy } from "lucide-react";

interface ScriptFormProps {
    websiteId: string;
    domain: string;
}

export default function ScriptForm({ websiteId, domain }: ScriptFormProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const script = `<script
  defer
  data-website-id="${websiteId}"
  data-domain="${domain}"
  src="${domain}/analytics.js">
</script>`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                            onClick={handleCopy}
                            className="absolute top-2 right-2 text-zinc-400 hover:text-white"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </Button>

                        <pre className="rounded-lg bg-zinc-900 p-4 text-sm overflow-x-auto">
                            <code className="text-zinc-100">
                                {"<script\n"}
                                {"  defer\n"}
                                {"  data-website-id=\""}
                                <span className="text-emerald-400">{websiteId}</span>
                                {"\"\n"}
                                {"  data-domain=\""}
                                <span className="text-emerald-400">{domain}</span>
                                {"\"\n"}
                                {"  src=\""}
                                <span className="text-emerald-400">
                                    {domain}/analytics.js
                                </span>
                                {"\">\n"}
                                {"</script>"}
                            </code>
                        </pre>
                    </div>

                    <Button className="w-full" onClick={handleDone}>
                        Ok, I've installed the script
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}