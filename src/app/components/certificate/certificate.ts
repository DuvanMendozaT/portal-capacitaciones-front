import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth/auth';
import { CourseModel } from '../../model/courseModel';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.html',
  styleUrls: ['./certificate.css'],
})
export class Certificate implements OnInit {
  loading = signal(true);
  errorMsg = signal('');

  studentName = signal('Estudiante');
  course = signal<CourseModel | null>(null);
  completedAt = signal<string>('');

  badgeImgUrl = "../../../assets/badges/default.png";

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    console.log(courseId);

    if (!courseId || Number.isNaN(courseId)) {
      this.errorMsg.set('Curso inválido.');
      this.loading.set(false);
      return;
    }

    const fullName = this.auth.getFullName?.();
    if (fullName) this.studentName.set(fullName);

    this.completedAt.set(new Date().toLocaleDateString());

    this.loading.set(true);
    this.errorMsg.set('');

    this.courseService.getCourse(courseId).subscribe({
      next: (data: CourseModel) => {

        this.badgeImgUrl = this.getModuleImage(data.module);

        this.course.set(data ?? null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.course.set(null);
        this.errorMsg.set('No se pudo generar el certificado.');
        this.loading.set(false);
      },
    });
  }

  getModuleImage(module: string): string {
  const moduleMap: Record<string, string> = {
    'Fullstack': "../../../assets/badges/fullstack.png",
    'APIs e Integraciones': "../../../assets/badges/apisIntegracion.png",
    'Cloud': "../../../assets/badges/cloud.png",
    'Data Engineer': "../../../assets/badges/dataEngineer.png",
  };

    return moduleMap[module] ?? '/images/modules/default.png';

  }
}
