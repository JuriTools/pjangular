import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileFormat} from '../../ej-pdf.service';

export interface PdfDialogData {
    toc: boolean;
    format: FileFormat;
}

@Component({
    selector: 'app-pdf-dialog',
    templateUrl: './pdf-dialog.component.html',
    styleUrls: ['./pdf-dialog.component.scss']
})
export class PdfDialogComponent implements OnInit {


    constructor(
        public dialogRef: MatDialogRef<PdfDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PdfDialogData
    ) {
    }

    ngOnInit(): void {
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    set format(format: string) {
        this.data.format = format as FileFormat;
    }

    get format(): string {
        return this.data.format as string;
    }
}
