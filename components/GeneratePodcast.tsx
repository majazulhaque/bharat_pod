import { GeneratePodcastProps } from "@/types";
import React, { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { toast, useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import Image from "next/image";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);

    setAudio("");

    if (!voicePrompt) {
      toast({
        title: "Please provide a voice type to generate a podcast",
      });
      return setIsGenerating(false);
    }
    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const podcastRef = useRef<HTMLInputElement>(null);
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const { toast } = useToast();
  const [isAiPodcast, setIsAiPodcast] = useState(false);
  const [isPodcastLoading, setIsPodcastLoading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const handlePodcast = async (blob: Blob, fileName: string) => {
    try {
      const file = new File([blob], fileName, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      props.setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      props.setAudio(audioUrl!);
      setIsPodcastLoading(false);
      toast({
        title: "Podcast uploaded successfully",
      });
    } catch (error) {
      console.log("Error uploading podcast", error);
      toast({
        title: "Error uploading podcast",
        variant: "destructive",
      });
      setIsPodcastLoading(false);
    }
  };

  const uploadPodcast = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsPodcastLoading(true);
    const file = e.target.files?.[0];
    if (file && file.size <= 50 * 1024 * 1024) {
      handlePodcast(file, file.name);
    } else {
      toast({
        title: "File is too large or not an mp3",
        variant: "destructive",
      });
      setIsPodcastLoading(false);
    }
  };

  return (
    <div>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6": isAiPodcast })}
          onClick={() => setIsAiPodcast(true)}
        >
          Use AI to generate podcast
        </Button>
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6": !isAiPodcast })}
          onClick={() => setIsAiPodcast(false)}
        >
          Upload custom podcast
        </Button>
      </div>
      {isAiPodcast ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Podcast
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate audio"
              rows={5}
              value={props.voicePrompt}
              onChange={(e) => props.setVoicePrompt(e.target.value)}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
              onClick={generatePodcast}
            >
              {isGenerating ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => podcastRef.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={podcastRef}
            onChange={(e) => uploadPodcast(e)}
          />
          {!isPodcastLoading ? (
            <Image
              src="/icons/upload-image.svg"
              alt="upload"
              width={40}
              height={40}
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">mp3 (max. 50mb)</p>
          </div>
        </div>
      )}
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
