export function parseApiError(err) {
  if (typeof err === 'string') return err;

  if (err instanceof Error) {
    if (err.status === 422 && Array.isArray(err.errors) && err.errors.length > 0) {
      return err.errors[0].msg;
    }

    return err.message;
  }

  return 'Ocurrió un error desconocido';
}
