import { IsString, IsNotEmpty } from "class-validator";

export class UpdateTaskAssigneeDto {
  @IsString()
  @IsNotEmpty()
  assigneeId!: string;
}
