import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth/auth';
import { CourseModel } from '../../model/courseModel';
import { UserCourseModel } from '../../model/UserCourseModel';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  loading = signal(false);
  errorMsg = signal<string>('');
  myCourses = signal<UserCourseModel[]>([]);

  completingId = signal<number | undefined>(undefined);
  constructor(private courseService: CourseService, private auth: Auth) { }

  //filtrar cursos por status
  activeCourses = computed(() => this.myCourses().filter((c) => c.status === 'REGISTERED'));

  completedCourses = computed(() => this.myCourses().filter((c) => c.status === 'COMPLETED'));

  ngOnInit(): void {
    this.loadCourses();
  }

  //Cargue de los cursos asociados a un User (Completado o registrado)
  loadCourses(): void {
    this.loading.set(true);
    this.errorMsg.set('');
    const userIdStr = this.auth.getId();

    if (!userIdStr) {
      throw new Error('User ID no encontrado en sesión');
    }

    const userId = Number(userIdStr);

    this.courseService.getCoursesByUser(userId).subscribe({
      next: (data) => {
        this.myCourses.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.myCourses.set([]);
        this.errorMsg.set('No se pudieron cargar los cursos.');
        this.loading.set(false);
      },
    });
  }

  //Marcar curso como finalizado 
  markAsCompleted(course: CourseModel): void {
    if (!course?.id) return;

    this.completingId.set(course.id);

    this.courseService
      .CompleteCourse({
        userId: Number(this.auth.getId()),
        courseId: course.id,
        status: 1,
      })
      .subscribe({
        next: () => {
          this.myCourses.update((list) =>
            list.map((c) => (c.id === course.id ? { ...c, status: 'COMPLETED' } : c))
          );
          window.open(`/certificate/${course.id}`, '_blank', 'noopener,noreferrer');
          this.completingId.set(undefined);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg.set('No se pudo completar el curso.');
          this.completingId.set(undefined);
        },
      });
  }

  viewBadge(id: number) {
    window.open(`/certificate/${id}`, '_blank', 'noopener,noreferrer');
    this.completingId.set(undefined);
  }

  trackById = (_: number, c: CourseModel) => c.id;
}
