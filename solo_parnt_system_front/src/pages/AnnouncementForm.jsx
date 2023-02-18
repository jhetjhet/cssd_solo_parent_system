import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useAthenticationContext } from "../components/Authentication";
import {
    Input,
    TextArea,
    Options,
    CheckBox,
} from "../components/FormInputs";

const AnnouncementCard = ({ id, onRemove, description, schedule, message }) => {


    const __cancel__ = () => {
        axios.delete(`http://localhost:8000/api/announcements/${id}/`).finally(() => {
            onRemove(id);
        });
    }

    return (
        <div className="max-w-xl bg-blue-400 p-2 rounded-xl shadow-md hover:shadow-xl text-white">
            <div className="flex items-center">
                <span className="text-lg font-semibold">
                    {description}
                </span>
                <span className="ml-3 flex">
                    { schedule }
                </span>
                <button className="ml-auto bg-red-400 px-2 py-1 rounded-lg text-white hover:bg-red-300 hover:text-gray-200"
                    onClick={__cancel__}
                >
                    cancel
                </button>
            </div>
            <div className="">
                <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                    {message}
                </p>
            </div>
        </div>
    );
}

const AnnouncementForm = () => {

    const DEFUALT_ANNC_DATA = {
        description: "",
        schedule: "",
        message: "",
    }

    const [schedules, setSchedules] = useState([]);

    const [anncData, setAnncData] = useState({ ...DEFUALT_ANNC_DATA });

    const [dateSched, setDateSched] = useState("");
    const [timeSched, setTimeSched] = useState("00:00");

    const [errors, setErrors] = useState([]);

    const {
        user,
    } = useAthenticationContext();

    useEffect(() => {
        __load_schedules__();
    }, []);

    const __load_schedules__ = () => {
        axios.get('http://localhost:8000/api/announcements/').then((resp) => {
            setSchedules([...resp.data]);
        }).catch(() => {});
    }

    const __on_change__ = (e) => {
        let { name, value } = e.target;

        let newAnccData = { ...anncData };
        newAnccData[name] = value;
        setAnncData(newAnccData);
    }

    const __on_submit__ = (e) => {
        e.preventDefault();

        const data = { 
            ...anncData,
            schedule: new Date(`${dateSched} ${timeSched}`),
        };
        console.log(data)

        axios.post('http://localhost:8000/api/announcements/', data).then((resp) => {
            setAnncData({ ...DEFUALT_ANNC_DATA });
            setDateSched("");
            setTimeSched("00:00");
            __load_schedules__();
        }).catch((err) => {
            if (err.response)
                setErrors({ ...err.response.data });
        });
    }

    const __remove_sched__ = (id) => {

        let newSchedules = schedules.filter((sched) => sched.id !== id);
        setSchedules(newSchedules);
    }

    return (
        <div className={`
            container mx-3 flex justify-center
            ${ user.is_admin ? "" : "opacity-50 pointer-events-none" }
        `}>
            <div className="flex flex-col bg-blue-100 p-3 rounded-lg my-4 shadow">
                <h1 className="my-3 text-3xl font-extrabold">Announcements</h1>
                <form onSubmit={__on_submit__}>
                    <div className="mt-3 p-3 border border-gray-400">
                        <div className="rounded flex items-stretch">
                            <div className="flex-1">
                                <Input
                                    label={"Description"}
                                    value={anncData.description}
                                    name={"description"}
                                    onChange={__on_change__}
                                    error={errors.description && errors.description[0]}
                                />
                            </div>
                            <div className="flex flex-1">
                                <Input
                                    label={"Date"}
                                    type={"date"}
                                    value={dateSched}
                                    onChange={(e) => setDateSched(e.target.value)}
                                    error={errors.schedule && errors.schedule[0]}
                                />
                                <Input
                                    label={"Time"}
                                    type={"time"}
                                    value={timeSched}
                                    onChange={(e) => setTimeSched(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <TextArea
                                label={"Message"}
                                value={anncData.message}
                                name={"message"}
                                onChange={__on_change__}
                                error={errors.message && errors.message[0]}
                            />
                        </div>
                        <button
                            className="w-full bg-green-400 p-2 rounded-md"
                            type="submit"
                        >
                            create announcement
                        </button>
                    </div>
                </form>
                <div className="mt-4">
                    <div className="text-center">
                        <h1 className="my-3 text-xl font-semibold">Scheduled announcements:</h1>
                    </div>
                    <div className="flex flex-col space-y-3">
                        {schedules.map((sched) => (
                            <AnnouncementCard
                                key={sched.id}
                                id={sched.id}
                                description={sched.description}
                                schedule={sched.str_schedule}
                                message={sched.message}
                                onRemove={__remove_sched__}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnnouncementForm;