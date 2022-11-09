import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { BsClock, BsThreeDotsVertical } from "react-icons/bs";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Space,
  Typography,
} from "antd";
import Meta from "antd/lib/card/Meta";
import { CalendarOutlined, MoreOutlined } from "@ant-design/icons";
import { EditRelative } from "lib/components/Popover/Content/EditRelative";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectArrayArticle } from "./slice/selectors";
import moment from "moment";
import { articleSlice, setListArticle } from "./slice";
import { db } from "lib/database/config";
import { useLiveQuery } from "dexie-react-hooks";

const { Text, Title } = Typography;

const ArticleModal = ({ isModalOpen, setIsModalOpen, currentObj = {} }) => {
  const dispatch = useDispatch();
  const initialValues = currentObj.id
    ? {
        id: currentObj.id,
        content: currentObj.content,
        time: moment.unix(currentObj.time),
        relativeId: 1
      }
    : {};
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const { content, time } = values;
    if (currentObj.id) {
      await db.article.update(currentObj.id, { time: time.unix(), content });
    } else {
      await db.article.add({ time: time.unix(), content, relativeId: 1 });
      // dispatch(setListArticle({ content, time: time.format("MM/DD/YYYY") }));
    }

    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  return (
    <Modal
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Thoát
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          Thêm kỷ niệm
        </Button>,
      ]}
    >
      <Title level={5} className="text-center pb-4">
        Nhập kỷ niệm
      </Title>
      <Form
        name="article"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        key={1}
        form={form}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label="Tên kỷ niệm"
              name="content"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày kỷ niệm"
              name="time"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const ArticleList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentObj, setCurrentObj] = useState({});
  // const { actions } = articleSlice;
  // const dispatch = useDispatch();

  // const data2 = useSelector(selectArrayArticle);

  const data = useLiveQuery(() => db.article.toArray(), []);
  const showModal = () => {
    setCurrentObj({});
    setIsModalOpen(true);
  };
  const handleDelete = (id) => {
    db.article
      .where("id")
      .equals(id)
      .delete()
      .then((deleteCount) => {
        console.log("Deleted " + deleteCount + " objects");
      });
    // dispatch(actions.removeArticle(id));
  };
  const handleEditArticle = (objects: Object) => {
    setCurrentObj(objects);
    setIsModalOpen(true);
  };
  return (
    <Space direction="vertical" size="small" className="w-full">
      <div>
        <div className="flex m-4">
          <FaCalendarAlt size={20} className="mr-2" />
          <Text>Kỉ niệm</Text>
        </div>

        {data?.map((item) => (
          <div
            className="flex justify-between mx-4 my-2"
            key={data.indexOf(item)}
          >
            <Meta
              avatar={<BsClock size={36} />}
              title={moment.unix(item.time).format("DD-MM-YYYY")}
              description={item.content}
            />
            <Popover
              placement="right"
              content={
                <EditRelative
                  handleDel={() => handleDelete(item.id)}
                  handleEdit={() => handleEditArticle(item)}
                />
              }
              trigger="click"
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Popover>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={showModal}
          icon={<CalendarOutlined />}
        >
          Thêm kỉ niệm
        </Button>
        <ArticleModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          currentObj={currentObj}
        />
      </div>
    </Space>
  );
};

export default ArticleList;
