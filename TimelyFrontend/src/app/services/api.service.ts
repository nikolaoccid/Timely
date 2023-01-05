import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Log } from '../Log';
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

  getLogs(): Observable<Log[]> {
    return this.http.get<LogApiResponseDto[]>(this.apiUrl).pipe(map(logApiResponsesToLogObjects))
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

  getFileFromApi(): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>('api/Excel', { observe: 'response', responseType: 'blob' as 'json' });
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
