"use client";
import dynamic from "next/dynamic";

const DynamicVideoUI = dynamic(() => import("./VideoUIKit"), { ssr: false });

export default function VideoCall() {
  return <DynamicVideoUI />;
}
