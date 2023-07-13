'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import clsx from 'clsx';

import { Button, Form, Input, message } from 'antd';

import { useRegisterMutation } from '@/redux/reducers/authQuery';

interface Body {
  email: string;
  username: string;
  password: string;
  confirm: string;
  name: string;
  phone: string;
  address?: string;
}

export default function Register() {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [step, setStep] = useState(1);
  const [submittable1, setSubmittable1] = useState(false);
  const [submittable, setSubmittable] = useState(false);

  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (step === 1) {
      form
        .validateFields(['email', 'username', 'password', 'confirm'], {
          validateOnly: true,
        })
        .then(
          () => {
            setSubmittable1(true);
          },
          () => {
            setSubmittable1(false);
          }
        );
    }
    if (step === 2) {
      form
        .validateFields({
          validateOnly: true,
        })
        .then(
          () => {
            setSubmittable(true);
          },
          () => {
            setSubmittable(false);
          }
        );
    }
  }, [form, step, values]);

  const nextHandler = useCallback(() => {
    setStep((step) => step + 1);
  }, []);

  const prevHandler = useCallback(() => {
    setStep((step) => step - 1);
  }, []);

  const submitHandler = useCallback(
    (values: Body) => {
      register(values);
    },
    [register]
  );

  useEffect(() => {
    if (isSuccess) {
      message.success('Berhasil daftar, silakan masuk.');
      redirect('/login');
    }
  }, [isSuccess]);

  return (
    <Form
      form={form}
      onFinish={submitHandler}
      layout="vertical"
      className="bg-white dark:bg-gray-900 p-4 sm:p-8 rounded-md w-[90vw] max-w-[400px] shadow-md overflow-auto max-h-[calc(100vh-8rem-40px)]"
    >
      <div className={clsx(step !== 1 ? 'hidden' : '')}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email wajib diisi' },
            {
              type: 'email',
              message: 'Email tidak sesuai',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Username wajib diisi' },
            { min: 4, message: 'Username harus terdiri dari 4−12 karakter' },
            { max: 12, message: 'Username harus terdiri dari 4−12 karakter' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Kata sandi"
          name="password"
          rules={[
            { required: true, message: 'Kata sandi wajib diisi' },
            { min: 8, message: 'Kata sandi harus 8−20 karakter' },
            { max: 20, message: 'Kata sandi harus 8−20 karakter' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Konfirmasi Kata sandi"
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Konfirmasi kata sandi wajib diisi' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Kata sandi tidak sesuai'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className="m-0">
          <Button
            type="primary"
            disabled={!submittable1}
            onClick={nextHandler}
            className="w-full sm:w-fit flex gap-1 items-center justify-center"
          >
            Selanjutnya
          </Button>
          <p>
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#00aeef]">
              Masuk di sini.
            </Link>
          </p>
        </Form.Item>
      </div>
      <div className={clsx(step !== 2 ? 'hidden' : '')}>
        <Form.Item
          label="Nama Lengkap"
          name="name"
          rules={[{ required: true, message: 'Nama wajib diisi' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nomor telepon (tersambung WhatsApp)"
          name="phone"
          rules={[{ required: true, message: 'Nomor telepon wajib diisi' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Alamat lengkap (opsional)" name="address">
          <Input />
        </Form.Item>

        <Form.Item className="m-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={prevHandler}
              className="w-full sm:w-fit flex gap-1 items-center justify-center"
            >
              Kembali
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={step !== 2 || !submittable}
              loading={isLoading}
              className="w-full sm:w-fit"
            >
              Submit
            </Button>
            {error && <p className="text-red-500">{error.message}</p>}
          </div>
          <p>
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#00aeef]">
              Masuk di sini.
            </Link>
          </p>
        </Form.Item>
      </div>
    </Form>
  );
}

{
  /* <>
      {step === 1 && (
        <Register1
          form={form1}
          changeHandler={changeHandler}
          nextHandler={nextHandler}
        />
      )}
      {step === 2 && (
        <Register2
          form={form2}
          changeHandler={changeHandler}
          prevHandler={prevHandler}
          submitHandler={submitHandler}
        />
      )}
    </> */
}
