import { useCallback, useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Switch,
  Upload,
  message,
} from 'antd';
import { IoAdd } from 'react-icons/io5';
import { useAddBannerMutation } from '@/redux/reducers/bannerQuery';

interface Props {
  isOpenModal: boolean;
  toggle: () => void;
}

interface Body {
  title: string;
  url: string;
  isDisplayed: boolean;
  image: any;
}

export default function AddBanner({ isOpenModal, toggle }: Props) {
  const { accessToken } = useAppSelector((state) => state.auth);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState(false);

  const [addBanner, { isLoading, error, isSuccess, reset }] =
    useAddBannerMutation();

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
      body.append('title', values.title);
      if (values.url) body.append('url', values.url);
      body.append('isDisplayed', JSON.stringify(values.isDisplayed));
      body.append('image', values.image[0], values.image[0].name);

      addBanner({ accessToken, type: 'rental', formdata: true, data: body });
    },
    [accessToken, addBanner]
  );

  const normFile = useCallback((e: any) => {
    if (Array.isArray(e)) {
      return e?.map((file: any) => file.originFileObj);
    }
    return e?.fileList?.map((file: any) => file.originFileObj);
  }, []);

  useEffect(() => {
    if (isOpenModal && isSuccess) {
      message.success('Berhasil menambah banner.');
      setTimeout(() => {
        form.resetFields();
        reset();
        toggle();
      }, 500);
    }
  }, [isSuccess]);

  return (
    <Modal
      title="Tambah Banner"
      open={isOpenModal}
      onCancel={toggle}
      footer={null}
    >
      <Form form={form} onFinish={submitHandler} layout="vertical">
        <Form.Item
          label="Judul"
          name="title"
          rules={[{ required: true, message: 'Judul wajib diisi' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Url yang akan dituju"
          name="url"
          rules={[{ type: 'url', message: 'Url tidak valid' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="isDisplayed"
          label="Tampilkan?"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Upload"
          name="image"
          valuePropName="image"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Upload gambar.' }]}
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
            {form.getFieldValue('image')?.length > 0 ? null : (
              <div>
                <IoAdd />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
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
