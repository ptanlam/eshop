export interface GetReactionsForTargetResponse {
  reactions: Array<{
    id: string;
    targetId: string;
    ownerId: string;
    type: number;
  }>;
}
