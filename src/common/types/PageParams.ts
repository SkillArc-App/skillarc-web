type StringMap<K extends string> = {
  [P in K]: string;
};

export type FixedParams<K extends string> = {
  params: StringMap<K>
}

export type IdParams = FixedParams<'id'>