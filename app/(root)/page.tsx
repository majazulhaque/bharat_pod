"use client";
import PodcastCard from "@/components/PodcastCard";
import PodcastRowCard from "@/components/PodcastRowCard";
// import { podcastData } from "@/constant";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  return (
    <div className=" mt-9 flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="podcast_grid">
          {trendingPodcasts
            ?.slice(0, 4)
            ?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl!}
                description={podcastDescription}
                title={podcastTitle}
                podcastId={_id}
              />
            ))}
        </div>
      </section>
      <section className="flex flex-col gap-5 mt-10 mb-10">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-20 font-bold text-white-1">Latest Podcasts</h1>
          <h2 className="text-16 font-semibold text-orange-1 cursor-pointer">See All</h2>
        </div>
        <div className="flex flex-col w-full">
          {trendingPodcasts
            ?.slice(0, 4)
            ?.map(({ _id, podcastTitle, imageUrl, views,audioDuration }, index) => (
              <PodcastRowCard
                index={index}
                imgUrl={imageUrl!}
                title={podcastTitle}
                views={views!}
                podcastId={_id}
                audioDuration={audioDuration}
              />
            ))}
        </div>
      </section>
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Popular Podcasts</h1>

        <div className="podcast_grid">
          {trendingPodcasts
            ?.slice(0, 4)
            ?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl!}
                description={podcastDescription}
                title={podcastTitle}
                podcastId={_id}
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
