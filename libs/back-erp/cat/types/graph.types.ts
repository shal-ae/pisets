export class Graph<T> {
  tree: GraphTreeItem
  items: T[]
}

export class GraphItem {
  id: number
  type: number
  parentId: number | null
}

export class GraphTreeItem extends GraphItem {
  children: GraphTreeItem[]
}

export type SelectGraphParams = {
  ids: number[]
}
