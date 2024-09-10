"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { PodcastDetailPlayerProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useAudio } from "@/providers/AudioProvider";

const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
}: PodcastDetailPlayerProps) => {
  const router = useRouter();
  const { audio, setAudio } = useAudio();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);

  //canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleAudioPlay = async () => {
      if (playAudio) {
        setAudio({
          title: podcastTitle,
          audioUrl,
          imageUrl,
          author,
          podcastId,
        });
        visualizeAudio();
      }
    };

    handleAudioPlay();
  }, [playAudio]);

  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({
        title: "Podcast deleted",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting podcast",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    toast({
      title: "Edit features under development.",
    });
    setIsDeleting(false);
  };

  const handlePlay = () => {
    setPlayAudio(true);
  };

  useEffect(()=>{
    if(audio?.audioUrl === audioUrl){
      setPlayAudio(true);
    }
  },[]);

  const visualizeAudio = () => {
    if (!canvasRef.current) {
      return;
    }
  
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;
  
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
    const draw = () => {
      requestAnimationFrame(draw);
  
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#F97535";
      canvasCtx.beginPath();
  
      const numLines = 100; // Number of lines to draw
      const lineSpacing = canvas.width / numLines;
      let x = 0;
  
      for (let i = 0; i < numLines; i++) {
        const y = Math.random() * canvas.height;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += lineSpacing;
      }
  
      canvasCtx.stroke();
    };
  
    draw();
  };
  
  

  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;

  return (
    <div className=" relative mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col justify-start gap-2 max-md:items-center min-h-[120px]">
            <h1 className="text-[25px] w-[500px] font-extrabold tracking-[-0.32px] text-white-1">
              {podcastTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${authorId}`);
              }}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>

          {playAudio ? (
            <canvas ref={canvasRef}className="absolute bottom-5 w-[300px] h-[50px]" />
          ) : (
            <Button
              onClick={handlePlay}
              className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
            >
              <Image
                src="/icons/Play.svg"
                width={20}
                height={20}
                alt="random play"
              />{" "}
              &nbsp; Play podcast
            </Button>
          )}
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <div className="absolute -left-32 -top-2 z-10 flex flex-col w-32 cursor-pointer justify-center rounded-md bg-black-6">
              <div
                className="w-full flex  hover:bg-black-2 p-2 rounded-t-md"
                onClick={handleEdit}
              >
                <Image
                  src="/icons/edit.svg"
                  width={16}
                  height={16}
                  alt="Edit icon"
                  className="mr-2"
                />
                <h2 className="text-16 font-normal text-white-1">Edit</h2>
              </div>
              <div
                className="flex w-full hover:bg-black-2 p-2 rounded-b-md"
                onClick={handleDelete}
              >
                <Image
                  src="/icons/delete.svg"
                  width={16}
                  height={16}
                  alt="Delete icon"
                  className="mr-2"
                />
                <h2 className="text-16 font-normal text-white-1">Delete</h2>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastDetailPlayer;
