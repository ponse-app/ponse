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
                <option value="ika_65_p">ika_65_p</option>
                <option value="vakimaara">Väkimäärä</option>
                <option value="ra_ke">Kesämökit yhteensä *</option>
                <option value="pt_opisk">Päätoimiset opiskelijat yhteensä *</option>
            </select>
        </div>
    );
};

export default Map;
