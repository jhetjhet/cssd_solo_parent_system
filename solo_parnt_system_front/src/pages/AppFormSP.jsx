import {
    Input,
    TextArea,
    Options,
    CheckBox,
    InputValidator
} from "../components/FormInputs";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { useAthenticationContext } from "../components/Authentication";


const PERSONAL_INFO = {
    "first_name": "",
    "mid_name": "",
    "last_name": "",
    "birth_date": "",
    "birth_place": "",
    "civil_status": "Unwed",
    "civil_status_others": "",
    "complete_present_address": "",
    "barangay": "Bagong Kalsada",
    "age": "",
    "contact_number": "",
    "gender": "Male",
    "highest_educ_attain": "",
    "occup_emp": "",
    "occup_address": "",
    "monthly_income": "",
    "status_of_emp": "Regular",
    "other_incom_src": "",
    "current_org_pos": "Member",
    "pos_if_offcr": "",
    "classification": "",
    "needs_of_solor_parent": "",
}

const FAMILY_COMP_DATA = {
    "first_name": "",
    "mid_name": "",
    "last_name": "",
    "birth_date": "",
    "relationship": "",
    "age": "",
    "status": "",
    "educ_attainment": "",
    "school_name": "",
    "occupation": "",
}

const PROGRAM_SERVICE_AVAILED = {
    "ppp_benf": false,
    "slp_benf": false,
    "other_benf": "",
    "prnt_leader": false,
    "slp_officer": false,
    "skills": ""
}

const HEALTH_CARD = {
    "blue_card": false,
    "phil_health": false,
    "hmo": false,
    "phil_health_masa_num": "",
    "indiv_player": false,
    "family_benf": false
}

const TENURIAL_STATUS = {
    "owned": false,
    "sharer": false,
    "priv_prop": false,
    "rent": false,
    "gov_prop": false,
    "riv_side": false,
    "pnr_site": false,
    "rent_per_month": ""
}

export async function loader({ params }) {
    let prntId = params.parentID;
    let formData;

    if (prntId) {
        const resp = axios.get(`http://localhost:8000/api/parents/${prntId}/`);
        try {
            formData = await resp;
            formData = formData.data;
        } catch (error) {
            throw new Response("", {
                status: 404,
                statusText: "Not Found",
            });
        }
    }

    return { formData }
}

const FamilyCompositionForm = ({ id, data, remove, onChange, errors = {} }) => {

    const __on_change__ = (e) => {
        const { name, value } = e.target;

        const newData = { ...data };
        newData[name] = value;

        onChange(id, newData);

    }

    return (
        data &&
        <div className="p-2 rounded border relative border-blue-500 bg-blue-200">
            <div className="absolute top-1 right-1">
                <button className="w-8 h-8 rounded-full bg-red-400 hover:bg-red-300 focus:outline focus:outline-red-500"
                    onClick={() => remove(id)}
                >
                    X
                </button>
            </div>
            <div className="flex">
                <Input
                    label={"First Name"}
                    value={data.first_name}
                    name="first_name"
                    onChange={__on_change__}
                    error={errors.first_name && errors.first_name[0]}
                />
                <Input
                    label={"Middle Name"}
                    value={data.mid_name}
                    name="mid_name"
                    onChange={__on_change__}
                    error={errors.mid_name && errors.mid_name[0]}
                />
                <Input
                    label={"Last Name"}
                    value={data.last_name}
                    name="last_name"
                    onChange={__on_change__}
                    error={errors.last_name && errors.last_name[0]}
                />
            </div>
            <div className="flex">
                <Input
                    label={"Relationship"}
                    value={data.relationship}
                    name="relationship"
                    onChange={__on_change__}
                    error={errors.relationship && errors.relationship[0]}
                />
                <Input
                    label={"Birth Date"}
                    type={"date"}
                    value={data.birth_date}
                    name="birth_date"
                    onChange={__on_change__}
                    error={errors.birth_date && errors.birth_date[0]}
                />
                <Input
                    label={"Age"}
                    type={"number"}
                    value={data.age}
                    name="age"
                    onChange={__on_change__}
                    error={errors.age && errors.age[0]}
                />
            </div>

            <div className="flex items-stretch">
                <div className="flex-1">
                    <Input
                        label={"Status"}
                        value={data.status}
                        name="status"
                        onChange={__on_change__}
                        error={errors.status && errors.status[0]}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label={"Educational Attainment"}
                        value={data.educ_attainment}
                        name="educ_attainment"
                        onChange={__on_change__}
                        error={errors.educ_attainment && errors.educ_attainment[0]}
                    />
                </div>
            </div>

            <div>
                <TextArea
                    label={"Name of School"}
                    value={data.school_name}
                    name="school_name"
                    onChange={__on_change__}
                    error={errors.school_name && errors.school_name[0]}
                />
            </div>

            <div>
                <Input
                    label={"Occupation"}
                    value={data.occupation}
                    name="occupation"
                    onChange={__on_change__}
                    error={errors.occupation && errors.occupation[0]}
                />
            </div>
        </div>
    );
}

