"use client";

const Map = ({ inputName, setParameter }) => {
    return (
        <div className="bg-gray-500 w-fit m-5">
            {/* <label htmlFor={inputName}>Anna parametri: </label> */}
            <select
                onChange={(event) => setParameter(event.target.value)}
                className="bg-gray-700"
                id="input1"
            >
                <option value="miehet">Miesten määrä</option>
                <option value="naiset">Naisten määrä</option>
                <option value="3">Data3</option>
            </select>
        </div>
    );
};

export default Map;
