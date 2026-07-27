import { useCallback } from 'react';

import { useAppZodForm } from '@/packages/forms';
import { useAppTranslation } from '@/packages/i18n';
import { useAppNavigation } from '@/packages/navigation';
import { showToast, ToastType } from '@/packages/toast';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';
import { buildLocalizedPath, resolvePathLocale } from '@/shared/helpers/localized-route.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { AUTH_MESSAGE_KEYS } from '../constants/auth-message-keys.constants';
import { LOGIN_FIELD_IDS, LOGIN_FORM_DEFAULT_VALUES } from '../constants/auth.constants';
import { useLoginMutation } from '../queries/auth.mutations';
import { loginFormSchema } from '../schemas/auth.schema';
import { useAuthStore } from '../store/auth.store';
import type { LoginFormValues, LoginFormViewModel } from '../types/auth.types';

/**
 * Orchestration: schema-validated form + login mutation + session store +
 * toast + redirect. Validation messages arrive as i18n keys from the schema
 * and are translated here before display.
 */
export function useLoginForm(): LoginFormViewModel {
  const t = useAppTranslation(I18N_NAMESPACES.auth);
  const navigation = useAppNavigation();
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useLoginMutation();
  const form = useAppZodForm<LoginFormValues>({
    schema: loginFormSchema,
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
  });

  const mutate = mutation.mutate;
  const handleValidSubmit = useCallback(
    (values: LoginFormValues) => {
      mutate(values, {
        onSuccess: (session) => {
          setSession(session);
          showToast({ type: ToastType.Success, message: t(AUTH_MESSAGE_KEYS.success) });
          navigation.push(
            buildLocalizedPath(resolvePathLocale(navigation.pathname), ROUTE_PATHS.home),
          );
        },
      });
    },
    [mutate, setSession, navigation, t],
  );

  const emailErrorKey = form.formState.errors.email?.message;
  const passwordErrorKey = form.formState.errors.password?.message;
  const submitForm = form.handleSubmit(handleValidSubmit);
  const onSubmit = useCallback(
    (event: Parameters<LoginFormViewModel['onSubmit']>[0]) => {
      void submitForm(event);
    },
    [submitForm],
  );

  return {
    title: t(AUTH_MESSAGE_KEYS.loginTitle),
    subtitle: t(AUTH_MESSAGE_KEYS.loginSubtitle),
    submitLabel: mutation.isPending ? t(AUTH_MESSAGE_KEYS.submitting) : t(AUTH_MESSAGE_KEYS.submit),
    isSubmitting: mutation.isPending,
    formError: mutation.isError ? t(AUTH_MESSAGE_KEYS.genericError) : null,
    email: {
      fieldId: LOGIN_FIELD_IDS.email,
      label: t(AUTH_MESSAGE_KEYS.emailLabel),
      error: emailErrorKey ? t(emailErrorKey) : undefined,
      testId: TEST_IDS.loginEmail,
      inputProps: form.register('email'),
    },
    password: {
      fieldId: LOGIN_FIELD_IDS.password,
      label: t(AUTH_MESSAGE_KEYS.passwordLabel),
      error: passwordErrorKey ? t(passwordErrorKey) : undefined,
      testId: TEST_IDS.loginPassword,
      inputProps: form.register('password'),
    },
    onSubmit,
  };
}
