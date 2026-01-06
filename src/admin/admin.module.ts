import { Module } from '@nestjs/common';
import { AdminModule as AdminJSModule } from '@adminjs/nestjs';
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserModule } from 'src/user/user.module';
import { CourseModule } from 'src/course/course.module';
import { User } from 'src/user/schemas/user.schema';
import { Course } from 'src/course/schemas/course.schema';

AdminJS.registerAdapter(AdminJSMongoose);

@Module({
  imports: [
    UserModule, // This brings in UserModel
    CourseModule, // This brings in CourseModel
    AdminJSModule.createAdminAsync({
      // We use strings here to match exactly what Nest is looking for
      inject: [getModelToken(User.name), getModelToken(Course.name)],
      useFactory: (userModel: Model<User>, courseModel: Model<Course>) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            {
              resource: userModel,
              options: { navigation: { name: 'Users', icon: 'User' } },
            },
            {
              resource: courseModel,
              options: { navigation: { name: 'Courses', icon: 'Book' } },
            },
          ],
        },
        auth: {
          authenticate: async (email, password) => {
            const user = await userModel.findOne({ email }).select('+password');
            if (user && user.password) {
              const matched = await bcrypt.compare(password, user.password);
              if (matched) return user;
            }
            return null;
          },
          cookieName: 'adminjs-session',
          cookiePassword: 'a-long-password-at-least-32-characters-long',
        },
      }),
    }),
  ],
})
export class AdminModule {}
