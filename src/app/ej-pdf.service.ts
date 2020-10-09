import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


const FLASK_SERVER_ADDRESS = 'https://wbg-generator-6dohv3x53q-ew.a.run.app/';

export type FileFormat = 'pdf' | 'docx';

const ext2MIME = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

@Injectable({
    providedIn: 'root'
})
export class EjPdfService {
    constructor(private http: HttpClient) {
    }

    postJson(lawJSON, toc: boolean = false, format: FileFormat = 'pdf' ): Observable<Blob> {
        const httpOptions = {
            headers: new HttpHeaders({
                Accept: ext2MIME[format],
                'Content-Type': 'application/json',
                charset: 'utf-8'
            }),
            responseType: 'blob' as 'json'
        };
        // todo emit url when finished
        return this.http.post<Blob>(FLASK_SERVER_ADDRESS + 'law/',
            {
                law: lawJSON,
                toc,
                format
            },
            httpOptions);
    }
}

