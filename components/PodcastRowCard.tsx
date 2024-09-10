
import { api } from "@/convex/_generated/api";
import { formatDuration } from "@/lib/formatDuration";
import { useAudio } from "@/providers/AudioProvider";
import { PodcastCardRowProps } from "@/types";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const PodcastRowCard = ({
  imgUrl,
  title,
  views,
  podcastId,
  key,
  index,
  audioDuration,
  audioUrl,
}: PodcastCardRowProps) => {
  const router = useRouter();
  const {audio} = useAudio();
  const incrementViews = useMutation(api.podcasts.updatePodcastViews);
  const handleViews = async() => {
    await incrementViews({ podcastId });
    router.push(`/podcasts/${podcastId}`, {
      scroll: true,
    });
  };

  return (
    <div className="flex w-full items-center justify-between cursor-pointer" onClick={handleViews}>
      <span className="text-16 text-white-1 mr-5 w-[20px] flex items-center justify-center">{audio?.audioUrl === audioUrl ? (
        <Image src="/icons/Play.svg" alt="play icon" width={22} height={22}/>
      ):(
        index + 1
      )}</span>
      <div className="flex w-full items-center justify-between border-b-[1px] border-gray-700 py-4">
        <div className="flex items-center">
          <Image
            src={imgUrl}
            alt="podcast image"
            width={45}
            height={45}
            className="mr-5 w-[45px] h-[45px] object-cover rounded-md"
          />
          <span className="text-14 tracking-wider text-white-1 font-normal truncate w-[250px]">{title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center w-[100px] text-14 text-white-1 font-semibold">
            <Image
              src="/icons/headphone.svg"
              alt="headphone"
              width={22}
              height={22}
              className="mr-2"
            />
            {views.toLocaleString()}
          </span>
          <span className="hidden md:flex items-center w-[100px] text-14 text-white-1 font-semibold">
            <Image
              className="mr-2"
              src="/icons/clock.svg"
              alt="clock"
              width={22}
              height={22}
            />
            {formatDuration(audioDuration)}
          </span>
          <Image
            className="cursor-pointer"
            src="/icons/dots.svg"
            alt="dots"
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  );
};

export default PodcastRowCard;
