import * as yup from 'yup';

export const specificJokeParamsSchema = yup.object().shape({
  id: yup.number().required('Id is required').moreThan(0),
});

export const rateJokeBodySchema = yup.object().shape({
  rate: yup.number().required('Rate is required').min(1).max(5),
});

export const commentJokeBodySchema = yup.object().shape({
  content: yup.string().required('Comment is required'),
});

export const addJokeBodySchema = yup.object().shape({
  content: yup.string().required('Content is required'),
  categoryId: yup.number().required('Category id is required').moreThan(0),
});

export const updateJokeBodySchema = yup
  .object()
  .shape({
    content: yup.string(),
    categoryId: yup.number().moreThan(0),
  })
  .test('one-field-required', 'At least one field is required: content or categoryId', function (value) {
    const { content, categoryId } = value || {};
    return !!content || !!categoryId;
  });

export const loginSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const translateJokeBodySchema = yup.object().shape({
  lang: yup.string().required('Lang is required'),
});
