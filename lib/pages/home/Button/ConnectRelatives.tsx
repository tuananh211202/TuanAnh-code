import {
  Button,
  Form,
  Input,
  Modal,
  Checkbox,
  Select,
  Col,
  Row,
  Typography,
} from "antd";
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
import { useEffect, useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { errorMessage, successMessage } from "lib/components/ShowMesssage";

const { Search } = Input;

const ConnectRelativesButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const exampleList = useLiveQuery(
    () => db.relatives.toArray(),
    [isModalOpen]
  )?.slice(1);
  const [relatives, setRelatives] = useState(exampleList);
  useEffect(() => setRelatives(exampleList), [isModalOpen]);

  const [listValue, setListValue] = useState<CheckboxValueType[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(
    () => setDisabled(listValue.length >= 2 ? true : false),
    [listValue]
  );

  const onSearch = (value) => {
    setRelatives(exampleList?.filter((item) => item.name.includes(value)));
  };

  const getName = (value) => {
    return value.slice(value.search(":") + 2) || "";
  };

  const getId = (value) => {
    return parseInt(value.slice(0, value.search(":")));
  };

  const [relationship, setRelationship] = useState({
    from: 0,
    to: 0,
    type: "parent",
  });

  const handleRelationshipChange = (value: string) => {
    console.log(`selected ${value}`);
    setRelationship({ ...relationship, type: getRel(value) });
  };

  const getRel = (value) => {
    if (value == "mom" || value == "dad") return "parent";
    if (value == "wife" || value == "husband") return "spouse";
    return "child";
  };

  const revereRel = (value) => {
    if (value == "parent") return "child";
    if (value == "child") return "parent";
    return "spouse";
  };

  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleOk = () => {
    if (currentStep == 2) {
      addRelationship(relationship);
      setListValue([]);
      setDisabled(false);
      setIsModalOpen(false);
      setCurrentStep(1);
    } else {
      if (listValue.length < 2) errorMessage("H??y ch???n 2 ng?????i !!!", 5);
      else {
        setRelationship({
          ...relationship,
          from: getId(listValue[0]),
          to: getId(listValue[1]),
        });
        setCurrentStep(2);
      }
    }
  };

  const handleCancel = () => {
    setListValue([]);
    setDisabled(false);
    if (currentStep == 1) {
      setIsModalOpen(false);
    }
    if (currentStep == 2) {
      setCurrentStep(3 - currentStep);
    }
  };

  const addRelationship = async (rel) => {
    const cnt = await db.relationship.count();
    const lastRel = await db.relationship.orderBy("id").last();
    const count = lastRel?.id || cnt;
    const status = await db.relationship
      .where({ from: rel.from, to: rel.to })
      .first();
    if (typeof status === "undefined") {
      await db.relationship.add({ ...rel, id: count + 1 });
      await db.relationship.add({
        from: rel.to,
        to: rel.from,
        type: revereRel(rel.type),
        id: count + 2,
      });
      successMessage("Th??m th??nh c??ng", 5);
    } else errorMessage("???? t???n t???i", 5);
  };
  return (
    <>
      <Button
        type="primary"
        shape="round"
        size="large"
        icon={<CalendarOutlined />}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        K???t n???i tr???c h???
      </Button>
      <Modal
        title={`B?????c ${currentStep == 1 ? "1" : "2"}/2: ${
          currentStep == 1
            ? "L???a ch???n ng?????i th??n mu???n k???t n???i"
            : "X??c ?????nh m???i quan h???"
        }`}
        visible={isModalOpen}
        closable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {currentStep == 2 ? "Quay l???i" : "H???y"}
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            {currentStep == 2 ? "K???t n???i" : "Ti???p theo"}
          </Button>,
        ]}
      >
        {currentStep == 1 ? (
          <Form layout="vertical" style={{ margin: "15px" }}>
            <Form.Item label="T??m ki???m">
              <Search placeholder="input search text" onSearch={onSearch} />
            </Form.Item>
            <Form.Item label="Danh s??ch t??m th???y">
              <CheckboxGroup
                value={listValue}
                onChange={(list: CheckboxValueType[]) => {
                  setListValue(list);
                }}
                disabled={disabled}
              >
                <Row gutter={[0, 15]}>
                  {relatives?.map((item) => {
                    return (
                      <Col span={24}>
                        <Checkbox value={item.id + ": " + item.name}>
                          {item.name}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </CheckboxGroup>
            </Form.Item>
          </Form>
        ) : (
          <Form
            layout="vertical"
            style={{ margin: "15px" }}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <Form.Item label="Ch???n m???i quan h???">
              <Col span={24} style={{ margin: "0px 0px 15px 0px" }}>
                <Typography.Text strong>
                  {getName(listValue[0])}
                </Typography.Text>
                <Typography.Text> l?? ... c???a </Typography.Text>
                <Typography.Text strong>
                  {getName(listValue[1])}
                </Typography.Text>
              </Col>
              <Select
                defaultValue="dad"
                style={{
                  width: 120,
                }}
                onChange={handleRelationshipChange}
              >
                <Option value="dad">B???</Option>
                <Option value="mom">M???</Option>
                <Option value="husband">Ch???ng</Option>
                <Option value="wife">V???</Option>
                <Option value="son">Con trai</Option>
                <Option value="daughter">Con g??i</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
export default ConnectRelativesButton;
