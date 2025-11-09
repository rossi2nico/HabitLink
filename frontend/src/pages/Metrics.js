import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useHabits } from "../hooks/useHabits";

export const Metrics = () => {
    const { user } = useAuthContext();
    const { getHabits } = useHabits();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const res = await getHabits();
                if (res.habits?.length === 0) {
                    navigate("/habits");
                } else {
                    navigate(`/habits/${res.habits[0]._id}`);
                }
            } catch (err) {
                console.error("Error fetching habits:", err);
            }
        };

        fetchData();
    }, [user, getHabits, navigate]);

    return null;
};
