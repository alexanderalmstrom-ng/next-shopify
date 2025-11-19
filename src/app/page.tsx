import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <HydrateClient>
        <p className="text-2xl">{hello.greeting}</p>
      </HydrateClient>
    </div>
  );
}
