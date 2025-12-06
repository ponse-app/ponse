import { memo } from "react";
import Image from "next/image";

function Logo() {
    return (
        <div className="absolute p-[1vh] right-0 max-w-[362px] max-h-[148px] w-full h-full">
            <Image
                src="/images/LogoDarkModePicture.png"
                alt="Ponse"
                width={362}
                height={148}
            ></Image>
        </div>
    );
}

export default memo(Logo);