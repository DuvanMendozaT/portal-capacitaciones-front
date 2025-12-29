import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseModel } from '../../model/courseModel';
import { CourseCard, CourseCardAction } from '../course-card/course-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CourseCard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  title = input<string>('Cursos');
  courses = input<CourseModel[]>([]);
  loading = input<boolean>(false);
  errorMsg = input<string>('')

  modules = input<{ label: string; value: string }[]>([
    { label: 'Todos', value: 'ALL' },
    { label: 'Fullstack', value: 'Fullstack' },
    { label: 'APIs e Integraciones', value: 'APIs e Integraciones' },
    { label: 'Cloud', value: 'Cloud' },
    { label: 'Data Engineer', value: 'Data Engineer' },
  ]);
  selectedModule = input<string>('ALL');
  moduleChange = output<string>();


  actions = input<CourseCardAction[]>([]);
  loadingActionForCourseId = input<(courseId?: number) => CourseCardAction | null>(() => null);

  // Eventos de acciones
  add = output<number>();
  edit = output<CourseModel>();
  remove = output<number>();

  onModuleChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    this.moduleChange.emit(select.value);
  }

  trackById(_: number, c: CourseModel): number | undefined {
    return c.id;
  }
  

}

