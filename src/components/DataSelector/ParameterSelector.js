"use client";

const ParameterSelector = ({ inputName, setParameter }) => {
    return (
        <div className="bg-gray-500 w-fit m-5">
            <select
                onChange={(event) => setParameter(event.target.value)}
                className="bg-gray-700"
                id="input1"
            >
                <option value="miehet">Miesten määrä</option>
                <option value="naiset">Naisten määrä</option>
                <option value="ika_65_p">ika_65_p</option>
                <option value="ika_13_17">ika_13_17</option>
                <option value="ika_13_17_p">ika_13_17_p</option>
                <option value="ika_18_24">ika_18_24</option>
                <option value="ika_13_24">ika_13_24</option>
                <option value="vaesto">Väkimäärä</option>
                <option value="ra_ke">Kesämökit yhteensä *</option>
                <option value="pt_opisk">Päätoimiset opiskelijat yhteensä *</option>
                <option value="hr_mtu">Mediaanipalkka</option>
            </select>
        </div>
    );
};

export default ParameterSelector;
