import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../services/course-service';
import { CourseModel } from '../../model/courseModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-admin.html',
  styleUrl: './course-admin.css',
})
export class CourseAdmin {
  mode: 'create' | 'edit' | null = null;

  courseForm: FormGroup;

  loading = false;
  successMessage = '';
  errorMessage = '';

  //opciones de modulo 
  modules: string[] = ['Fullstack', 'Cloud', 'APIs e Integraciones', 'Data Engineer'];

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.courseForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(2)]],
      module: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      duration: [1, [Validators.required, Validators.min(1)]],
    });
  }

  // UI para funciones crear y editar

  selectCreate(): void {
    this.mode = 'create';
    this.resetMessages();
    this.courseForm.reset({ duration: null, id: null });
  }

  selectEdit(): void {
    this.mode = 'edit';
    this.resetMessages();
    this.courseForm.reset({ duration: null, id: null });
  }

  cancel(): void {
    this.mode = null;
    this.resetMessages();
    this.courseForm.reset({ duration: null, id: null });
  }

  //Logica para discriminar flujo

  submit(): void {
    if (!this.mode) return;

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    if (this.mode === 'edit' && !this.courseForm.get('id')?.value) {
      this.courseForm.get('id')?.markAsTouched();
      this.errorMessage = 'Debes ingresar el ID para editar.';
      return;
    }

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.resetMessages();

    const raw = this.courseForm.value;

    // separa id del payload
    const id = Number(raw.id);
    const payload: CourseModel = {
      title: raw.title,
      module: raw.module,
      description: raw.description,
      duration: Number(raw.duration),
    };

    const request$ =
      this.mode === 'create'
        ? this.courseService.createCourse(payload)
        : this.courseService.updateCourse({
            id: id,
            module: payload.module,
            title: payload.title,
            description: payload.description,
            duration: payload.duration,
          });

    request$.subscribe({
      next: () => {
        this.successMessage =
          this.mode === 'edit' ? 'Curso actualizado correctamente.' : 'Curso creado correctamente.';
        this.loading = false;

        // Limpieza simple
        this.courseForm.reset({ duration: null, id: null });
        this.mode = null;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Ocurrió un error al guardar el curso.';
        this.loading = false;
      },
    });
  }

  private resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // getters útiles para el template
  get idCtrl() {
    return this.courseForm.get('id');
  }
  get titleCtrl() {
    return this.courseForm.get('title');
  }
  get moduleCtrl() {
    return this.courseForm.get('module');
  }
  get descriptionCtrl() {
    return this.courseForm.get('description');
  }
  get durationCtrl() {
    return this.courseForm.get('duration');
  }
}
