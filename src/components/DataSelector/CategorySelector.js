"use client";

const CategorySelector = ({ inputName, setParameter, parameters }) => {
    console.log('here:', parameters)
    return (
        <div className="bg-gray-500 w-fit m-5">
            <select
                onChange={(event) => setParameter(event.target.value)}
                className="bg-gray-700 w-[100%]"
                id="input1">

                {parameters?.map(([dataName, showName]) => <option value={dataName}>{showName}</option> )}
            </select>
        </div>
    );
};

export default ParameterSelector;
