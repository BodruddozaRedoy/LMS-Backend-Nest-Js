import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CourseLevel } from '../course.types';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: CourseLevel.BEGINNER })
  level: string;

  @Prop({ required: true, select: false })
  price: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
