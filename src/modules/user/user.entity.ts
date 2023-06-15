import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/common.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})


export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true, default: '' })
  public firstName: string;

  @prop({ required: true, default: '' })
  public lastName: string;

  @prop({required: true, default: ''})
  private password?: string;

  @prop({required: false, default: ''})
  public avatarPath: string;

  constructor(userData: User) {
    super();
    this.email = userData.email;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.avatarPath = userData.avatarPath;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}


export const UserModel = getModelForClass(UserEntity);
