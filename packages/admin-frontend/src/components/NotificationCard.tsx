import { BsX } from "react-icons/bs";
const colorSchemes = {
  info: {
    background: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-600",
  },
  success: {
    background: "bg-green-50",
    border: "border-green-500",
    text: "text-green-600",
  },
  error: {
    background: "bg-red-50",
    border: "border-red-500",
    text: "text-red-600",
  },
};
const NotificationCard = ({
  type,
  message,
  onClose,
}: {
  type: keyof typeof colorSchemes;
  message: string;
  onClose: () => void;
}) => {
  const { background, border, text } = colorSchemes[type] || colorSchemes.info;

  return (
    <div
      className={`flex gap-x-4 border ${background} px-4 py-2 ${border} rounded-lg w-full text-black`}
    >
      <BsX
        size={22}
        className="text-gray-600 cursor-pointer"
        onClick={onClose}
      />
      <p className={text}>{message}</p>
    </div>
  );
};

export default NotificationCard;
