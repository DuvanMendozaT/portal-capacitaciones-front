import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
export type CourseCardAction = 'add' | 'edit' | 'delete';


type Action = 'add' | 'edit' | 'delete' | 'primary';
type CourseStatus = 'REGISTERED' | 'COMPLETED' | string;


@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css',
})
export class CourseCard {
  @Input({ required: true }) course!: any;

  @Input() actions: Action[] = [];
  @Input() loadingAction: Action | null = null;

  @Input() status?: CourseStatus;
  @Input() primaryLabel = 'Acción';
  @Input() primaryLoadingLabel = 'Cargando...';
  @Input() primaryDisabled = false;

  @Output() add = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  @Output() primary = new EventEmitter<any>();

  has(a: Action) {
    return this.actions?.includes(a);
  }

  isLoading(a: Action) {
    return this.loadingAction === a;
  }

  onAdd() { this.add.emit(this.course.id); }
  onEdit() { this.edit.emit(this.course); }
  onRemove() { this.remove.emit(this.course.id); }

  onPrimary() { this.primary.emit(this.course); }

  statusClass() {
    const s = (this.status || '').toUpperCase();
    if (s === 'REGISTERED') return 'status status-registered';
    if (s === 'COMPLETED') return 'status status-completed';
    return 'status';
  }
}
