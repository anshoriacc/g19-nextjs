import { useCallback, useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useUpdateProductMutation } from '@/redux/reducers/productQuery';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from 'antd';
import { DataType } from '@/app/admin/product/rental/page';
import { IoAdd } from 'react-icons/io5';

interface Props {
  isOpenModal: boolean;
  toggle: () => void;
  data: DataType;
  clearData: () => void;
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

export default function UpdateVehicle({
  isOpenModal,
  toggle,
  data,
  clearData,
}: Props) {
  const { accessToken } = useAppSelector((state) => state.auth);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState(false);

  const [updateVehicle, { isLoading, error, isSuccess, reset }] =
    useUpdateProductMutation();

  const [fileList, setFileList] = useState<UploadFile[]>(
    data.images.map((image, index) => ({
      uid: JSON.stringify(-(index + 1)),
      name: 'image.png',
      status: 'done',
      url: image,
    }))
  );

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values, fileList]);

  const submitHandler = useCallback(
    (values: Body) => {
      const body = new FormData();
      if (data.name !== values.name) body.append('name', values.name);
      if (data.description !== values.description)
        body.append('description', values.description);
      if (parseInt(data.capacity) !== values.capacity)
        body.append('capacity', JSON.stringify(values.capacity));
      if (data.price !== values.price)
        body.append('price', JSON.stringify(values.price));
      if (data.driverMandatory !== values.driverMandatory)
        body.append('driverMandatory', JSON.stringify(!values.driverMandatory));
      if (data.transmission !== values.transmission)
        body.append('transmission', values.transmission);
      if (parseInt(data.quantity) !== values.quantity)
        body.append('quantity', JSON.stringify(values.quantity));
      values.images.forEach((image: any) =>
        body.append('images', image, image.name)
      );
      if (data.images.length !== fileList.length) {
        if (fileList.length > 0) {
          fileList
            .map((file) => file.url)
            .forEach((image: any) => body.append('oldImages[]', image));
        }
        if (fileList.length === 0) {
          body.append('oldImages[]', '');
        }
      }

      updateVehicle({
        accessToken,
        type: 'rental',
        productId: data.id,
        formdata: true,
        data: body,
      });
    },
    [accessToken, data, updateVehicle]
  );

  const normFile = useCallback((e: any) => {
    if (Array.isArray(e)) {
      return e?.map((file: any) => file.originFileObj);
    }
    return e?.fileList?.map((file: any) => file.originFileObj);
  }, []);

  const oldImagesChangeHandler = useCallback<UploadProps['onChange']>(
    ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    []
  );

  useEffect(() => {
    if (isOpenModal && isSuccess) {
      message.success('Berhasil update kendaraan.');
      setTimeout(() => {
        form.resetFields()
        reset();
        toggle();
      }, 500);
    }
  }, [isSuccess]);

  return (
    <Modal
      title="Update Kendaraan"
      open={isOpenModal}
      onCancel={() => {
        clearData();
        toggle();
      }}
      footer={null}
    >
      <Form
        form={form}
        initialValues={{ rememberMe: true }}
        onFinish={submitHandler}
        layout="vertical"
      >
        <Form.Item
          label="Nama kendaraan"
          name="name"
          rules={[{ required: true, message: 'Nama wajib diisi' }]}
          initialValue={data.name}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Deskripsi"
          name="description"
          rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}
          initialValue={data.description}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Kapasitas"
          name="capacity"
          rules={[{ required: true, message: 'Kapasitas wajib diisi' }]}
          initialValue={data.capacity}
        >
          <InputNumber addonAfter="orang" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Harga sewa"
          name="price"
          rules={[{ required: true, message: 'Harga sewa wajib diisi' }]}
          initialValue={data.price}
        >
          <InputNumber addonBefore="Rp." className="w-full" />
        </Form.Item>

        <Form.Item
          name="driverMandatory"
          label="Bisa lepas kunci?"
          valuePropName="checked"
          initialValue={!data.driverMandatory}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Transmisi"
          name="transmission"
          initialValue={data.transmission}
        >
          <Radio.Group>
            <Radio.Button value="manual">manual</Radio.Button>
            <Radio.Button value="automatic">automatic</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Jumlah armada"
          name="quantity"
          rules={[{ required: true, message: 'Jumlah armada wajib diisi' }]}
          initialValue={data.quantity}
        >
          <InputNumber addonAfter="kendaraan" className="w-full" />
        </Form.Item>

        <Upload
          listType="picture-card"
          showUploadList={true}
          fileList={fileList}
          onChange={oldImagesChangeHandler}
        />

        <Form.Item
          label="Upload"
          name="images"
          valuePropName="images"
          getValueFromEvent={normFile}
          rules={[
            {
              required: fileList.length < 1 ? true : false,
              message: 'Upload gambar minimal 1',
            },
          ]}
          initialValue={[]}
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
            // fileList={fileList}
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
