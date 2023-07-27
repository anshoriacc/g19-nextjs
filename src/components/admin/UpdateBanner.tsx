import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Switch,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from 'antd';
import { AiFillEdit } from 'react-icons/ai';
import { DataType } from '@/app/admin/banner/page';
import { IoAdd } from 'react-icons/io5';
import { useUpdateBannerMutation } from '@/redux/reducers/bannerQuery';
import { useAppSelector } from '@/hooks';

type Props = {
  data: DataType;
};

interface Body {
  title: string;
  url?: string;
  isDisplayed: boolean;
  image: any;
}

export default function UpdateBanner({ data }: Props) {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = useCallback(() => {
    setOpenModal((modal) => !modal);
  }, []);

  const [updateBanner, { isLoading, error, isSuccess, reset }] =
    useUpdateBannerMutation();

  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: JSON.stringify(-1),
      name: 'image.png',
      status: 'done',
      url: data.imageUrl,
    },
  ]);

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
      body.append('title', values.title);
      body.append('url', values.url);
      body.append('isDisplayed', JSON.stringify(values.isDisplayed));
      if (values.image.length > 0)
        body.append('image', values.image[0], values.image[0].name);

      updateBanner({
        accessToken,
        bannerId: data.id,
        formdata: true,
        data: body,
      });
    },
    [accessToken, data, updateBanner]
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
    if (openModal && isSuccess) {
      message.success('Berhasil update banner.');
      setTimeout(() => {
        form.resetFields();
        reset();
        toggleModal();
      }, 500);
    }
  }, [isSuccess]);

  return (
    <>
      <Tooltip title="edit">
        <a
          className="text-lg"
          onClick={() => {
            toggleModal();
          }}
        >
          <AiFillEdit />
        </a>
      </Tooltip>
      <Modal
        title="Update Banner"
        open={openModal}
        onCancel={toggleModal}
        footer={null}
      >
        <Form form={form} onFinish={submitHandler} layout="vertical">
          <Form.Item
            label="Judul"
            name="title"
            initialValue={data.title}
            rules={[{ required: true, message: 'Judul wajib diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Url yang akan dituju"
            name="url"
            initialValue={data.url}
            rules={[{ type: 'url', message: 'Url tidak valid' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isDisplayed"
            label="Tampilkan?"
            valuePropName="checked"
            initialValue={data.isDisplayed}
          >
            <Switch />
          </Form.Item>

          <Upload
            listType="picture-card"
            showUploadList={true}
            fileList={fileList}
            onChange={oldImagesChangeHandler}
          />

          <Form.Item
            label="Upload"
            name="image"
            valuePropName="image"
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
            >
              {form.getFieldValue('image')?.length > 0 ||
              fileList.length > 0 ? null : (
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
    </>
  );
}
