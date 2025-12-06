"use client";
import MenuButton from "@/components/TopBar/MenuButton";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Home() {

    const [t, i18n] = useTranslation();
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <MenuButton />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-[50vw]">
                <h1>Käyttöohje:</h1>
                <p className="w-full">
                    {t('instructions.largeMapInfo')}
                    {/* {t('instructions.largeMapInfo','Voit valita kunnan klikkaamalla isoa karttaa. Voit valita kunnan myös'+
                    'kirjoittamalla kunnan nimen hakupalkkiin. Tässä parametrina on valittu miesten'+
                    'määrä. Karttaselite kertoo mikä väri vastaa mitäkin parametrin arvoa. Hoveraamalla'+
                    'kunnan päällä näet myös pikainfon kunnasta oikeassa yläkulmassa. Seuraavaksi opit'+
                    'parametrin valitsemisen.')} */}
                </p>
                <div className="w-full h-[50vw] relative">
                    <Image fill src="/images/LargeMapPicture.png" alt="Large map" />
                </div>
                <p>
                    Voit valita parametrin valitsemalla &quot;Valitse parametrit&quot; -laatikon
                    dropdown menusta.
                </p>
                <div className="w-full h-[20vw] relative">
                    <Image fill src="/images/ParameterSelectorPicture.png" alt="Parameter selector" />
                </div>
                <p className="w-full">
                    Klikattuasi kuntaa kartalta aukeaa sivulle pienempi kartta tarkempaa
                    kuntakohtaista tarkastelua varten. Kartalta näet kunnan postinumeroalueet ja
                    valitun parametrin mukaisen värityksen (nyt Kittilä ja miesten määrä).
                </p>
                <div className="w-full h-[30vw] relative">
                    <Image fill src="/images/PreviewMapPicture.png" alt="Preview map" />
                </div>
            </main>
        </div>
    );
}
