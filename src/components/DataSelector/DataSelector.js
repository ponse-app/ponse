"use client";
import ParameterSelector from "./ParameterSelector";

const Map = ({ setParameter }) => {
    /**
     * <label htmlFor="input1">Anna parametri: </label>
                        <input type="text" className="bg-gray-700" id="input1" />
     */

    return (
        <div className="w-full flex flex-col items-center row-start-1 row-span-1 col-start-2 col-span-2">
            <form action={""} method="post" className="z-10">
                <div className="bg-gray-500 w-fit p-1 mt-5">
                    <fieldset>
                        <legend>Valitse parametrit:</legend>
                        <ParameterSelector
                            setParameter={setParameter}
                            inputName={"parameter1"}
                        />
                        {/* <ParameterSelector inputName={"parameter2"} />
                        <ParameterSelector inputName={"parameter3"} />
                        <ParameterSelector inputName={"parameter4"} /> */}
                    </fieldset>
                </div>
            </form>
        </div>
    );
};

export default Map;
