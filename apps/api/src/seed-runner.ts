import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SeedRunner');

  try {
    // Create the NestJS application context
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });

    // Get the SeedService
    const seedService = app.get(SeedService);

    // Parse command line arguments
    const args = process.argv.slice(2);
    const command = args[0] || 'seed';

    switch (command) {
      case 'seed':
        logger.log('Running seeder...');
        await seedService.seedAll();
        break;
      case 'clear':
        logger.log('Clearing seeded data...');
        await seedService.clearAll();
        break;
      case 'refresh':
        logger.log('Refreshing seeded data (clear + seed)...');
        await seedService.clearAll();
        await seedService.seedAll();
        break;
      default:
        logger.error(`Unknown command: ${command}`);
        logger.log('Available commands: seed, clear, refresh');
        process.exit(1);
    }

    // Close the application
    await app.close();
    logger.log('Done!');
    process.exit(0);
  } catch (error) {
    logger.error('Error running seeder:', error);
    process.exit(1);
  }
}

void bootstrap();

