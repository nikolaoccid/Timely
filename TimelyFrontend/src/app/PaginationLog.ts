import { Log } from "./Log";

export interface PaginationLog {
  items: Log[];
  currentPage: number;
  totalLogCount: number;
  totalNumberOfPages: number;
}
