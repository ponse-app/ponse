"use client";
import ParameterSelector from "./ParameterSelector";

const Map = () => {
    /**
     * <label htmlFor="input1">Anna parametri: </label>
                        <input type="text" className="bg-gray-700" id="input1" />
     */

    return (
        <div
            className="absolute w-full h-full flex flex-col items-center">
            <form action={""} method="post">
                <div className="bg-gray-500 w-fit p-1">
                <fieldset>
                    <legend>Valitse parametrit:</legend>
                        <ParameterSelector inputName={"parameter1"} />
                        {/* <ParameterSelector inputName={"parameter2"} />
                        <ParameterSelector inputName={"parameter3"} />
                        <ParameterSelector inputName={"parameter4"} /> */}
                </fieldset>
                </div>
            </form>
        </div>
    )
};

export default Map;
