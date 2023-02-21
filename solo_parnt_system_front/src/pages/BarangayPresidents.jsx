import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {
    Input, Options,
} from "../components/FormInputs";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useAthenticationContext } from "../components/Authentication";

const DEFAULT_PRES_DATA = {
    name: "",
    barangay: "Bagong Kalsada",
    contact_number: "",
}

const BARANGAYS = [
    "Bagong Kalsada",
    "Banlic",
    "Bañadero",
    "Barandal",
    "Barangay I",
    "Barangay II",
    "Barangay III",
    "Barangay IV",
    "Barangay V",
    "Barangay VI",
    "Barangay VII",
    "Batino",
    "Bubuyan",
    "Bucal",
    "Bunggo",
    "Burol",
    "Camaligan",
    "Canlubang",
    "Halang",
    "Hornalan",
    "Kay-Anlog",
    "Laguerte",
    "La Mesa",
    "Lawa",
    "Lecheria",
    "Linga",
    "Looc",
    "Mabato",
    "Makiling",
    "Majada Out",
    "Mapagong",
    "Masili",
    "Maunong",
    "Mayapa",
    "Milagros",
    "Paciano Rizal",
    "Palingon",
    "Palo-Alto",
    "Pansol",
    "Parian",
    "Prinza",
    "Punta",
    "Puting Lupa",
    "Real",
    "Saimsim",
    "Sampiruhan",
    "San Cristobal",
    "San Jose",
    "San Juan",
    "Sirang Lupa",
    "Sucol",
    "Turbina",
    "Ulango",
    "Uwisan",
]

const PresForm = ({ id, onRemove }) => {
    const [pres, setPres] = useState({ ...DEFAULT_PRES_DATA });
    const [disabled, setDisabled] = useState(true);
    const [errors, setErrors] = useState({});

    const {
        user,
    } = useAthenticationContext();

    useEffect(() => {
        __load_pres__();
    }, []);

    const __load_pres__ = () => {
        axios.get(`http://localhost:8000/api/brngpres/${id}/`).then((resp) => {
            setPres({ ...resp.data });
        }).catch((err) => {

        });
    }

    const __on_change__ = (e) => {
        let { name, value } = e.target;

        const newPres = { ...pres };
        newPres[name] = value;
        setPres(newPres);
    }

    const __update__ = () => {
        axios.put(`http://localhost:8000/api/brngpres/${id}/`, { ...pres }).then((resp) => {
            setPres({ ...resp.data });
            setDisabled(true);
        }).catch((err) => {
            if (err.response)
                setErrors(err.response.data);
        });
    }

    const __delete__ = () => {
        axios.delete(`http://localhost:8000/api/brngpres/${id}/`).then((resp) => {
            if (onRemove)
                onRemove(id);
        }).catch((err) => { });
    }

    return (
        <div className="p-3 rounded relative border-2 border-blue-500 shadow-md">
            <div className={disabled ? "opacity-70 pointer-events-none" : ""}>
                <Input
                    label={"Name"}
                    name="name"
                    value={pres.name}
                    onChange={__on_change__}
                    error={errors.name && errors.name[0]}
                />
                <div className="flex">
                    <Input
                        label={"Barangay"}
                        value={pres.barangay}
                        onChange={__on_change__}
                        disabled
                    />
                    <Input
                        label={"Contact Number"}
                        type={"number"}
                        name="contact_number"
                        value={pres.contact_number}
                        onChange={__on_change__}
                        error={errors.contact_number && errors.contact_number[0]}
                    />
                </div>
            </div>
            {user.is_admin && (
                <div className="absolute top-2 right-2">
                    <button className={`
                    outline-blue-500 px-1
                    ${disabled ? "" : "outline"}
                `}
                        onClick={() => setDisabled(!disabled)}
                    >
                        <FontAwesomeIcon
                            icon={faEdit}
                        />
                    </button>
                </div>
            )}
            {!disabled && (
                <div className="px-2 mt-1 flex items-stretch space-x-3">
                    <button className="bg-green-400 py-3 px-2 w-full rounded-md hover:bg-green-500"
                        onClick={__update__}
                    >
                        Update
                    </button>
                </div>
            )}
        </div>
    )
}

