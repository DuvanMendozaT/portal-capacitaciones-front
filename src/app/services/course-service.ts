import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseModel } from '../model/courseModel';
import { UserCourseRequest } from '../model/dto/UserCourseRequest';
import { UserCourseModel } from '../model/UserCourseModel';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

   private readonly baseUrl = `${environment.apiUrl}`;


  constructor(private http: HttpClient) {}

  //metodo para consulta de cursos (todos o por modulo)
  getCourses(module?: string): Observable<CourseModel[]> {
    const url =
      module && module !== 'ALL'
        ? `${this.baseUrl}/courses/all/${encodeURIComponent(module)}`
        : this.baseUrl + '/courses/all';

    return this.http.get<CourseModel[]>(url);
  }
  // consulta de curso por id
  getCourse(courseId: number): Observable<CourseModel> {
    return this.http.get<CourseModel>(this.baseUrl + '/courses/' + courseId);
  }
  //actualizacion de cursp
  updateCourse(request: CourseModel): Observable<CourseModel> {
    return this.http.put<CourseModel>(this.baseUrl + '/courses/update', request);
  }
  //creacion de cursp
  createCourse(request: CourseModel): Observable<CourseModel> {
    return this.http.post<CourseModel>(this.baseUrl + '/courses/create', request);
  }
  //Consulta de cursos registrados por user
  getCoursesByUser(id: number ): Observable<UserCourseModel[]> {
    const url =`${this.baseUrl}/courses/user/${encodeURIComponent(Number(id))}`
    return this.http.get<UserCourseModel[]>(url);
  }

  //asociar curso a estudiante
  assignCourseToUser(request: UserCourseRequest){
    console.log(request)
    return this.http.post<void>(this.baseUrl + '/usercourse/create', request)
  }

  //Cambio de estado para curso registrado
  completeCourse(request: UserCourseRequest){
    return this.http.post<void>(this.baseUrl + '/usercourse/update', request)
  }
  
  //eliminar curso
  deleteCourse(id: number){
    return this.http.delete<void>(this.baseUrl + '/courses/' + id)
  }
}
