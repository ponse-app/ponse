import dynamic from "next/dynamic";
//import Map from "../components/Map/Map";

export default function Home() {
  

  const Map = dynamic(() => import('../components/Map/Map'), {
    ssr: !!false,
  });


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Map />
      </main>
    </div>
  );
}
