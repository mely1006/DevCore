import { getWorkById } from './api';

export async function requestWork(id: string) {
  return getWorkById(id);
}
