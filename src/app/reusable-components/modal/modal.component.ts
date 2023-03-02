import { Component, Input } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  title: any;
  spaceTitle: any = '';
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}
  close(): void {
    this.modalRef.close(this.spaceTitle);
  }
}
