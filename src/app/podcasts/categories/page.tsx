import CategoriesClient from "../../../clients/CategoriesClient";

export default async function PodcastsCategoriesPage() {
  return (
    <CategoriesClient
      titleKey="podcast.podcasts"
      linkPath="/podcasts" />
  );
}