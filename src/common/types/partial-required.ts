export type PartialRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>
