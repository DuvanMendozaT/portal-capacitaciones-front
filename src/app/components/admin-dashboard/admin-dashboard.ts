import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dashboard } from '../dashboard/dashboard';
import { CourseModel } from '../../model/courseModel';
import { CourseService } from '../../services/course-service';
import { CourseCardAction } from '../course-card/course-card';

type CourseFormValue = {
  title: string;
  module: string;
  description: string;
  duration: number;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Dashboard],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  courses = signal<CourseModel[]>([]);
  loading = signal(false);
  errorMsg = signal('');
  selectedModule = signal('ALL');

  cardActions = computed<CourseCardAction[]>(() => ['edit', 'delete']);
  actionCourseId = signal<number | null>(null);
  actionLoading = signal<CourseCardAction | null>(null);

  showForm = signal(false);
  mode = signal<'create' | 'edit'>('create');
  editingId = signal<number | null>(null);
  
  courseForm!: FormGroup;


  constructor(private courseService: CourseService, private fb: FormBuilder) {
    this.loadCourses();
    this.courseForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    module: ['Fullstack', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    duration: [1, [Validators.required, Validators.min(1)]],
  });
  }

  onModuleChange(module: string): void {
    this.selectedModule.set(module);
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.errorMsg.set('');

    this.courseService.getCourses(this.selectedModule()).subscribe({
      next: (data) => {
        this.courses.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.courses.set([]);
        this.errorMsg.set('No se pudieron cargar los cursos.');
        this.loading.set(false);
      },
    });
  }

  loadingActionForCourseId = (courseId?: number): CourseCardAction | null => {
    if (!courseId) return null;
    return this.actionCourseId() === courseId ? this.actionLoading() : null;
  };

  openCreate(): void {
    this.mode.set('create');
    this.editingId.set(null);
    this.courseForm.reset({ title: '', module: 'Fullstack', description: '', duration: 1 });
    this.showForm.set(true);
  }

  openEdit(course: CourseModel): void {
    if (!course.id) return;

    this.mode.set('edit');
    this.editingId.set(course.id);
    this.courseForm.reset({
      title: course.title ?? '',
      module: course.module ?? 'Fullstack',
      description: course.description ?? '',
      duration: course.duration ?? 1,
    });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.errorMsg.set('');
  }
  
  submit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const value: CourseFormValue = this.courseForm.getRawValue();

    const payload: CourseModel = {
      id: this.mode() === 'edit' ? this.editingId()! : undefined,
      title: value.title,
      module: value.module,
      description: value.description,
      duration: value.duration,
    };

    if (this.mode() === 'create') {
      this.loading.set(true);
      this.courseService.createCourse(payload).subscribe({
        next: () => {
          this.showForm.set(false);
          this.loadCourses();
        },
        error: (err) => {
          console.error(err);
          this.errorMsg.set('No se pudo crear el curso.');
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
      return;
    }

    const id = this.editingId();
    if (!id) return;

    this.actionCourseId.set(id);
    this.actionLoading.set('edit');

    this.courseService.updateCourse(payload).subscribe({
      next: () => {
        this.showForm.set(false);
        this.loadCourses();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo editar el curso.');
      },
      complete: () => {
        this.actionCourseId.set(null);
        this.actionLoading.set(null);
      },
    });
  }

  deleteCourse(id: number): void {
    this.actionCourseId.set(id);
    this.actionLoading.set('delete');

    this.courseService.deleteCourse(id).subscribe({
      next: () => this.loadCourses(),
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo eliminar el curso.');
      },
      complete: () => {
        this.actionCourseId.set(null);
        this.actionLoading.set(null);
      },
    });
  }


}
