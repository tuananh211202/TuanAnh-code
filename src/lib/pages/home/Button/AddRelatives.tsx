import { Button, Form, Radio, Input, Modal, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import moment from "moment";
import { db } from "lib/database/config";
import { useLiveQuery } from "dexie-react-hooks";
import { successMessage } from "lib/components/ShowMesssage";
import {
  convertLunarr2Solar,
  convertSolar2Lunar,
  lunarDays,
  lunarMonths,
  lunarYears,
} from "lib/components/lunar";

const { Option } = Select;

export const EditRelativesModal = (props) => {
  const validatePhonenumber = (phoneNumber) => {
    const type_1 = /^\d{10}$/;
    const type_2 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const type_3 = /^\(+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (
      phoneNumber.match(type_1) ||
      phoneNumber.match(type_2) ||
      phoneNumber.match(type_3)
    )
      return true;
    return false;
  };

  const validateEmail = (email) => {
    const type = /^\w+([\.-]?\w+)*@\w+([\-.]?\w+)*(\.\w{2,3})+$/;
    if (email.match(type)) return true;
    return false;
  };
  const isModalOpen = props.isModalOpen;
  const setIsModalOpen = props.setIsModalOpen;
  const setId = props.setId;
  const yourBirthday = props.birthday;
  const defaultValue = useLiveQuery(
    () => db.relatives.get(props.id),
    [props.id]
  );
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (typeof form.getFieldValue("name") == "undefined") {
      const solarDate = convertLunarr2Solar(
        parseInt(moment(defaultValue?.deathday, "DD/MM/YYYY").format("DD")),
        parseInt(moment(defaultValue?.deathday, "DD/MM/YYYY").format("MM")),
        parseInt(moment(defaultValue?.deathday, "DD/MM/YYYY").format("YYYY")),
        0,
        7
      );
      form.setFieldsValue({
        ...defaultValue,
        birthday: moment(defaultValue?.birthday, "DD/MM/YYYY"),
        status: defaultValue?.deathday == "" ? "true" : "false",
      });
      if (defaultValue?.deathday != "") {
        form.setFieldValue(
          "lunar_date",
          parseInt(moment(defaultValue?.deathday, "DD/MM/YYYY").format("DD"))
        );
        form.setFieldValue(
          "lunar_month",
          parseInt(moment(defaultValue?.deathday, "DD/MM/YYYY").format("MM"))
        );
        form.setFieldValue(
          "lunar_year",
          parseInt(moment(defaultValue?.deathday, "DD/MM/YYYY").format("YYYY"))
        );
        form.setFieldValue(
          "solar",
          moment().set({
            year: solarDate[2],
            month: solarDate[1] - 1,
            date: solarDate[0],
          })
        );
      } else
        form.setFieldsValue({
          solar: moment("01/01/0001", "DD/MM/YYYY"),
          lunar_date: 1,
          lunar_month: 1,
          lunar_year: 1,
        });
      if (defaultValue?.deathday == "") setDisabled(true);
      else setDisabled(false);
    }
  }, [defaultValue]);
  const [type, setType] = useState("parent");
  const onChange = (value) => {
    setType(value);
    form.validateFields(["birthday"]);
  };
  const onFinish = () => {
    successMessage("Lưu thàng công", 5);
  };

  const handleOk = async () => {
    const yourRel = {
      name: form.getFieldValue("name"),
      other_name: "",
      email: form.getFieldValue("email"),
      facebook: form.getFieldValue("facebook"),
      phone: form.getFieldValue("phone"),
      gender: form.getFieldValue("gender"),
      origin: form.getFieldValue("origin"),
      birthday:
        typeof form.getFieldValue("birthday") === "undefined"
          ? "01/01/2010"
          : form.getFieldValue("birthday").format("DD/MM/YYYY"),
      deathday:
        form.getFieldValue("status") == "true"
          ? ""
          : moment()
              .set({
                year: form.getFieldValue("lunar_year"),
                month: form.getFieldValue("lunar_month") - 1,
                date: form.getFieldValue("lunar_date"),
              })
              .format("DD/MM/YYYY"),
      type: type,
    };
    await db.relatives.update(props.id, yourRel);
    form.submit();
    form.resetFields();
    setIsModalOpen(false);
    setId(0);
  };

  const handleCancel = () => {
    form.resetFields();
    setId(0);
    setIsModalOpen(false);
  };
  const onChangeStatus = () => {
    if (form.getFieldValue("status") == "true") setDisabled(true);
    else setDisabled(false);
  };

  const onChangeSolar = () => {
    const thisDay = form.getFieldValue("solar");
    if (thisDay == null) return;
    const day = parseInt(thisDay.format("DD"));
    const month = parseInt(thisDay.format("MM"));
    const year = parseInt(thisDay.format("YYYY"));
    const lunarDay = convertSolar2Lunar(day, month, year, 7);
    form.setFieldValue("lunar_date", lunarDay[0]);
    form.setFieldValue("lunar_month", lunarDay[1]);
    form.setFieldValue("lunar_year", lunarDay[2]);
  };

  const onChangeLunar = () => {
    const lDay = form.getFieldValue("lunar_date");
    const lMonth = form.getFieldValue("lunar_month");
    const lYear = form.getFieldValue("lunar_year");
    if (
      typeof lDay != "undefined" &&
      typeof lMonth != "undefined" &&
      typeof lYear != "undefined"
    ) {
      const solarDay = convertLunarr2Solar(
        parseInt(lDay),
        parseInt(lMonth),
        parseInt(lYear),
        0,
        7
      );
      form.setFieldValue(
        "solar",
        moment().set({
          year: solarDay[2],
          month: solarDay[1] - 1,
          date: solarDay[0],
        })
      );
      form.validateFields(["solar"]);
    }
  };

  return (
    <Modal
      title="Thêm họ hàng ruột thịt"
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Lưu thông tin
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ margin: "15px" }}
      >
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Địa chỉ Email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input placeholder="Địa chỉ Email" />
        </Form.Item>
        <Form.Item
          name="facebook"
          label="Facebook"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="facebook" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Hãy điền đầy đủ thông tin!!!" },
            () => ({
              validator(_, value) {
                if (validatePhonenumber(value)) return Promise.resolve();
                return Promise.reject(
                  new Error("Hãy nhập đúng số điện thoại của bạn!!!")
                );
              },
            }),
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="type" label="Tên quan hệ">
          <Select onChange={onChange} style={{ width: "100%" }}>
            <Option value="parent">Bố mẹ</Option>
            <Option value="child">Con cái</Option>
            <Option value="spouse">Vợ chồng</Option>
            <Option value="next_sibling">Anh em ruột</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="origin"
          label="Quê quán"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Quê quán" />
        </Form.Item>
        <Form.Item
          name="birthday"
          label="Ngày sinh"
          rules={[
            { required: true, message: "Hãy điền đầy đủ thông tin!!!" },
            () => ({
              validator(_, value) {
                const today = new Date();
                if (
                  (type == "parent" &&
                    value.toDate().getTime() >= yourBirthday.getTime()) ||
                  (type == "child" &&
                    value.toDate().getTime() <= yourBirthday.getTime())
                )
                  return Promise.reject(
                    new Error("Tuổi bố mẹ cần lớn hơn tuổi con!!!")
                  );
                if (!value || today.getTime() >= value.toDate().getTime())
                  return Promise.resolve();
                return Promise.reject(
                  new Error("Ngày sinh cần trước ngày hôm nay!!!")
                );
              },
            }),
          ]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Hiện tại"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Radio.Group onChange={onChangeStatus}>
            <Radio value="true">Còn sống</Radio>
            <Radio value="false">Đã mất</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="solar"
          label="Dương lịch"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const today = new Date();
                if (
                  getFieldValue("status") == "true" ||
                  (today.getTime() >= value.toDate().getTime() &&
                    value.toDate().getTime() >=
                      getFieldValue("birthday").toDate().getTime())
                )
                  return Promise.resolve();
                return Promise.reject(
                  new Error(
                    "Ngày mất cần trước ngày hôm nay và sau ngày sinh!!!"
                  )
                );
              },
            }),
          ]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            disabled={disabled}
            onChange={onChangeSolar}
          ></DatePicker>
        </Form.Item>
        <Form.Item name="lunar_date" label="Ngày âm">
          <Select disabled={disabled} onChange={onChangeLunar}>
            {lunarDays.map((item) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="lunar_month" label="Tháng âm">
          <Select disabled={disabled} onChange={onChangeLunar}>
            {lunarMonths.map((item) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="lunar_year" label="Năm âm">
          <Select disabled={disabled} onChange={onChangeLunar}>
            {lunarYears.map((item) => (
              <Option value={item.value}>
                {item.value + " - " + item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddRelativesButton = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const yourBirthday = moment(props.birthday, "DD/MM/YYYY").toDate();

  const [type, setType] = useState("parent");
  const onChange = (value) => {
    setType(value);
    form.validateFields(["birthday"]);
  };

  const onFinish = async () => {
    const yourRel = {
      name: form.getFieldValue("name"),
      other_name: "",
      email: form.getFieldValue("email"),
      facebook: form.getFieldValue("facebook"),
      phone: form.getFieldValue("phone"),
      gender: form.getFieldValue("gender"),
      origin: form.getFieldValue("origin"),
      birthday:
        typeof form.getFieldValue("birthday") === "undefined"
          ? "01/01/2010"
          : form.getFieldValue("birthday").format("DD/MM/YYYY"),
      deathday:
        form.getFieldValue("status") == "true"
          ? ""
          : moment()
              .set({
                year: form.getFieldValue("lunar_year"),
                month: form.getFieldValue("lunar_month") - 1,
                date: form.getFieldValue("lunar_date"),
              })
              .format("DD/MM/YYYY"),
      type: type,
    };
    successMessage("Thêm thành công", 5);
    const id = await db.relatives.add(yourRel);
    console.log(id);
    const cnt = await db.relationship.count();
    const lastRel = await db.relationship.orderBy("id").last();
    const count = lastRel?.id || cnt;
    await db.relationship.add({ from: id, to: 1, type: type, id: count + 1 });
    await db.relationship.add({
      from: 1,
      to: id,
      type: type != "parent" ? (type != "child" ? type : "parent") : "child",
      id: count + 2,
    });
  };

  const handleOk = () => {
    if (
      form.getFieldsError().filter(({ errors }) => errors.length).length === 0
    ) {
      form.submit();
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setDisabled(true);
  };

  const [disabled, setDisabled] = useState(true);
  const onChangeStatus = () => {
    if (form.getFieldValue("status") == "true") setDisabled(true);
    else setDisabled(false);
  };

  const onChangeSolar = () => {
    const thisDay = form.getFieldValue("solar");
    const day = parseInt(thisDay.format("DD"));
    const month = parseInt(thisDay.format("MM"));
    const year = parseInt(thisDay.format("YYYY"));
    const lunarDay = convertSolar2Lunar(day, month, year, 7);
    form.setFieldValue("lunar_date", lunarDay[0]);
    form.setFieldValue("lunar_month", lunarDay[1]);
    form.setFieldValue("lunar_year", lunarDay[2]);
  };

  const onChangeLunar = () => {
    const lDay = form.getFieldValue("lunar_date");
    const lMonth = form.getFieldValue("lunar_month");
    const lYear = form.getFieldValue("lunar_year");
    if (
      typeof lDay != "undefined" &&
      typeof lMonth != "undefined" &&
      typeof lYear != "undefined"
    ) {
      const solarDay = convertLunarr2Solar(
        parseInt(lDay),
        parseInt(lMonth),
        parseInt(lYear),
        0,
        7
      );
      form.setFieldValue(
        "solar",
        moment().set({
          year: solarDay[2],
          month: solarDay[1] - 1,
          date: solarDay[0],
        })
      );
      form.validateFields(["solar"]);
    }
  };

  const validatePhonenumber = (phoneNumber) => {
    const type_1 = /^\d{10}$/;
    const type_2 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const type_3 = /^\(+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (
      phoneNumber.match(type_1) ||
      phoneNumber.match(type_2) ||
      phoneNumber.match(type_3)
    )
      return true;
    return false;
  };

  const validateEmail = (email) => {
    const type = /^\w+([\.-]?\w+)*@\w+([\-.]?\w+)*(\.\w{2,3})+$/;
    if (email.match(type)) return true;
    return false;
  };

  return (
    <>
      <Button
        type="primary"
        shape="round"
        size="large"
        icon={<UserAddOutlined />}
        onClick={() => setIsModalOpen(true)}
      >
        Thêm họ hàng ruột thịt
      </Button>
      <Modal
        title="Thêm họ hàng ruột thịt"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Thêm họ hàng
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{ margin: "15px" }}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Địa chỉ Email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input placeholder="Địa chỉ Email" />
          </Form.Item>
          <Form.Item
            name="facebook"
            label="Facebook"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="facebook" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Hãy điền đầy đủ thông tin!!!" },
              () => ({
                validator(_, value) {
                  if (validatePhonenumber(value)) return Promise.resolve();
                  return Promise.reject(
                    new Error("Hãy nhập đúng số điện thoại của bạn!!!")
                  );
                },
              }),
            ]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="type" label="Tên quan hệ">
            <Select
              defaultValue="parent"
              onChange={onChange}
              style={{ width: "100%" }}
            >
              <Option value="parent">Bố mẹ</Option>
              <Option value="child">Con cái</Option>
              <Option value="spouse">Vợ chồng</Option>
              <Option value="next_sibling">Anh em ruột</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="origin"
            label="Quê quán"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Quê quán" />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[
              { required: true, message: "Hãy điền đầy đủ thông tin!!!" },
              () => ({
                validator(_, value) {
                  const today = new Date();
                  if (
                    (type == "parent" &&
                      value.toDate().getTime() >= yourBirthday.getTime()) ||
                    (type == "child" &&
                      value.toDate().getTime() <= yourBirthday.getTime())
                  )
                    return Promise.reject(
                      new Error("Tuổi bố mẹ cần lớn hơn tuổi con!!!")
                    );
                  if (!value || today.getTime() >= value.toDate().getTime())
                    return Promise.resolve();
                  return Promise.reject(
                    new Error("Ngày sinh cần trước ngày hôm nay!!!")
                  );
                },
              }),
            ]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Hiện tại"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Radio.Group onChange={onChangeStatus}>
              <Radio value="true">Còn sống</Radio>
              <Radio value="false">Đã mất</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="solar"
            label="Dương lịch"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const today = new Date();
                  if (
                    getFieldValue("status") == "true" ||
                    (today.getTime() >= value.toDate().getTime() &&
                      value.toDate().getTime() >=
                        getFieldValue("birthday").toDate().getTime())
                  )
                    return Promise.resolve();
                  return Promise.reject(
                    new Error(
                      "Ngày mất cần trước ngày hôm nay và sau ngày sinh!!!"
                    )
                  );
                },
              }),
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              disabled={disabled}
              onChange={onChangeSolar}
            ></DatePicker>
          </Form.Item>
          <Form.Item name="lunar_date" label="Ngày âm">
            <Select disabled={disabled} onChange={onChangeLunar}>
              {lunarDays.map((item) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="lunar_month" label="Tháng âm">
            <Select disabled={disabled} onChange={onChangeLunar}>
              {lunarMonths.map((item) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="lunar_year" label="Năm âm">
            <Select disabled={disabled} onChange={onChangeLunar}>
              {lunarYears.map((item) => (
                <Option value={item.value}>
                  {item.value + " - " + item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddRelativesButton;
