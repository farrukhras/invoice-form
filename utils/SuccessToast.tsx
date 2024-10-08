import { toast } from "react-toastify";
import SubmissionToast from "../pages/components/SubmissionToast";

export const successToaster = (mainMessage: string, subMessage: string): void => {
  toast(<SubmissionToast mainMessage={mainMessage} subMessage={subMessage} />, {
    theme: "light",
    position: "top-right",
    autoClose: 3000,
    className: "bg-white p-32 rounded-3xl",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
