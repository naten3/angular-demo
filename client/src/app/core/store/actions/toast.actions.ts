export const SUCCESS_TOAST = '[Toast] SUCCESS';
export const FAIL_TOAST = '[Toast] FAIL';

export const successToast = (content: string, title: string | null = null) => {
  return { type: SUCCESS_TOAST, payload: { content, title } };
};

export const faillToast = (content: string, title: string | null = null) => {
  return { type: FAIL_TOAST, payload: { content, title } };
};
