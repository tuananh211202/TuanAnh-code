import { IArticle } from "lib/types/article";

export interface ArticleState {
  persistExpiresAt: any;
  error?: string | null;
  data: Array<IArticle>;
}
export type ContainerState = ArticleState;
