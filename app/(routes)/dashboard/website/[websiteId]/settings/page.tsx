"use client";
import { Button } from '@/components/ui/button'
import { WebsiteType } from '@/configs/type';
import axios from 'axios';
import { ArrowLeft, Copy, Loader, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-separator';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function WebsiteSettings() {
  const { websiteId } = useParams();
  const [websiteDetail, setWebDetail] = useState<WebsiteType>();
  const [websiteDomain, setWebsiteDomain] = useState<string>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const GetWebsiteDetail = async () => {
    const result = await axios.get(`/api/website?websiteId=${String(websiteId).trim()}&websiteOnly=true`);
    console.log("here is your website detail", result.data);
    setWebDetail(result?.data);
    setWebsiteDomain(result?.data?.domain);
  }

  useEffect(() => {
    GetWebsiteDetail();
  }, [])

  const Script = `<script
  defer
  data-website-id="${websiteId}"
  data-domain="${websiteDetail?.domain}"
  src="${websiteDetail?.domain}/analytics.js">
</script>`;

  const onCopy = () => {
    navigator.clipboard.writeText(Script);
    toast.success('Script copied to clipboard');
  };

  const onDeleteWebsite = async () => {
    setLoading(true);
    const result = await axios.delete('/api/website', {
      data: {
        websiteId: websiteId
      }
    });
    toast.success('Website deleted successfully');
    setLoading(false);
    router.replace('/dashboard');
  }

  return (
    <div className='w-full mt-10 mb-20'>
      <div className='flex items-center gap-3'>
        <Link href={`/dashboard/website/${websiteId}`}>
          <Button><ArrowLeft />Back</Button>
        </Link>
        <h2 className='font-bold text-2xl mt-3'>Settings for {websiteDetail?.domain?.replace('https://', '')}</h2>
      </div>

      <Tabs defaultValue="general" className="w-[800px] mt-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Script</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
              Copy and paste the following script into the{" "}
              <code className="font-mono text-sm">&lt;head&gt;</code> section of your
              website&apos;s HTML.
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
            </CardContent>
          </Card>
          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>Domain</CardTitle>
              <CardDescription>Your main website domain for analytics tracking.</CardDescription>
            </CardHeader>
            <CardContent>

              <Input placeholder='website.com' value={websiteDomain || ""}
                onChange={(e) => setWebsiteDomain(e.target.value)}
              />

              <div className='flex justify-between mt-2'>
                <h2>Your public WEBTRACK ID is {websiteId}</h2>
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other">
          <Card>
            <CardHeader>Danger</CardHeader>
            <Separator />
            <CardContent className='flex justify-between mt-3'>
              <h2>Do you want to delete this website from webtrack?</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='text-white' variant="destructive"><Trash />Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your website
                      from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button className='text-white'
                        onClick={() => onDeleteWebsite()}
                        disabled={loading}
                        variant={'destructive'}>
                        {loading ? <Loader className='animate-spin' /> :
                          'Continue to Delete'}</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

    </div >
  )
}

export default WebsiteSettings;