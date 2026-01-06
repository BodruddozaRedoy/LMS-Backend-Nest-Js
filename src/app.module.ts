import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
// 1. Rename your local module to avoid conflict
import { AdminModule as MyLocalAdminModule } from './admin/admin.module';

// 2. Define the authenticate function as shown in the doc
const authenticate = async (email, password) => {
  if (email === 'admin@example.com' && password === 'password') {
    return { email: 'admin@example.com' };
  }
  return null;
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    AuthModule,
    UserModule,
    CourseModule,
    MyLocalAdminModule, // Use renamed local module

    // 3. AdminJS version 7 Dynamic Import
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'complex-password-12345678', // Use a long string
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'complex-password-12345678',
          },
        }),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}