"use client";

import { useState, useEffect, useRef } from "react";
import { IMeMonitor } from "../../../../../model/monitor";

interface AdvertisementGridProps {
  monitor: IMeMonitor;
}

export function AdvertisementGrid({ monitor }: AdvertisementGridProps) {
  const [currentAdvertisementIndex, setCurrentAdvertisementIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    const advertisementCount = monitor.user.advertisements.length;

    const advertisementTimer = setTimeout(() => {
      setCurrentAdvertisementIndex(
        (prevIndex) => (prevIndex + 1) % advertisementCount
      );
    }, monitor.user.advertisements[currentAdvertisementIndex].duration * 1000);
    videoRef.current?.load();
    return () => clearTimeout(advertisementTimer);
  }, [currentAdvertisementIndex, monitor]);

  const currentAdvertisement =
    monitor.user.advertisements[currentAdvertisementIndex];

  return (
    <div>
      <video
        className="fixed left-0 top-0 w-screen h-screen object-cover"
        ref={videoRef as unknown as React.RefObject<HTMLVideoElement>}
        autoPlay
        muted
        controlsList="nodownload  noremoteplayback"
      >
        <source src={currentAdvertisement.url} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
