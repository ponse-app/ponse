"use client"
import MenuButton from "@/components/TopBar/MenuButton";
import { useTranslation } from "react-i18next";

export default function Home() {
    const [t, i18n] = useTranslation();
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <MenuButton />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1>{t("about.title")}</h1>
                <p>{t("about.project")}</p>
                <h1>{t("about.we")}</h1>
                <p>
                    <a href="https://github.com/juuso-turunen" className="text-blue-500">
                        Juuso Turunen
                    </a>
                    ,{" "}
                    <a href="https://github.com/paajooni" className="text-blue-500">
                        Joonas Paasovaara
                    </a>
                    ,{" "}
                    <a href="https://github.com/enxoc" className="text-blue-500">
                        Atte Oinonen
                    </a>
                    ,{" "}
                    <a href="https://github.com/Vieteri27" className="text-blue-500">
                        Veeti Kataja
                    </a>
                </p>
            </main>
        </div>
    );
}
