import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from './task.service';
import { Task } from './task.entity';

describe('TaskService', () => {
  let service: TaskService;
  let repo: jest.Mocked<
    Pick<
      Repository<Task>,
      'create' | 'save' | 'findOne' | 'remove' | 'createQueryBuilder'
    >
  >;

  beforeEach(async () => {
    const qb = {
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    repo = {
      create: jest.fn((x: Partial<Task>) => x as Task),
      save: jest.fn(async (x: Task) => ({ ...x, id: 1 })),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(() => qb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(TaskService);
  });

  it('creates a task with defaults', async () => {
    const dto = {
      type: 'reminder' as const,
      title: 'Follow up',
    };
    const saved = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'reminder',
        title: 'Follow up',
        description: '',
        status: 'draft',
        metadata: {},
      }),
    );
    expect(repo.save).toHaveBeenCalled();
    expect(saved.id).toBe(1);
  });
});
