'use client';
// client-boundary-reason: connects the interactive login form hook (validation, mutation, redirect) to the form component.

import type { ReactElement } from 'react';

import { LoginForm } from '../components/login-form.component';
import { useLoginForm } from '../hooks/use-login-form.hook';

export function LoginFormContainer(): ReactElement {
  const viewModel = useLoginForm();

  return <LoginForm viewModel={viewModel} />;
}
