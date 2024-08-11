import React from "react";
import { ToastContentProps } from "react-toastify";
import { CheckCircle } from "lucide-react";

interface CustomToastProps {
  mainMessage: string;
  subMessage: string;
}

const SubmissionToast: React.FC<CustomToastProps> = ({ mainMessage, subMessage }) => {

  return (
    <div className="flex items-start space-x-4 rounded p-2">
      <CheckCircle className="w-6 h-6 text-green-500" />

      <div className="text-left">
        <p className="font-medium text-base text-[#555555] mb-3">{mainMessage}</p>
        <p className="font-normal text-sm text-[#8E8E8E]">{subMessage}</p>
      </div>
    </div>
  );
};

export default SubmissionToast;
