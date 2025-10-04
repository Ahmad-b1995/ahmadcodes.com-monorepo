import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionSeeder implements OnModuleInit {
  private readonly logger = new Logger(PermissionSeeder.name);

  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('ENABLE_SEEDING', false);
    if (shouldSeed) {
      this.logger.log('🚀 Initializing permission seeding...');
      await this.seed();
    }
  }

  async seed() {
    this.logger.log('🌱 Seeding permissions...');

    const permissionsData = [
      // User permissions
      { name: 'create:user', description: 'Create new users' },
      { name: 'read:user', description: 'View user details' },
      { name: 'update:user', description: 'Update user information' },
      { name: 'delete:user', description: 'Delete users' },

      // Role permissions
      { name: 'create:role', description: 'Create new roles' },
      { name: 'read:role', description: 'View role details' },
      { name: 'update:role', description: 'Update role information' },
      { name: 'delete:role', description: 'Delete roles' },

      // Article permissions
      { name: 'create:article', description: 'Create new articles' },
      { name: 'read:article', description: 'View articles' },
      { name: 'update:article', description: 'Update articles' },
      { name: 'delete:article', description: 'Delete articles' },
      { name: 'publish:article', description: 'Publish articles' },
    ];

    for (const permissionData of permissionsData) {
      const existing = await this.permissionRepository.findOne({
        where: { name: permissionData.name },
      });

      if (!existing) {
        const permission = this.permissionRepository.create(permissionData);
        await this.permissionRepository.save(permission);
        this.logger.log(`✅ Created permission: ${permissionData.name}`);
      } else {
        this.logger.log(`⏭️  Permission already exists: ${permissionData.name}`);
      }
    }

    this.logger.log('✨ Permissions seeding completed');
  }
}

