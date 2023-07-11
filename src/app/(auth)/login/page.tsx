'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginAction } from '@/redux/actions/authAction';
import { LoginData } from '@/api/auth';
import Link from 'next/link';

export default function Login() {
  const { isLoading, error, isSuccess } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState(false);

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

  const dispatch = useAppDispatch();

  const submitHandler = useCallback(
    (values: LoginData) => {
      dispatch(loginAction(values));
    },
    [dispatch]
  );

  useEffect(() => {
    if (isSuccess) message.success('Berhasil masuk.');
  }, [isSuccess]);

  return (
    <Form
      form={form}
      initialValues={{ rememberMe: true }}
      onFinish={submitHandler}
      layout="vertical"
      className="bg-white dark:bg-gray-900 p-4 sm:p-8 rounded-md w-[90vw] max-w-[400px] shadow overflow-hidden"
    >
      <Form.Item
        label="Email atau username"
        name="emailOrUsername"
        rules={[{ required: true, message: 'Email atau username wajib diisi' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Kata sandi"
        name="password"
        rules={[{ required: true, message: 'Password wajib diisi' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="rememberMe" valuePropName="checked">
        <Checkbox>Ingat saya</Checkbox>
      </Form.Item>

      <Form.Item className="m-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="primary"
            htmlType="submit"
            disabled={!submittable || isLoading}
            loading={isLoading}
            className="bg-[#00aeef] w-full sm:w-fit"
          >
            Masuk
          </Button>
          {error && <p className="text-red-500">{error.message}</p>}
        </div>
        <p>
          Atau{' '}
          <Link href="/register" className="text-[#00aeef]">
            daftar di sini.
          </Link>
        </p>
      </Form.Item>
    </Form>
  );
}
