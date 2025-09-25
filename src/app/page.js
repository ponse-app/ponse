import Image from "next/image";
import dynamic from "next/dynamic";
import Map from "../components/Map/Map";

export default function Home() {
    /* const Map = useMemo(() => dynamic(
    () => import('../components/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []) */

    return (
        <div className="font-sans grid items-center justify-items-center min-h-screen">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Map />
            </main>
        </div>
    );
}
