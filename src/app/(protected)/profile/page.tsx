'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Tag, Avatar, Button, Form, Modal, Input, message } from 'antd';
import { BiSolidUser } from 'react-icons/bi';
import Reservation from '@/components/profile/Reservation';
import { useUpdateProfileMutation } from '@/redux/reducers/profileQuery';
import { logout } from '@/redux/reducers/authSlice';

type Body = {
  email: string;
  username: string;
  name: string;
  phone: string;
  address?: string;
};

export default function Profile() {
  const { accessToken, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = useCallback(() => {
    setOpenModal((modal) => !modal);
  }, []);

  const [updateProfile, { isLoading, error, isSuccess, reset }] =
    useUpdateProfileMutation();

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
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
      body.append('email', values.email);
      body.append('username', values.username);
      body.append('name', values.name);
      body.append('phone', values.phone);
      body.append('address', values.address ?? '');

      updateProfile({
        accessToken,
        data: body,
      });
    },
    [accessToken, updateProfile]
  );

  useEffect(() => {
    if (openModal && isSuccess) {
      message.success('Berhasil edit profil.');
      setTimeout(() => {
        form.resetFields();
        reset();
        toggleModal();
        dispatch(logout());
        message.success('Silakan masuk kembali.');
      }, 500);
    }
  }, [isSuccess]);

  return (
    <section className="w-full px-[5%] sm:px-[10%] py-6 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col gap-4">
        <div className="relative p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col items-center sm:flex-row sm:items-start gap-4 text-center sm:text-left">
          {userInfo?.role !== 'admin' && (
            <Button
              onClick={toggleModal}
              type="primary"
              ghost
              className="absolute right-4 top-4"
            >
              Edit profil
            </Button>
          )}
          {userInfo.role === 'admin' ? (
            <Avatar
              size={100}
              className="flex justify-center items-center bg-[#00aeef]"
            >
              G19
            </Avatar>
          ) : userInfo.image ? (
            <Avatar src={userInfo.image} size={100} />
          ) : (
            <Avatar
              icon={<BiSolidUser size={80} />}
              size={100}
              className="flex justify-center items-center bg-[#00aeef]"
            />
          )}
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex gap-2 items-center">
              <h1 className="text-3xl font-bold m-0">{userInfo.name}</h1>
              <Tag
                color={userInfo?.role === 'admin' ? 'gold' : 'blue'}
                bordered={false}
                className="w-fit"
              >
                {userInfo?.role}
              </Tag>
            </div>
            <h3 className="text-xl italic m-0">{userInfo.username}</h3>
            <p className="text-md">{userInfo.phone}</p>
            <p className="text-md">{userInfo.address}</p>
          </div>
        </div>
        {userInfo?.role !== 'admin' && <Reservation />}
      </main>
      <Modal
        title="Edit Profil"
        open={openModal}
        onCancel={toggleModal}
        footer={null}
      >
        <Form form={form} onFinish={submitHandler} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            initialValue={userInfo.email}
            rules={[{ required: true, message: 'Email wajib diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            initialValue={userInfo.username}
            rules={[{ required: true, message: 'Username wajib diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nama Lengkap"
            name="name"
            initialValue={userInfo.name}
            rules={[{ required: true, message: 'Nama wajib diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nomor telepon (tersambung WhatsApp)"
            name="phone"
            initialValue={userInfo.phone}
            rules={[{ required: true, message: 'Nomor telepon wajib diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Alamat lengkap (opsional)"
            name="address"
            initialValue={userInfo.address}
          >
            <Input />
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
    </section>
  );
}
