import {
  MoreOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Popover,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import Meta from "antd/lib/card/Meta";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import { ROLE } from "lib/utils/common";
import Link from "next/link";
import { useState } from "react";
import { FaUserCircle, FaUsers, FaUserMinus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { EditRelativesModal } from "../home/Button/AddRelatives";
import AddRelativesButton from "./Button/AddRelatives";
import ConnectRelativesButton from "./Button/ConnectRelatives";

const { Text } = Typography;
const content = (handleEdit, handleDelete) => (
  <div className="flex flex-col">
    <Button
      type="text"
      className="items-center"
      style={{ display: "flex" }}
      icon={<MdEdit className="mr-2" />}
      onClick={handleEdit}
    >
      Sửa quan hệ
    </Button>
    <Button
      type="text"
      className="items-center"
      style={{ display: "flex" }}
      icon={<FaUserMinus className="mr-2" />}
      onClick={handleDelete}
    >
      Xoá quan hệ
    </Button>
  </div>
);
const Family = (props) => {
  const id = props.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const exampleData = useLiveQuery(() => db.relatives.toArray());

  const data = useLiveQuery(() =>
    db.relationship.where("from").equals(id).toArray()
  );
  console.log(data);

  const handleEdit = () => {
    setIsModalOpen(true);
  };
  const deleteContact = async (id) => {
    await db.relatives.delete(id);
    const relationship = await db.relationship.toArray();
    for (let i in relationship)
      if (relationship[i].from == id || relationship[i].to == id) {
        const relId = relationship[i].id || 0;
        await db.relationship.delete(relId);
      }
    console.log(relationship);
  };
  const result = [];
  data?.map((item) => {
    exampleData?.map((exData) => {
      if (exData.id == item.to) result.push([exData, item.type]);
    });
  });
  return (
    <Space direction="vertical" size="small" className="w-full">
      <div className="flex m-4">
        <FaUsers size={20} className="mr-2" />
        <Text>Gia đình</Text>
      </div>

      {result?.map((item) => (
        <Link href={`/relatives/${item[0].id}`}>
          <div
            className="flex justify-between mx-4 my-2"
            key={result.indexOf(item)}
          >
            <Meta
              avatar={<FaUserCircle size={36} />}
              title={item[0].name}
              description={ROLE[item[0].gender][item[1]]}
            />
            <Popover
              placement="right"
              content={content(handleEdit, () => deleteContact(item[0].id))}
              trigger="click"
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Popover>
            <EditRelativesModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              id={item[0].id}
            />
          </div>
        </Link>
      ))}

      <div className="flex justify-between m-5">
        <AddRelativesButton></AddRelativesButton>
        <ConnectRelativesButton></ConnectRelativesButton>
      </div>
    </Space>
  );
};

export default Family;
