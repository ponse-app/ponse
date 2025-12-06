"use client"
import { memo, useState } from "react";
import Link from "next/link";

import { useTranslation } from "react-i18next";

const lngs = {
    fi: { nativeName: 'Suomi' },
    en: { nativeName: 'English' },
    //sv: { nativeName: 'Svenska' },
}

function MenuButton() {


    //i18n
    const { t, i18n, ready } = useTranslation();


    const [miniMenuVisibility, setMiniMenuVisibility] = useState(true);
    const [menuVisibility, setMenuVisibility] = useState(false);

    let timeoutId = 0;

    function handleMouseEnter(e) {
        e.preventDefault();
        setMiniMenuVisibility(false);
        setMenuVisibility(true);
    }
    function handleMenuMouseEnter(e) {
        e.preventDefault();

        clearTimeout(timeoutId);
    }
    function handleMenuMouseLeave(e) {
        e.preventDefault();

        timeoutId = setTimeout(() => {
            setMiniMenuVisibility(true);
            setMenuVisibility(false);
        }, 1000);
    }

    const MiniMenuStyles = {
        position: "absolute",
        left: 0,
        top: 0,
        float: "left",
        visibility: miniMenuVisibility ? "visible" : "hidden",
    };

    const MenuStyles = {
        position: "absolute",
        left: 0,
        top: 0,
        visibility: menuVisibility ? "visible" : "hidden",
    };

    return (
        <div>
            <div
                className="bg-gray-600 w-[10vh] h-[10vh] z-[100] rounded-md select-none flex items-center"
                onMouseMove={(e) => handleMouseEnter(e)}
                style={MiniMenuStyles}
            >
                <p className="w-full text-center">{t('menu.name', "Menu")}</p>
            </div>
            <div
                className="bg-gray-600 w-40 h-fit z-[10000] rounded-md select-none flex items-center flex-col justify-center text-center pt-10 pb-10"
                onMouseMove={(e) => handleMenuMouseEnter(e)}
                onMouseLeave={(e) => handleMenuMouseLeave(e)}
                style={MenuStyles}
            >
                <Link
                    className="pt-1 pb-1 w-[80%] rounded-2xl hover:bg-gray-400 select-none"
                    href="/"
                >
                    {t('menu.home')}
                </Link>
                <Link
                    className="pt-1 pb-1 w-[80%] rounded-2xl hover:bg-gray-400"
                    href="/instructions"
                >
                    {t('menu.instructions')}
                </Link>
                <Link className="pt-1 pb-1 w-[80%] rounded-2xl hover:bg-gray-400" href="/about">
                    {t('menu.about')}
                </Link>
                <div className="pt-1 pb-1 w-[80%] rounded-2xl flex flex-col justify-evenly">
                    {Object.keys(lngs).map((lng) => (
                        <input key={lng} type="button"
                            style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }}
                            className="hover:bg-gray-400"
                            value={lng}
                            onClick={(e) => {
                                e.preventDefault();
                                i18n.changeLanguage(lng);
                            }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(MenuButton);
