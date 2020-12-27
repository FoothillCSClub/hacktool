import { useLocation } from "react-router-dom";

function useURLQuery(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
}

export default useURLQuery