import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { CourseModel } from '../../model/courseModel';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { CourseCardAction } from '../course-card/course-card';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, Dashboard],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard {
  courses = signal<CourseModel[]>([]);
  loading = signal(false);
  errorMsg = signal('');
  selectedModule = signal('ALL');

  actionCourseId = signal<number | null>(null);
  actionLoading = signal<CourseCardAction | null>(null);

   constructor(
    private courseService: CourseService,
    private auth: Auth,
    private router: Router
  ) {
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

  onModule(value: string): void {
    this.selectedModule.set(value);
    this.loadCourses();
  }

  loadingActionForCourseId = (courseId?: number) => {
    if (!courseId) return null;
    return this.actionCourseId() === courseId ? this.actionLoading() : null;
  };

  addCourse(id: number): void {
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

    this.actionCourseId.set(id);
    this.actionLoading.set('add');

    this.courseService.assignCourseToUser({ userId, courseId: id, status: 0 }).subscribe({
    
      next: () => this.router.navigate(['/profile']),
      error: (err) => {
        if(err.status == 409) {
           this.errorMsg.set('Curso ya asociado al usuario');
        }else{
          this.errorMsg.set('No se pudo agregar el curso.');
        }
        console.error(err);
        this.actionLoading.set(null);
      },
      complete: () => {
        this.actionCourseId.set(null);
        this.actionLoading.set(null);
      },
    });
  }

}
