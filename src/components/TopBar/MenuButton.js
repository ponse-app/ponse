import { memo, useState } from "react";
import Link from "next/link";

function MenuButton() {

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
        }, 1000)
    }

    const MiniMenuStyles = {
        position: "absolute",
        left: 0,
        top: 0,
        float: "left",
        visibility : miniMenuVisibility ? "visible" : "hidden",
    };

    const MenuStyles = {
        position: "absolute",
        left: 0,
        top: 0,
        visibility : menuVisibility ? "visible" : "hidden",
    };


    return (
        <div>
            <div className="bg-gray-500 w-[10vh] h-[10vh] z-[100] rounded-md select-none"
            onMouseMove={(e) => handleMouseEnter(e)}
            style={MiniMenuStyles}>
                <p className="w-full text-center">━━━</p>
                <p className="w-full text-center">━━━</p>
                <p className="w-full text-center">━━━</p>
            </div>
            <div className="bg-gray-500 w-40 h-30 z-[100] rounded-md select-none flex items-center flex-col justify-center text-center pt-10 pb-10"
            onMouseMove={(e) => handleMenuMouseEnter(e)}
            onMouseLeave={(e) => handleMenuMouseLeave(e)}
            style={MenuStyles}>
                <Link className="pt-1 pb-1 w-[80%] rounded-2xl hover:bg-gray-400 select-none"
                href="/">Koti</Link>
                <Link className="pt-1 pb-1 w-[80%] rounded-2xl hover:bg-gray-400"
                href="/instructions">Käyttöohje</Link>
                <Link className="pt-1 pb-1 w-[80%] rounded-2xl hover:bg-gray-400"
                href="/about">Tietoja</Link>
                <Link className="pt-1 pb-1 w-[80%] rounded-2xl hover:bg-gray-400"
                href="/bestForYou">Paras kunta sinulle</Link>
            </div>
        </div>
    );

}

export default memo(MenuButton);