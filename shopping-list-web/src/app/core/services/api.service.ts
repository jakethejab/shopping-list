import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, List, Item, Items } from '@core/models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getLists(): Observable<ApiResponse<List[]>> {
    return this.http.get<ApiResponse<List[]>>(`${this.apiUrl}/lists`);
  }

  createList(name: string): Observable<ApiResponse<List>> {
    return this.http.post<ApiResponse<List>>(`${this.apiUrl}/lists`, { name });
  }

  updateList(listId: string, name: string): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/lists/${listId}`, { name });
  }

  deleteList(listId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/lists/${listId}`);
  }

  getItems(listId: string): Observable<ApiResponse<Items>> {
    return this.http.get<ApiResponse<Items>>(`${this.apiUrl}/lists/${listId}/items`);
  }

  createItem(listId: string, name: string): Observable<ApiResponse<Item>> {
    return this.http.post<ApiResponse<Item>>(`${this.apiUrl}/lists/${listId}/items`, { name });
  }

  updateItem(listId: string, itemId: string, name: string, quantity: number, price: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/lists/${listId}/items/${itemId}`, { 
      name,
      quantity,
      price
    });
  }

  deleteItem(listId: string, itemId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/lists/${listId}/items/${itemId}`);
  }

  checkItem(listId: string, itemId: string, checked: boolean): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/lists/${listId}/items/${itemId}/check`, { checked });
  }  
}