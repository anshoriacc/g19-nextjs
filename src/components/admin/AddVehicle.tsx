import { useCallback, useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useAddProductMutation } from '@/redux/reducers/productQuery';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Switch,
  Upload,
  message,
} from 'antd';
import { IoAdd } from 'react-icons/io5';

interface Props {
  isOpenModal: boolean;
  toggle: () => void;
}

interface Body {
  name: string;
  description: string;
  capacity: number;
  price: number;
  driverMandatory: boolean;
  transmission: 'manual' | 'automatic';
  quantity: number;
  images: [];
}

export default function AddVehicle({ isOpenModal, toggle }: Props) {
  const { accessToken } = useAppSelector((state) => state.auth);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState(false);

  const [addVehicle, { isLoading, error, isSuccess, reset }] =
    useAddProductMutation();

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      (e) => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values]);

  const submitHandler = useCallback(
    (values: Body) => {
      const body = new FormData();
      body.append('name', values.name);
      body.append('description', values.description);
      body.append('capacity', JSON.stringify(values.capacity));
      body.append('price', JSON.stringify(values.price));
      body.append('driverMandatory', JSON.stringify(!values.driverMandatory));
      body.append('transmission', values.transmission);
      body.append('quantity', JSON.stringify(values.quantity));
      values.images.forEach((image: any) =>
        body.append('images', image, image.name)
      );

      addVehicle({ accessToken, type: 'rental', formdata: true, data: body });
    },
    [accessToken, addVehicle]
  );

  const normFile = useCallback((e: any) => {
    if (Array.isArray(e)) {
      return e?.map((file: any) => file.originFileObj);
    }
    return e?.fileList?.map((file: any) => file.originFileObj);
  }, []);

  useEffect(() => {
    if (isOpenModal && isSuccess) {
      message.success('Berhasil menambah kendaraan.');
      setTimeout(() => {
        form.resetFields();
        reset();
        toggle();
      }, 500);
    }
  }, [isSuccess]);

  return (
    <Modal
      title={'Tambah Kendaraan'}
      open={isOpenModal}
      onCancel={toggle}
      footer={null}
    >
      <Form
        form={form}
        onFinish={submitHandler}
        layout="vertical"
      >
        <Form.Item
          label="Nama kendaraan"
          name="name"
          rules={[{ required: true, message: 'Nama wajib diisi' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Deskripsi"
          name="description"
          rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Kapasitas"
          name="capacity"
          rules={[{ required: true, message: 'Kapasitas wajib diisi' }]}
        >
          <InputNumber addonAfter="orang" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Harga sewa"
          name="price"
          rules={[{ required: true, message: 'Harga sewa wajib diisi' }]}
        >
          <InputNumber addonBefore="Rp." className="w-full" />
        </Form.Item>

        <Form.Item
          name="driverMandatory"
          label="Bisa lepas kunci?"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>

        <Form.Item label="Transmisi" name="transmission" initialValue="manual">
          <Radio.Group>
            <Radio.Button value="manual">manual</Radio.Button>
            <Radio.Button value="automatic">automatic</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Jumlah armada"
          name="quantity"
          rules={[{ required: true, message: 'Jumlah armada wajib diisi' }]}
        >
          <InputNumber addonAfter="kendaraan" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Upload"
          name="images"
          valuePropName="images"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Upload gambar minimal 1' }]}
        >
          <Upload
            accept="image/png, image/jpg, image/jpeg, image/webp"
            listType="picture-card"
            showUploadList={true}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess('ok');
              }, 0);
            }}
          >
            <div>
              <IoAdd />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item className="m-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="primary"
              htmlType="submit"
              disabled={!submittable || isLoading}
              loading={isLoading}
              className="w-full sm:w-fit"
            >
              Simpan
            </Button>
            {error && <p className="text-red-500">{error.message}</p>}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
