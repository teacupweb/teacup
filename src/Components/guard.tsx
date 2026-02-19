'use client';
import { useAuth } from '@/AuthProvider';
import React from 'react';

function Guard() {
  const { user } = useAuth();
  console.log(user);
  if (!user) {
    window.location.href = '/auth/login';
  } else if (!user.companyId) {
    window.location.href = '/welcome';
  }
  return <></>;
}

export default Guard;
