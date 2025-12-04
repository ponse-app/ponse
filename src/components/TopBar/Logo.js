import { memo } from "react";

function Logo() {

    return (
        <div className="absolute p-[3vh] right-0 lg:right-[65vw]">
            <h1>Ponse</h1>
        </div>
    );

}

export default memo(Logo);