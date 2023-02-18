import { useRef } from "react";

export const Input = ({ error, label, disabled, ...props }) => {

    return (
        <div className={`
            mb-4 md:mr-2 md:mb-0 max-w-lg
            ${ disabled ? "opacity-50 pointer-events-none" : "" }
        `}>
            <label className="block mb-1 text-lg font-bold text-gray-700">
                {label}
            </label>
            <input
                className={`w-full px-3 py-2 mb-1 text-lg leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none outline-2
                    ${error ? "border-red-500 focus:outline-red-400" : "focus:outline-blue-400"}
                `}
                {...props}
            />
            {error ? (
                <p className="text-xs italic text-red-500">{ error }</p>
            ) : (
                null
            )}
        </div>
    )
}

export const TextArea = ({ error, label, ...props }) => {

    return (
        <div className="mb-4 md:mr-2 md:mb-0 w-full max-w-lg min-h-[112px]">
            <label className="block mb-1 text-lg font-bold text-gray-700">
                {label}
            </label>
            <textarea
                className={`w-full h-full max-h-52 px-3 py-2 mb-1 text-lg leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none outline-2
                    ${error ? "border-red-500 focus:outline-red-400" : "focus:outline-blue-400"}
                `}
                {...props}
            />
            {error ? (
                <p className="text-xs italic text-red-500">{ error }</p>
            ) : (
                null
            )}
        </div>
    );
}

export const Options = ({ label, options, ...props }) => {

    return (
        <div className="mb-4 md:mr-2 md:mb-0">
            <label className="block mb-1 text-lg font-bold text-gray-700">
                { label }
            </label>
            <div className="flex justify-center">
                <div className="mb-3 xl:w-96">
                    <select className="form-select
      block
      w-full
      px-3
      py-2

      text-lg
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      shadow
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
        { ...props }
      >
                        { options && options.map((opt) => (
                            <option value={opt.value} key={opt.value}>{ opt.label || opt.value }</option>
                        )) }
                    </select>
                </div>
            </div>
        </div>
    );
}

export const CheckBox = ({ label, checked, ...props }) => {

    const checkBoxInpRef = useRef(null);

    return (
        <div className="form-check text-lg">
            <div className="flex items-center">
                <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    ref={checkBoxInpRef}
                    type="checkbox"
                    checked={checked === undefined ? false : checked}
                    {...props}
                />
                <label className="form-check-label inline-block text-gray-800 cursor-pointer"
                    onClick={() => checkBoxInpRef.current.click()}
                >
                    {label}
                </label>
            </div>
        </div>
    );
}

export const Switch = ({ checked, ...props }) => {

    const switchInpRef = useRef(null);

    const handleClick = () => {
        switchInpRef.current.click();
    }

    return (
        <div className={`
            h-6 w-12 rounded-full flex items-center justify-center p-1 border transition-colors delay-300 cursor-pointer
            ${checked ? "border-green-500 bg-green-400" : "border-red-500 bg-red-400"}
        `}
            onClick={handleClick}
        >
            <input type={"checkbox"} ref={switchInpRef} checked={checked} hidden
                { ...props }
            />
            <div className={`
                w-full rounded-full h-4 relative transition-colors delay-300
                ${checked ? "bg-green-500" : "bg-red-500"}
            `}>
                <div className={`
                    w-5 h-5 rounded-full bg-white absolute top-1/2 -translate-y-1/2 transition-all ease-in-out delay-200
                    ${checked ? "translate-x-full" : "translate-x-0"}
                `} />
            </div>
        </div>
    );
}


export const InputValidator = ({e, filter, errors, setErrors, onChange}) => {
    const defaultErrMessage = "Invalid input.";

    let [filtRes, message] = filter(e);
    let name = e.target.name;

    message = message || defaultErrMessage;

    let newErrors = {...errors};
    if(!filtRes){
        
        if(!newErrors[name])
            newErrors[name] = [message];

        setErrors(newErrors);
    }
    else{
        if(newErrors[name] && newErrors[name] !== message)
            delete newErrors[name];
        console.log(newErrors)
        setErrors(newErrors);
    }

    onChange(e);
}