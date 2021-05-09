import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  ArtDialogComponent,
  ArtDialogResult,
} from '../art-dialog/art-dialog.component';

import { Art } from '../art/art';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {}

  inStock = this.store
    .collection('inStock')
    .valueChanges({ idField: 'id' }) as Observable<Art[]>;
  inBidding = this.store
    .collection('inBidding')
    .valueChanges({ idField: 'id' }) as Observable<Art[]>;
  sold = this.store
    .collection('sold')
    .valueChanges({ idField: 'id' }) as Observable<Art[]>;

  drop(event: CdkDragDrop<Art[]>): void {
    if (event.previousContainer === event.container) return;

    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      return Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  edit(list: 'inStock' | 'inBidding' | 'sold', art: Art): void {
    const dialogRef = this.dialog.open(ArtDialogComponent, {
      width: '500px',
      data: {
        art,
        enableDelete: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: ArtDialogResult) => {
      if (result.delete) {
        this.store.collection(list).doc(art.id).delete();
      } else {
        this.store.collection(list).doc(art.id).update(art.id);
      }
    });
  }

  newArt(): void {
    const dialogRef = this.dialog.open(ArtDialogComponent, {
      width: '500px',
      data: {
        art: [],
      },
    });

    dialogRef.afterClosed().subscribe((result: ArtDialogResult) => {
      const res = {
        name: result.art.name,
        artist: result.art.artist,
        url: result.art.url,
      };
      this.store.collection('inStock').add(res);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
