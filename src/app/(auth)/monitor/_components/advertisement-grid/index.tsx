"use client";

import { useState, useEffect, useRef } from "react";
import { IMeMonitor } from "../../../../../model/monitor";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface AdvertisementGridProps {
  monitor: IMeMonitor;
}

export function AdvertisementGrid({ monitor }: AdvertisementGridProps) {
  const [currentAdvertisementIndex, setCurrentAdvertisementIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>();

  const { push } = useRouter();

  useEffect(() => {
    const advertisementCount =
      monitor.user.playlists?.[0]?.playlist?.advertisements?.length;

    const advertisementTimer = setTimeout(() => {
      setCurrentAdvertisementIndex(
        (prevIndex) => (prevIndex + 1) % advertisementCount
      );
    }, monitor.user.playlists?.[0].playlist?.advertisements[currentAdvertisementIndex]?.duration * 1000);
    if (currentAdvertisement?.type === "video") {
      videoRef.current?.load();
    }
    return () => clearTimeout(advertisementTimer);
  }, [currentAdvertisementIndex, monitor]);

  const currentAdvertisement =
    monitor?.user?.playlists?.[0]?.playlist?.advertisements[
      currentAdvertisementIndex
    ];

  async function signout() {
    try {
      const res = await fetch("/api/cookie", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("An error occurred while signing out");
      }
      push("/login");
    } catch (error) {}
  }

  return (
    <div>
      {!currentAdvertisement ? (
        <div className="w-full flex flex-col h-full fixed left-0 top-0 right-0 bg-black text-white flex justify-center items-center">
          <p className="text-2xl">Sem propaganda</p>
          <Button
            onClick={signout}
            className="max-w-96 w-full mt-5"
            type="button"
            color="primary"
          >
            Sair
          </Button>
        </div>
      ) : currentAdvertisement?.type === "video" ? (
        <video
          aria-label="Propagandas"
          className="w-full h-full fixed left-0 top-0 right-0 object-cover"
          ref={videoRef as unknown as React.RefObject<HTMLVideoElement>}
          autoPlay
          muted
          controlsList="nodownload  noremoteplayback"
        >
          <source src={currentAdvertisement?.url} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          className="object-center"
          fill
          quality={100}
          src={currentAdvertisement?.url}
          alt={currentAdvertisement?.name}
        />
      )}
    </div>
  );
}
