import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ArtDialogComponent,
  ArtDialogResult,
} from './art-dialog/art-dialog.component';

import { Art } from './art/art';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  inStock = this.store
    .collection('inStock')
    .valueChanges({ idField: 'id' }) as Observable<Art[]>;
  inBidding = this.store
    .collection('inBidding')
    .valueChanges({ idField: 'id' }) as Observable<Art[]>;
  sold = this.store
    .collection('sold')
    .valueChanges({ idField: 'id' }) as Observable<Art[]>;

  // inStock: Art[] = [
  //   {
  //     id: '1',
  //     name: 'Mona Lisa',
  //     artist: 'Leonardo da Vinci',
  //     url:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
  //   },
  //   {
  //     id: '2',
  //     name: 'The Starry Night',
  //     artist: 'Vincent van Gogh',
  //     url:
  //       'https://i.pinimg.com/originals/42/fc/07/42fc0770ab99e52b41dcac3555f47b8e.jpg',
  //   },
  //   {
  //     id: '3',
  //     name: 'The Last Supper',
  //     artist: 'Leonardo da Vinci',
  //     url:
  //       'https://images2.minutemediacdn.com/image/upload/c_crop,h_2645,w_4705,x_185,y_0/f_auto,q_auto,w_1100/v1556743572/shape/mentalfloss/64372-wiki-ldv_the_last_supper_0.jpg',
  //   },
  // ];
  // inBidding: Art[] = [];
  // sold: Art[] = [];

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
}
