export type PersonSearchValue = {
  searchTerms: string
  attributeFilters: {
    [key: string]: string[]
  }
}