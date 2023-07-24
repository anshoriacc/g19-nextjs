import React, { useCallback, useEffect, useMemo } from 'react';
import { useUpdateReservationMutation } from '@/redux/reducers/reservationQuery';
import { Modal, Select, message } from 'antd';
import { useAppSelector } from '@/hooks';

type Props = {
  id: string;
  status:
    | 'pending'
    | 'paid'
    | 'confirmed'
    | 'on going'
    | 'finished'
    | 'cancelled';
};

export default function ActionReservation({ id, status }: Props) {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [modal, contextHolder] = Modal.useModal();

  const [updateReservation, { isLoading, error, isSuccess, reset }] =
    useUpdateReservationMutation();

  const confirmHandler = useCallback((value: string) => {
    modal.confirm({
      title: 'Ubah status',
      content: `Apakah anda yakin ingin mengubah status reservasi menjadi ${
        value === 'confirmed'
          ? 'terkonfirmasi'
          : value === 'finished'
          ? 'selesai'
          : value === 'cancelled'
          ? 'dibatalkan'
          : value
      }?`,
      okText: 'Ya',
      cancelText: 'Batal',
      onOk: () => {
        updateReservation({ accessToken, reservationId: id, status: value });
      },
      okButtonProps: { loading: isLoading },
    });
  }, []);

  useEffect(() => {
    if (error) message.error('Gagal mengubah status reservasi');
    if (isSuccess) {
      message.success('Berhasil update status reservasi.');
      reset();
    }
  }, [error, isSuccess]);

  return (
    <>
      <Select
        placeholder="ubah status"
        onChange={(value) => confirmHandler(value)}
        disabled={isLoading}
        loading={isLoading}
        options={[
          {
            value: 'confirmed',
            label: 'Konfirmasi',
            disabled:
              status === 'confirmed' ||
              status === 'on going' ||
              status === 'finished' ||
              status === 'cancelled',
          },
          {
            value: 'on going',
            label: 'On going',
            disabled:
              status === 'on going' ||
              status === 'finished' ||
              status === 'cancelled',
          },
          {
            value: 'finished',
            label: 'Selesai',
            disabled: status === 'finished' || status === 'cancelled',
          },
          {
            value: 'cancelled',
            label: 'Batalkan',
            disabled: status === 'cancelled',
          },
        ]}
        size="small"
      />
      {contextHolder}
    </>
  );
}