const FamilyCompositionForms = ({ famComps = [], setFamComps, famCompsErrors }) => {

    const __on_change__ = (id, formData) => {
        const newFamComps = famComps.map((data) => {

            if (data.id === id)
                return { ...formData };
            return data;
        });

        setFamComps(newFamComps);
    }

    const __add__ = () => {
        if (famComps.length >= 9) return;

        const newFamComps = {
            id: uuidv4(),
            ...FAMILY_COMP_DATA,
        }
        setFamComps([newFamComps, ...famComps]);
    }

    const __remove__ = (id) => {
        const newFamComps = famComps.filter((data) => data.id !== id);
        setFamComps(newFamComps);
    }

    const __clear__ = () => {
        setFamComps([]);
    }

    return (
        <div className="my-3 p-3 rounded border-2 border-black h-[564px] bg-blue-400 overflow-hidden">
            <div className="flex my-3">
                <div className="text-lg text-white font-semibold ml-3">
                    {famComps.length} / 9
                </div>
                <div className="ml-auto space-x-3">
                    <button className="w-16 h-8 rounded-md bg-red-400 hover:bg-red-300 focus:outline focus:outline-red-500"
                        onClick={__clear__}
                    >
                        clear
                    </button>
                    <button className="w-16 h-8 rounded-md bg-green-400 hover:bg-green-300 focus:outline focus:outline-green-500"
                        onClick={__add__}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto h-[464px] p-3 space-y-3">
                {famComps.map((data, i) => (
                    <FamilyCompositionForm
                        key={data.id}
                        id={data.id}
                        data={data}
                        remove={__remove__}
                        onChange={__on_change__}
                        errors={famCompsErrors[i]}
                    />
                ))}
            </div>
        </div>
    );
}

