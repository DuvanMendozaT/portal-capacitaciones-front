import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseModel } from '../model/courseModel';
import { UserCourseRequest } from '../model/dto/UserCourseRequest';
import { UserCourseModel } from '../model/UserCourseModel';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly baseUrl = 'http://localhost:8080';
  //private readonly baseUrl = 'https://portal-capacitaciones-back.onrender.com';

  constructor(private http: HttpClient) {}

  getCourses(module?: string): Observable<CourseModel[]> {
    const url =
      module && module !== 'ALL'
        ? `${this.baseUrl}/courses/all/${encodeURIComponent(module)}`
        : this.baseUrl + '/courses/all';

    return this.http.get<CourseModel[]>(url);
  }
  getCourse(courseId: number): Observable<CourseModel> {
    return this.http.get<CourseModel>(this.baseUrl + '/courses/' + courseId);
  }


  updateCourse(request: CourseModel): Observable<CourseModel> {
    return this.http.put<CourseModel>(this.baseUrl + '/courses/update', request);
  }
  createCourse(request: CourseModel): Observable<CourseModel> {
    return this.http.post<CourseModel>(this.baseUrl + '/courses/create', request);
  }

  getCoursesByUser(id: number ): Observable<UserCourseModel[]> {
    const url =`${this.baseUrl}/courses/user/${encodeURIComponent(Number(id))}`
    return this.http.get<UserCourseModel[]>(url);
  }

  assignCourseToUser(request: UserCourseRequest){
    return this.http.post<void>(this.baseUrl + '/usercourse/create', request)
  }

  completeCourse(request: UserCourseRequest){
    return this.http.post<void>(this.baseUrl + '/usercourse/update', request)
  }

  deleteCourse(id: number){
    return this.http.delete<void>(this.baseUrl + '/courses/' + id)
  }
}
