'use client';

import React, { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';

const typePath = ['rental', 'tour'];

export default function Product() {
  const params = useParams();
  const { type } = params;

  useEffect(() => {
    if (!typePath.includes(type)) notFound();
  }, [type]);

  return <div>{type}</div>;
}