const AppFormSP = () => {

    const [personalInfo, setPersonalInfo] = useState({ ...PERSONAL_INFO });
    const [famComps, setFamComps] = useState([
        { id: uuidv4(), ...FAMILY_COMP_DATA },
    ]);
    const [progSrvcAvailed, setProgSrvcAvailed] = useState({ ...PROGRAM_SERVICE_AVAILED });
    const [healthCard, setHealthCard] = useState({ ...HEALTH_CARD });
    const [tenurialStatus, setTenurialStatus] = useState({ ...TENURIAL_STATUS });

    const [personalInfoErrors, setPersonalInfoErrors] = useState({});
    const [famCompsErrors, setFamCompsErrors] = useState([]);
    const [progSrvcAvailedErrors, setProgSrvcAvailedErrors] = useState({});
    const [healthCardErrors, setHealthCardErrors] = useState({});
    const [tenurialStatusErrors, setTenurialStatusErrors] = useState({});

    const [parentID, setParentID] = useState();

    const { formData } = useLoaderData();

    const urlParams = useParams();

    const {
        user,
    } = useAthenticationContext();

    useEffect(() => {

        if (formData) {
            setParentID(formData.id);
            __load_formdata__({ ...formData });
        }

    }, [urlParams]);

    const __on_personal_info_change__ = (e) => {
        const { name, value } = e.target;

        const newPersonalInfo = { ...personalInfo };
        newPersonalInfo[name] = value;
        setPersonalInfo(newPersonalInfo);
    }

    const __on_prog_srvc_avail_change__ = (e) => {
        let { name, value, type } = e.target;

        if (type === 'checkbox')
            value = e.target.checked;

        const newProgSrvcAvailed = { ...progSrvcAvailed };
        newProgSrvcAvailed[name] = value;
        setProgSrvcAvailed(newProgSrvcAvailed);
    }

    const __on_health_card_change__ = (e) => {
        let { name, value, type } = e.target;

        if (type === 'checkbox')
            value = e.target.checked;

        const newHealthCard = { ...healthCard };
        newHealthCard[name] = value;
        setHealthCard(newHealthCard);
    }

    const __on_tenurial_status_change__ = (e) => {
        let { name, value, type } = e.target;

        if (type === 'checkbox')
            value = e.target.checked;

        const newTenurialStatus = { ...tenurialStatus };
        newTenurialStatus[name] = value;
        setTenurialStatus(newTenurialStatus);
    }

    const __load_formdata__ = (data) => {

        setFamComps([...data.family_composition]);
        delete data.family_composition;

        setProgSrvcAvailed({ ...data.progs_srvcs_availed });
        delete data.progs_srvcs_availed;

        setHealthCard({ ...data.health_cards });
        delete data.health_cards;

        setTenurialStatus({ ...data.tenurial_status });
        delete data.tenurialStatus;

        setPersonalInfo({ ...data });
    }

    const __on_save__ = () => {

        let personalInfoData = {...personalInfo};
        if(personalInfoData.civil_status === "Others")
            personalInfoData.civil_status = personalInfoData.civil_status_others;

        const DATA = {
            ...personalInfoData,
            family_composition: [...famComps],
            progs_srvcs_availed: { ...progSrvcAvailed },
            health_cards: { ...healthCard },
            tenurial_status: { ...tenurialStatus },
        }

        let action;

        if (parentID)
            action = axios.put(`http://localhost:8000/api/parents/${parentID}/`, DATA);
        else
            action = axios.post('http://localhost:8000/api/parents/', DATA);

        action.then((resp) => {
            
            if(!parentID){
                setPersonalInfo({...PERSONAL_INFO});
                setFamComps([
                    { id: uuidv4(), ...FAMILY_COMP_DATA },
                ]);
                setProgSrvcAvailed({...PROGRAM_SERVICE_AVAILED});
                setHealthCard({...HEALTH_CARD});
                setTenurialStatus({...TENURIAL_STATUS});
            }else
                __load_formdata__({...resp.data});

            window.alert("Save successfully.");
        }).catch((err) => {
            if (err.response) {
                let errResp = err.response.data;
                console.log(errResp.family_composition);
                if (errResp.family_composition) {
                    setFamCompsErrors([...errResp.family_composition]);
                    delete errResp.family_composition;
                }
                if (errResp.progs_srvcs_availed) {
                    setProgSrvcAvailedErrors({ ...errResp.progs_srvcs_availed });
                    delete errResp.progs_srvcs_availed;
                }
                if (errResp.health_cards) {
                    setHealthCardErrors({ ...errResp.health_cards });
                    delete errResp.health_cards;
                }
                if (errResp.tenurial_status) {
                    setTenurialStatusErrors({ ...errResp.tenurial_status });
                    delete errResp.tenurial_status;
                }
                if (errResp)
                    setPersonalInfoErrors({ ...errResp });
            }
            window.alert("Error occur while saving data...");
        });
    }

    const __renew__ = () => {
        axios.post(`http://localhost:8000/api/parents/${parentID}/renew/`).then((resp) => {
            __load_formdata__(resp.data);
        }).catch((err) => {

        });
    }

    return (
        <div className={`
            container mx-3 flex justify-center relative
            ${user.is_admin ? "" : "opacity-50 pointer-events-none"}
        `}>

            {parentID && (
                <div className="fixed top-5 right-5 overflow-hidden rounded-lg text-white z-50">
                    <button className="bg-blue-500 py-3 px-2 flex items-center hover:bg-blue-600 focus:bg-blue-500 focus:outline-4 focus:outline-blue-700"
                        onClick={__renew__}
                    >
                        <span className={`
                            block
                            ${personalInfo.active ? "" : "text-red-500"}
                        `}>{personalInfo.expiration_date}</span>
                        <span className="block ml-3 bg-green-500 p-1">RENEW</span>
                    </button>
                </div>
            )}

            <div className="flex flex-col bg-blue-100 p-3 rounded-lg my-4 shadow">
                <h1 className="my-3 text-3xl font-extrabold">Application Form for Solo Parent</h1>
                <div className="flex justify-evenly mt-3">
                    <Input
                        label={"First Name"}
                        value={personalInfo.first_name}
                        name={"first_name"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.first_name && personalInfoErrors.first_name[0]}
                    />
                    <Input
                        label={"Middle Name"}
                        value={personalInfo.mid_name}
                        name={"mid_name"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.mid_name && personalInfoErrors.mid_name[0]}
                    />
                    <Input
                        label={"Last Name"}
                        value={personalInfo.last_name}
                        name={"last_name"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.last_name && personalInfoErrors.last_name[0]}
                    />
                </div>
                <div className="flex justify-evenly">
                    <Input
                        label={"Birth Date"}
                        type={"Date"}
                        value={personalInfo.birth_date}
                        name={"birth_date"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.birth_date && personalInfoErrors.birth_date[0]}
                    />
                    <Input
                        label={"Birth Place"}
                        type={"text"}
                        value={personalInfo.birth_place}
                        name={"birth_place"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.birth_place && personalInfoErrors.birth_place[0]}
                    />
                    <Input
                        label={"Age"}
                        type={"Number"}
                        value={personalInfo.age}
                        name={"age"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.age && personalInfoErrors.age[0]}
                    />
                    <div className="max-w-[14rem]">
                        <Options
                            label={"Gender"}
                            options={[
                                { value: "M", label: "Male" },
                                { value: "F", label: "Female" },
                            ]}
                            value={personalInfo.gender}
                            name={"gender"}
                            onChange={__on_personal_info_change__}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-evenly">
                    <Options
                        label={"Barangay"}
                        options={[
                            { value: "Bagong Kalsada" },
                            { value: "Banlic" },
                            { value: "Bañadero" },
                            { value: "Barandal" },
                            { value: "Batino" },
                            { value: "Bubuyan" },
                            { value: "Bucal" },
                            { value: "Bunggo" },
                            { value: "Burol" },
                            { value: "Camaligan" },
                            { value: "Canlubang" },
                            { value: "Halang" },
                            { value: "Hornalan" },
                            { value: "Kay-Anlog" },
                            { value: "Laguerte" },
                            { value: "La Mesa" },
                            { value: "Lawa" },
                            { value: "Lecheria" },
                            { value: "Linga" },
                            { value: "Looc" },
                            { value: "Mabato" },
                            { value: "Makiling" },
                            { value: "Majada Out" },
                            { value: "Mapagong" },
                            { value: "Masili" },
                            { value: "Maunong" },
                            { value: "Mayapa" },
                            { value: "Milagros" },
                            { value: "Paciano Rizal" },
                            { value: "Palingon" },
                            { value: "Palo-Alto" },
                            { value: "Pansol" },
                            { value: "Parian" },
                            { value: "Prinza" },
                            { value: "Punta" },
                            { value: "Puting Lupa" },
                            { value: "Real" },
                            { value: "Saimsim" },
                            { value: "Sampiruhan" },
                            { value: "San Cristobal" },
                            { value: "San Jose" },
                            { value: "San Juan" },
                            { value: "Sirang Lupa" },
                            { value: "Sucol" },
                            { value: "Turbina" },
                            { value: "Ulango" },
                            { value: "Uwisan" },
                            { value: "Barangay I" },
                            { value: "Barangay II" },
                            { value: "Barangay III" },
                            { value: "Barangay IV" },
                            { value: "Barangay V" },
                            { value: "Barangay VI" },
                            { value: "Barangay VII" },
                        ]}
                        value={personalInfo.barangay}
                        name={"barangay"}
                        onChange={__on_personal_info_change__}
                    />
                    <div className="max-w-[16rem]">
                        <Options
                            label={"Civil Status"}
                            options={[
                                { value: "Unwed" },
                                { value: "Separated" },
                                { value: "Widow" },
                                { value: "Annulled" },
                                { value: "Guardian" },
                                { value: "Others" },
                            ]}
                            value={personalInfo.civil_status}
                            name={"civil_status"}
                            onChange={__on_personal_info_change__}
                        />
                    </div>
                    <div className="">
                        <Input
                            label={"others..."}
                            disabled={personalInfo.civil_status !== "Others"}
                            value={personalInfo.civil_status_others}
                            name={"civil_status_others"}
                            onChange={__on_personal_info_change__}
                            error={personalInfoErrors.civil_status && personalInfoErrors.civil_status[0]}
                        />
                    </div>
                </div>

                <div>
                    <Input
                        label={"Contact #."}
                        value={personalInfo.contact_number}
                        name={"contact_number"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.contact_number && personalInfoErrors.contact_number[0]}
                    />
                    <Input
                        label={"Highest Education Attainment"}
                        value={personalInfo.highest_educ_attain}
                        name={"highest_educ_attain"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.highest_educ_attain && personalInfoErrors.highest_educ_attain[0]}
                    />
                    <TextArea
                        label={"Home Address"}
                        value={personalInfo.complete_present_address}
                        name={"complete_present_address"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.complete_present_address && personalInfoErrors.complete_present_address[0]}
                    />
                    <Input
                        label={"Occupation"}
                        value={personalInfo.occup_emp}
                        name={"occup_emp"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.occup_emp && personalInfoErrors.occup_emp[0]}
                    />
                    <TextArea
                        label={"Occupation Address"}
                        value={personalInfo.occup_address}
                        name={"occup_address"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.occup_address && personalInfoErrors.occup_address[0]}
                    />
                    <div className="flex justify-evenly">
                        <div className="flex-1">
                            <Input
                                label={"Monthly Income"}
                                type={"number"}
                                value={personalInfo.monthly_income}
                                name={"monthly_income"}
                                onChange={__on_personal_info_change__}
                                error={personalInfoErrors.monthly_income && personalInfoErrors.monthly_income[0]}
                            />
                        </div>
                        <div className="flex-1">
                            <Options
                                label={"Status of Employment"}
                                options={[
                                    { value: "Regular", label: "Regular" },
                                    { value: "Contractual", label: "Contractual" },
                                    { value: "Self-Employed", label: "Self-Employed" },
                                ]}
                                value={personalInfo.status_of_emp}
                                name={"status_of_emp"}
                                onChange={__on_personal_info_change__}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Input
                        label={"Other Source of Income"}
                        value={personalInfo.other_incom_src}
                        name={"other_incom_src"}
                        onChange={__on_personal_info_change__}
                        error={personalInfoErrors.other_incom_src && personalInfoErrors.other_incom_src[0]}
                    />
                </div>

                <div className="flex items-stretch">
                    <div className="flex-1">
                        <Options
                            label={"Current Postion In The Organization"}
                            options={[
                                { value: "Member" },
                                { value: "Officer" },
                            ]}
                            value={personalInfo.current_org_pos}
                            name={"current_org_pos"}
                            onChange={__on_personal_info_change__}
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            label={"Position if Officer"}
                            disabled={personalInfo.current_org_pos !== "Officer"}
                            value={personalInfo.pos_if_offcr}
                            name={"pos_if_offcr"}
                            onChange={__on_personal_info_change__}
                            error={personalInfoErrors.pos_if_offcr && personalInfoErrors.pos_if_offcr[0]}
                        />
                    </div>
                </div>

                <div className="w-full border-t-2 border-black my-3" />

                <div>
                    <h1 className="text-2xl font-semibold">I. Family Composition</h1>
                    <div className="">
                        <FamilyCompositionForms
                            famComps={famComps}
                            setFamComps={setFamComps}
                            famCompsErrors={famCompsErrors}
                        />
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-semibold">II. Classification/Circumstances of being a Solo Parent</h1>
                    <div className="">
                        <TextArea
                            value={personalInfo.classification}
                            name={"classification"}
                            onChange={__on_personal_info_change__}
                            error={personalInfoErrors.classification && personalInfoErrors.classification[0]}
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">III. Needs of Solo Parent</h1>
                    <div className="">
                        <TextArea
                            value={personalInfo.needs_of_solor_parent}
                            name={"needs_of_solor_parent"}
                            onChange={__on_personal_info_change__}
                            error={personalInfoErrors.needs_of_solor_parent && personalInfoErrors.needs_of_solor_parent[0]}
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">IV. Programs and Services Availed</h1>
                    <div className="flex items-stretch">
                        <div className="flex-1">
                            <CheckBox
                                label={"Pantawid Pilipino Program Beneficiary"}
                                checked={progSrvcAvailed.ppp_benf}
                                name={"ppp_benf"}
                                onChange={__on_prog_srvc_avail_change__}
                            />
                            <CheckBox
                                label={"Sustainable Livelihood Program Beneficiary"}
                                checked={progSrvcAvailed.slp_benf}
                                name={"slp_benf"}
                                onChange={__on_prog_srvc_avail_change__}
                            />
                        </div>
                        <div className="flex-1">
                            <CheckBox
                                label={"Parent Leader"}
                                checked={progSrvcAvailed.prnt_leader}
                                name={"prnt_leader"}
                                onChange={__on_prog_srvc_avail_change__}
                            />
                            <CheckBox
                                label={"SLP Officer"}
                                checked={progSrvcAvailed.slp_officer}
                                name={"slp_officer"}
                                onChange={__on_prog_srvc_avail_change__}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="flex-1 px-3">
                            <Input
                                label={"Beneficiary of other Programs"}
                                value={progSrvcAvailed.other_benf}
                                name={"other_benf"}
                                onChange={__on_prog_srvc_avail_change__}
                            />
                            <Input
                                label={"Skills"}
                                value={progSrvcAvailed.skills}
                                name={"skills"}
                                onChange={__on_prog_srvc_avail_change__}
                            // error={}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-semibold">V. Health Card Membership</h1>
                    <div className="flex">
                        <div className="flex-1">
                            <CheckBox
                                label={"Blue Card"}
                                checked={healthCard.blue_card}
                                name={"blue_card"}
                                onChange={__on_health_card_change__}
                            />
                            <CheckBox
                                label={"Philhealth"}
                                checked={healthCard.phil_health}
                                name={"phil_health"}
                                onChange={__on_health_card_change__}
                            />
                        </div>
                        <div className="flex-1">
                            <CheckBox
                                label={"Private/HMO"}
                                checked={healthCard.priv_prop}
                                name={"priv_prop"}
                                onChange={__on_health_card_change__}
                            />
                            <CheckBox
                                label={"Individual Player"}
                                checked={healthCard.indiv_player}
                                name={"indiv_player"}
                                onChange={__on_health_card_change__}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3 items-center">
                        <Input
                            label={"Philhealth ng Masa # (leave blank if none)"}
                            value={healthCard.phil_health_masa_num}
                            name={"phil_health_masa_num"}
                            onChange={__on_health_card_change__}
                        />
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-semibold">VI. Tenurial Status</h1>
                    <div className="flex">
                        <div className="flex-1">
                            <CheckBox
                                label={"Owned"}
                                checked={tenurialStatus.owned}
                                name={"owned"}
                                onChange={__on_tenurial_status_change__}
                            />
                            <CheckBox
                                label={"Sharer"}
                                checked={tenurialStatus.sharer}
                                name={"sharer"}
                                onChange={__on_tenurial_status_change__}
                            />
                        </div>
                        <div className="flex-1">
                            <CheckBox
                                label={"Private Property"}
                                checked={tenurialStatus.priv_prop}
                                name={"priv_prop"}
                                onChange={__on_tenurial_status_change__}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex space-x-6 items-center">
                            <CheckBox
                                label={"Rent"}
                                checked={tenurialStatus.rent}
                                name={"rent"}
                                onChange={__on_tenurial_status_change__}
                            />
                            <Input
                                label={"Rent per Month"}
                                type={"number"}
                                value={tenurialStatus.rent_per_month}
                                name={"rent_per_month"}
                                onChange={__on_tenurial_status_change__}
                                disabled={!tenurialStatus.rent}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex space-x-6 items-center">
                                <CheckBox
                                    label={"Goverment Property"}
                                    checked={tenurialStatus.gov_prop}
                                    name={"gov_prop"}
                                    onChange={__on_tenurial_status_change__}
                                />
                                <div className={`${tenurialStatus.gov_prop ? "" : "opacity-50 pointer-events-none"}`}>
                                    <label className="block mb-1 text-lg font-bold text-gray-700">Danger Zone:</label>
                                    <div className="flex items-center justify-center space-x-5">
                                        <CheckBox
                                            label={"Riverside"}
                                            checked={tenurialStatus.riv_side}
                                            name={"riv_side"}
                                            onChange={__on_tenurial_status_change__}
                                        />
                                        <CheckBox
                                            label={"PNR Site"}
                                            checked={tenurialStatus.pnr_site}
                                            name={"pnr_site"}
                                            onChange={__on_tenurial_status_change__}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-32 w-full mt-3 border-t border-blue-500 flex items-center justify-center px-12">
                    <button className="h-16 w-full bg-green-400 rounded-full hover:bg-green-300 hover:shadow focus:outline focus:outline-green-500 mb-6"
                        onClick={__on_save__}
                    >
                        {parentID ? "update" : "save"}
                    </button>
                </div>
            </div>
        </div>
    )
}


export default AppFormSP;