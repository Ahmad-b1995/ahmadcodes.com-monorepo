import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Role } from './role.entity';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class RoleSeeder implements OnModuleInit {
  private readonly logger = new Logger(RoleSeeder.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('ENABLE_SEEDING', false);
    if (shouldSeed) {
      // Add a small delay to ensure permissions are seeded first
      await new Promise((resolve) => setTimeout(resolve, 100));
      await this.seed();
    }
  }

  async seed() {
    this.logger.log('🌱 Seeding roles...');

    // Define roles with their permissions
    const rolesData = [
      {
        name: 'admin',
        description: 'Administrator with full access',
        permissions: [
          'create:user', 'read:user', 'update:user', 'delete:user',
          'create:role', 'read:role', 'update:role', 'delete:role',
          'create:article', 'read:article', 'update:article', 'delete:article', 'publish:article',
        ],
      },
      {
        name: 'editor',
        description: 'Content editor with article management access',
        permissions: [
          'create:article', 'read:article', 'update:article', 'delete:article', 'publish:article',
        ],
      },
      {
        name: 'user',
        description: 'Regular user with basic access',
        permissions: ['read:article'],
      },
    ];

    for (const roleData of rolesData) {
      const existing = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions'],
      });

      if (!existing) {
        // Find permissions
        const permissions = await this.permissionRepository
          .createQueryBuilder('permission')
          .where('permission.name IN (:...names)', { names: roleData.permissions })
          .getMany();

        const role = this.roleRepository.create({
          name: roleData.name,
          description: roleData.description,
          permissions,
        });

        await this.roleRepository.save(role);
        this.logger.log(`✅ Created role: ${roleData.name} with ${permissions.length} permissions`);
      } else {
        this.logger.log(`⏭️  Role already exists: ${roleData.name}`);
      }
    }

    this.logger.log('✨ Roles seeding completed');
  }
}

