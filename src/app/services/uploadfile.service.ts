import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UploadService {

    constructor(private http: HttpClient) { }

    uploadFile(file: File, id: string, type: string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file); // Make sure this matches the multer field name
        formData.append('id', id);
        formData.append('type', type);

        return this.http.post(`${environment.API_URL}/upload`, formData);
    }
}
