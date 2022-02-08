import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class EntityClient {
  @PrimaryColumn()
  id: number;

  @Column()
  entityIdentifier: string;

  @Column()
  entityName: string;

  @Column({ nullable: true })
  entityType: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  bankAccount: string;

  @Column({ nullable: true })
  contactPerson: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  isVATRegistered: boolean;

  @Column()
  status: number;

  @Column({ nullable: true })
  dashboardPriority?: number;

  public static CreateNew(
    id: number,
    entityIdentifier: string,
    entityName: string,
    entityType: string,
    description: string,
    bankAccount: string,
    contactPerson: string,
    phoneNumber: string,
    email: string,
    isVATRegistered: boolean,
    status: number,
    dashboardPriority?: number
  ): EntityClient {
    const instance = new EntityClient();
    instance.id = id;
    instance.entityIdentifier = entityIdentifier;
    instance.entityName = entityName;
    instance.entityType = entityType;
    instance.description = description;
    instance.bankAccount = bankAccount;
    instance.contactPerson = contactPerson;
    instance.phoneNumber = phoneNumber;
    instance.email = email;
    instance.isVATRegistered = isVATRegistered;
    instance.status = status;
    instance.dashboardPriority = dashboardPriority;
    return instance;
  }
}
