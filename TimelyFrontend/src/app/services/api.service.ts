import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Log } from '../Log';
import { PaginationLog } from '../PaginationLog';
import { toUTCDate } from '../utils/toUTCDate';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api/Logs';

  constructor(private http: HttpClient) { }

  getPaginationLogs(page: number) {
    return this.http.get<LogApiPaginationResponseDto>(this.apiUrl + `/pagination?page=${page}`).pipe(map(LogApiPaginationResponseToPaginationLogObject));
  }

  getLogs(): Observable<Log[]> {
    return this.http.get<LogApiResponseDto[]>(this.apiUrl).pipe(map(logApiResponsesToLogObjects));
  }

  addLog(log: Log): Observable<Log> {
    return this.http.post<LogApiResponseDto>(this.apiUrl, log, httpOptions).pipe(map(logApiResponseToLogObject));
  }

  getLog(id: number): Observable<Log> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<LogApiResponseDto>(url).pipe(map(logApiResponseToLogObject));
  }

  deleteLog(log: Log): Observable<Log> {
    const url = `${this.apiUrl}/${log.id}`;
    return this.http.delete<Log>(url);
  }

  editLog(log): Observable<Log> {

    log.startDateTime = toUTCDate(log.startDateTime);
    log.endDateTime = toUTCDate(log.endDateTime);
    const url = `${this.apiUrl}/${log.id}`
    return this.http.put<Log>(url, log, httpOptions)
  }

}

interface LogApiResponseDto {
  id?: number;
  projectName?: string;
  startDateTime?: string;
  endDateTime?: string;
}

function logApiResponsesToLogObjects(logs: LogApiResponseDto[]): Log[] {
  return logs.map(logApiResponseToLogObject);
}

function logApiResponseToLogObject(log: LogApiResponseDto): Log {
  return ({
    id: log.id,
    projectName: log.projectName,
    endDateTime: new Date(log.endDateTime ?? ''),
    startDateTime: new Date(log.startDateTime ?? ''),
  });
}

interface LogApiPaginationResponseDto {
  items: LogApiResponseDto[];
  currentPage: number;
  totalLogCount: number;
  totalNumberOfPages: number;
}


function LogApiPaginationResponseToPaginationLogObject(res: LogApiPaginationResponseDto): PaginationLog {
  return ({
    items: res.items ? logApiResponsesToLogObjects(res.items): [],
    currentPage: res.currentPage,
    totalLogCount: res.totalLogCount,
    totalNumberOfPages: res.totalNumberOfPages
    })
}
