import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CourseModel } from '../../model/courseModel';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  courses = signal<CourseModel[]>([]);
  loading = signal(false);
  errorMsg = signal('');
  addingCourseId = signal<number | null>(null);

  //Seleccion de modulo de cursos
  modules = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Fullstack', value: 'Fullstack' },
    { label: 'APIs e Integraciones', value: 'APIs e Integraciones' },
    { label: 'Cloud', value: 'Cloud' },
    { label: 'Data Engineer', value: 'Data Engineer' },
  ];

  selectedModule = signal('ALL');
  courseForm!: FormGroup;

  constructor(private courseService: CourseService, private auth: Auth, private router : Router) {
    this.loadCourses();
  }

  //metodo para validar rol de usuario
  isNormalUser(): boolean {
    const role = this.auth.getRole(); 
    return role !== 'ADMIN';
  }

  //filter
  onModuleChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;

    this.selectedModule.set(select.value);
    this.loadCourses();
  }

  //Cargar cursos por modulo
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

  //logica asociacion de curso (solo para USER)
  addCourse(courseId?: number): void {
    if (!courseId) return;

    const userIdStr = this.auth.getId();
    if (!userIdStr) {
      this.errorMsg.set('Sesión inválida: no se encontró el usuario.');
      return;
    }

    const userId = Number(userIdStr);
    if (Number.isNaN(userId)) {
      this.errorMsg.set('Sesión inválida: userId no es numérico.');
      return;
    }

    this.addingCourseId.set(courseId);
    this.errorMsg.set('');
    this.courseService.assignCourseToUser({
      userId: Number(this.auth.getId()),
      courseId:courseId,
      status:0
    }).subscribe({
      next: () => {
        this.router.navigate(['/profile'])
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409) {
        this.errorMsg.set('Este curso ya está asociado a tu perfil.');
        return;
      }
        this.errorMsg.set('No se pudo agregar el curso.');
      },
      complete: () => {
        this.addingCourseId.set(null);
      },
    });
  }


  trackById(_: number, c: CourseModel): number | undefined {
    return c.id;
  }
}
