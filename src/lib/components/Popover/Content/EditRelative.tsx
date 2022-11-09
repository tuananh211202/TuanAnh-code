import { Button } from "antd";
import { FaUserMinus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export const EditRelative = ({ handleEdit, handleDel }) => {
  return (
    <div className="flex flex-col">
      <Button
        type="text"
        className="items-center"
        style={{ display: "flex" }}
        onClick={handleEdit}
        icon={<MdEdit className="mr-2" />}
      >
        Sửa quan hệ
      </Button>
      <Button
        type="text"
        className="items-center"
        style={{ display: "flex" }}
        onClick={handleDel}
        icon={<FaUserMinus className="mr-2" />}
      >
        Xoá quan hệ
      </Button>
    </div>
  );
};
