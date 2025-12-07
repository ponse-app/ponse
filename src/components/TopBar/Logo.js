import { memo } from "react";
import Image from "next/image";
import styles from "./theme-image.module.css";

function Logo() {
    return (
        <div className="absolute p-[1vh] right-0 max-w-[362px] max-h-[148px] w-full h-full flex justify-end">
            <Image
                src="/images/LogoDarkModePicture.png"
                alt="Ponse"
                width={227}
                height={90}
                className={styles.imgDark}
            ></Image>
            <Image
                src="/images/LogoLightModePicture.png"
                alt="Ponse"
                width={239}
                height={95}
                className={styles.imgLight}
            ></Image>
        </div>
    );
}

export default memo(Logo);