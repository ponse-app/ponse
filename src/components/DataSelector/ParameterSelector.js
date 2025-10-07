"use client";

const Map = ({inputName}) => {


    return (
        <div className="bg-gray-500 w-fit m-5">
            {/* <label htmlFor={inputName}>Anna parametri: </label> */}
            <select className="bg-gray-700" id="input1">
                <option value="">--Valitse parametri--</option>
                <option value="1">Data1</option>
                <option value="2">Data2</option>
                <option value="3">Data3</option>
            </select>
        </div>
    )
};

export default Map;
