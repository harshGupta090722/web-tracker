"use client";
import { LiveUserType, WebsiteInfoType, WebsiteType } from "@/configs/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormInput from "./_components/FormInput";
import PageViewAnalytics from "./_components/PageViewAnalytics";
import { format } from "date-fns";
import SourceWidget from "./_components/SourceWidget";
import LocationWidget from "./_components/LocationWidget";
import DeviceWidget from "./_components/DeviceWidget";

function WebsiteDetail() {

  const { websiteId } = useParams();
  const [websiteList, setWebsiteList] = useState<WebsiteType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>();
  const [liveUser, setLiveUser] = useState<LiveUserType[]>([]);
  const [formData, setFormData] = useState<any>({
    analyticType: 'hourly',
    fromDate: new Date(),
    toDate: new Date()
  });

  useEffect(() => {
    GetWebsiteList();
  }, []);



  const GetWebsiteList = async () => {
    const websites = await axios.get('/api/website?websiteOnly=true')
    console.log("Here is you website data ", websites?.data);
    setWebsiteList(websites?.data);
  }

  //console.log("WebsiteId:", websiteId);


  const GetWebsiteAnalyticDetail = async () => {
    setLoading(true);

    const fromDate = format(formData?.fromDate, 'yyyy-MM-dd');
    const toDate = formData?.toDate ? format(formData?.toDate, 'yyyy-MM-dd') : fromDate;

    const websiteResult = await axios.get(`/api/website?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`);
    console.log("WebisteResult", websiteResult);
    setWebsiteInfo(websiteResult?.data[0]);
    setLoading(false);
    GetLiveUsers();
  }

  const GetLiveUsers = async () => {
    try {
      const result = await axios.get('/api/live?websiteId=' + websiteId);
      console.log('Live users result:', result.data);
      setLiveUser(result?.data);
    } catch (err) {
      console.error('Error fetching live users:', err);
    }
  }

  useEffect(() => {
    GetWebsiteAnalyticDetail();
  }, [formData?.fromDate, formData?.toDate, formData?.analyticType]);

  return (
    <div className="mt-10">
      <FormInput websiteList={websiteList} setFormData={setFormData} setReloadData={() => GetWebsiteAnalyticDetail()} />
      <PageViewAnalytics
        websiteInfo={websiteInfo}
        loading={loading}
        analyticType={formData?.analyticType}
        liveUserCount={liveUser?.length}
      />


      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
        <SourceWidget websiteAnalytics={websiteInfo?.analytics} loading={loading} />

        <LocationWidget websiteAnalytics={websiteInfo?.analytics} loading={loading} />

        <DeviceWidget websiteAnalytics={websiteInfo?.analytics} loading={loading} />
      </div>
    </div>
  );
}

export default WebsiteDetail;