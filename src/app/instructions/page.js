"use client";
import MenuButton from "@/components/TopBar/MenuButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <MenuButton />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-[50vw]">
        <h1>Käyttöohje:</h1>
        <p className="w-full">
          Voit valita kunnan klikkaamalla isoa karttaa. Tässä parametrina on valittu miesten määrä.
          Karttaselite kertoo mikä väri vastaa mitäkin parametrin arvoa. Kohta opit parametrin
          valitsemisen.
        </p>
        <div className="w-full h-[50vw] relative">
          <Image fill src="/images/LargeMapPicture.png" alt="Large map" />
        </div>
        <p>
          Voit valita parametrin valitsemalla &quot;Valitse parametrit&quot; -laatikon dropdown
          menusta.
        </p>
        <div className="w-full h-[20vw] relative">
          <Image fill src="/images/ParameterSelectorPicture.png" alt="Parameter selector" />
        </div>
      </main>
    </div>
  );
}
