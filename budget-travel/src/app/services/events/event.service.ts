import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Event } from '../../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(private readonly http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}`);
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}`, event);
  }

  getEventDetails(eventId: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${eventId}`);
  }

  deleteEvent(eventId: string): Observable<Event> {
    return this.http.delete<Event>(`${this.apiUrl}/${eventId}`);
  }

  updateEvent(eventId: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${eventId}`, event);
  }
}