const BarangayPresidents = () => {

    const [brngPresData, setBrngPresData] = useState({ ...DEFAULT_PRES_DATA });
    const [errors, setErrors] = useState({});
    const [presidents, setPresidents] = useState([]);

    const [barangaysSelections, setBarangaysSelections] = useState([...BARANGAYS]);

    const {
        user,
    } = useAthenticationContext();

    useEffect(() => {
        setBrngPresData({
            ...DEFAULT_PRES_DATA,
            barangay: barangaysSelections[0],
        });
    }, [presidents]);

    useEffect(() => {
        __load_brngpress__();
    }, []);

    useEffect(() => {
        if (presidents.length === 0) return;

        let regBarangays = presidents.map((pres) => pres.barangay);

        let brnga = new Set([...BARANGAYS]);
        let brngb = new Set([...regBarangays]);

        let brngaminb = [...new Set([...brnga].filter(x => !brngb.has(x)))];

        setBarangaysSelections([...brngaminb]);

        setBrngPresData({
            ...DEFAULT_PRES_DATA,
            barangay: brngaminb[0],
        });
    }, [presidents]);

    const __load_brngpress__ = () => {
        axios.get('http://localhost:8000/api/brngpres/', brngPresData).then((resp) => {
            setPresidents([...resp.data]);
        }).catch((err) => {

        });
    }

    const __on_change__ = (e) => {
        let { name, value } = e.target;

        const newBrngPresData = { ...brngPresData };
        newBrngPresData[name] = value;
        setBrngPresData(newBrngPresData);
    }

    const __save__ = () => {
        axios.post('http://localhost:8000/api/brngpres/', brngPresData).then((resp) => {
            __load_brngpress__();
        }).catch((err) => {
            console.log(err)
            if (err.response)
                setErrors(err.response.data);
        });
    }

    return (
        <div className="container mx-3 flex justify-center">
            <div className="flex flex-col bg-blue-100 p-3 rounded-lg my-4 shadow">
                <h1 className="my-3 text-3xl font-extrabold">Barangay Presidents'</h1>
                <div className={`
                    mt-3 p-3 border border-gray-400
                    ${(barangaysSelections.length === 0 || !user.is_admin) ? "opacity-50 pointer-events-none" : ""}
                `}>
                    <div className="p-3 rounded flex flex-col items-stretch">
                        <div className="flex-1">
                            <Input
                                label={"Name"}
                                name="name"
                                value={brngPresData.name}
                                onChange={__on_change__}
                                error={errors.name && errors.name[0]}
                            />
                        </div>
                        <div className="flex flex-1">
                            <Options
                                label={"Barangay"}
                                options={barangaysSelections.map((brng) => (
                                    { value: brng }
                                ))}
                                name="barangay"
                                value={brngPresData.barangay}
                                onChange={__on_change__}
                            />
                            <Input
                                label={"Contact Number"}
                                type={"number"}
                                name="contact_number"
                                value={brngPresData.contact_number}
                                onChange={__on_change__}
                                error={errors.contact_number && errors.contact_number[0]}
                            />
                        </div>
                    </div>
                    <button
                        className="w-full bg-green-400 p-2 rounded-md hover:bg-green-500"
                        onClick={__save__}
                    >
                        Save
                    </button>
                </div>
                <div className="mt-4">

                    <div className="grid grid-cols-2 gap-y-5 gap-x-3">
                        {presidents.map((pres) => (
                            <PresForm
                                key={pres.id}
                                id={pres.id}
                                onRemove={__load_brngpress__}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BarangayPresidents;