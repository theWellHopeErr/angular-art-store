import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Art } from './art';

@Component({
  selector: 'app-art',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.css'],
})
export class ArtComponent implements OnInit {
  @Input() art: Art;
  @Output() edit = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
