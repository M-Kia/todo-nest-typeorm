import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';
import { stringToHash } from 'src/helpers/string.helpers';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  beforeInsert(event: InsertEvent<User>): void | Promise<any> {
    const user = event.entity;
    user.password = stringToHash(user.password);
  }

  beforeUpdate(event: UpdateEvent<User>): void | Promise<any> {
    if (
      event.updatedColumns.find(
        (item) => item.propertyName,
        User.prototype.password,
      )
    ) {
      const password = stringToHash(event.entity.password);
      event.entity.password = password;
    }
  }
}
