import { useLocation } from "react-router-dom";

function useURLQuery() {
    return new URLSearchParams(useLocation().search);
}

export default useURLQuery