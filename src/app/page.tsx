import Container from "@/app/_components/container";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "../lib/api";
import { AdSense } from "./_components/common/adsense";

export default function Index() {
  const allPosts = getAllPosts();
  return (
    <main>
      <Container>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-y-2 mt-2 ">
          <div className="md:p-1">
            {allPosts.length > 0 && <MoreStories posts={allPosts} />}
          </div>
        </div>
      </Container>
    </main>
  );
}
