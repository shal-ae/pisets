import { ListQueryParams } from 'libs/back/core/db/src'

export function addCompanyToQueryParams(
  listQueryParams: ListQueryParams,
  companyId: number | null,
  tableName?: string,
): void {
  const t = tableName ? `${tableName}.` : ''
  let whereClause = listQueryParams.whereClause
  if ( companyId ) {
    whereClause = whereClause
      ? `${whereClause} AND ${t}"companyId" = ${companyId}`
      : `where ${t}"companyId" = ${companyId}`
  } else {
    whereClause = whereClause
      ? `${whereClause} AND ${t}"companyId" IS NULL`
      : `where ${t}"companyId" IS NULL`
  }
  listQueryParams.whereClause = whereClause
}

export function addCompanyToWhereClause(
  whereClause: string,
  table: string,
  companyId: number | null = null,
): string {
  const t = table ? `"${table}".` : ''
  if ( companyId ) {
    return whereClause
      ? `${whereClause} AND ${t}"companyId" = ${companyId}`
      : `where ${t}"companyId" = ${companyId}`
  } else {
    return whereClause
      ? `${whereClause} AND ${t}"companyId" IS NULL`
      : `where ${t}"companyId" IS NULL`
  }
}
