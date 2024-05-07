"use client";

import { useState, useEffect, useRef } from "react";
import { IMeMonitor } from "../../../../../model/monitor";
import Image from "next/image";

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
    if (currentAdvertisement.type === "video") {
      videoRef.current?.load();
    }
    return () => clearTimeout(advertisementTimer);
  }, [currentAdvertisementIndex, monitor]);

  const currentAdvertisement =
    monitor.user.advertisements[currentAdvertisementIndex];

  return (
    <div>
      {currentAdvertisement.type === "video" ? (
        <video
          aria-label="Propagandas"
          className="w-full h-full fixed left-0 top-0 right-0 object-cover"
          ref={videoRef as unknown as React.RefObject<HTMLVideoElement>}
          autoPlay
          muted
          controlsList="nodownload  noremoteplayback"
        >
          <source src={currentAdvertisement.url} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          className="object-center"
          fill
          quality={100}
          src={currentAdvertisement.url}
          alt={currentAdvertisement.name}
        />
      )}
    </div>
  );
}
