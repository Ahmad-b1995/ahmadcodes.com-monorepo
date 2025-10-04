import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../role/role.entity';

@Injectable()
export class UserSeeder implements OnModuleInit {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('ENABLE_SEEDING', false);
    if (shouldSeed) {
      // Add a small delay to ensure roles are seeded first
      await new Promise((resolve) => setTimeout(resolve, 200));
      await this.seed();
    }
  }

  async seed() {
    this.logger.log('🌱 Seeding users...');

    const usersData = [
      {
        email: 'admin@test.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        roleName: 'admin',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'editor@test.com',
        password: 'password123',
        firstName: 'Editor',
        lastName: 'User',
        roleName: 'editor',
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: 'user@test.com',
        password: 'password123',
        firstName: 'Regular',
        lastName: 'User',
        roleName: 'user',
        isActive: true,
        isEmailVerified: true,
      },
    ];

    for (const userData of usersData) {
      const existing = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existing) {
        const role = await this.roleRepository.findOne({
          where: { name: userData.roleName },
        });

        if (!role) {
          this.logger.error(`❌ Role not found: ${userData.roleName}`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = this.userRepository.create({
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isActive: userData.isActive,
          isEmailVerified: userData.isEmailVerified,
          roles: [role],
        });

        await this.userRepository.save(user);
        this.logger.log(`✅ Created user: ${userData.email} (${userData.roleName})`);
      } else {
        this.logger.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    this.logger.log('✨ Users seeding completed');
  }
}

