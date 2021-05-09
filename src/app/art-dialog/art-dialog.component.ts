import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Art } from '../art/art';

@Component({
  selector: 'app-art-dialog',
  templateUrl: './art-dialog.component.html',
  styleUrls: ['./art-dialog.component.css'],
})
export class ArtDialogComponent {
  private backupArt: Partial<Art> = { ...this.data.art };
  constructor(
    public dialogRef: MatDialogRef<ArtDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArtDialogData
  ) {}

  cancel(): void {
    this.data.art.name = this.backupArt.name;
    this.data.art.artist = this.backupArt.artist;
    this.data.art.url = this.backupArt.url;
    this.dialogRef.close(this.data);
  }
}

export interface ArtDialogData {
  art: Art;
  enableDelete: boolean;
}

export interface ArtDialogResult {
  art: Art;
  delete?: boolean;
}
