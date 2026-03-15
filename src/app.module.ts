import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TeacherModule } from './modules/teachers/teacher.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { GroupsModule } from './modules/groups/groups.module';
import { StudentGroupModule } from './modules/student-group/student-group.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { HomeworksModule } from './modules/homeworks/homeworks.module';
import { LessonVideosModule } from './modules/lesson-videos/lesson-videos.module';
import { HomeworkResponsesModule } from './modules/homework-responses/homework-responses.module';
import { HomeworkResultsModule } from './modules/homework-results/homework-results.module';
import { RatingModule } from './modules/rating/rating.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentModule } from './modules/student/student.module';

@Module({
  imports: [
    UsersModule,
    TeacherModule,
    CoursesModule,
    RoomsModule,
    GroupsModule,
    StudentGroupModule,
    LessonsModule,
    AttendancesModule,
    HomeworksModule,
    LessonVideosModule,
    HomeworkResponsesModule,
    HomeworkResultsModule,
    RatingModule,
    AuthModule,
    StudentModule,
  ],
})
export class AppModule {}
