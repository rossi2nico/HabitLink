import { FriendsContext } from "../context/FriendsContext";
import { useContext } from "react";

export const useFriendsContext = () => {
    const context = useContext(FriendsContext);

    if (!context) {
        throw Error('useFriendsContext must be used inside a FriendsContextProvider');
    }

    return context;
}

