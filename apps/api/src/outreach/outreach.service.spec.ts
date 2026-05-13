import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutreachService } from './outreach.service';
import { OutreachContact } from './outreach.entity';

describe('OutreachService', () => {
  let service: OutreachService;
  let repo: jest.Mocked<
    Pick<
      Repository<OutreachContact>,
      'create' | 'save' | 'findOne' | 'remove' | 'createQueryBuilder'
    >
  >;

  beforeEach(async () => {
    const qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    repo = {
      create: jest.fn((x: Partial<OutreachContact>) => x as OutreachContact),
      save: jest.fn(async (x: OutreachContact) => ({ ...x, id: 1 })),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(() => qb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutreachService,
        {
          provide: getRepositoryToken(OutreachContact),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(OutreachService);
  });

  it('creates an outreach contact with defaults', async () => {
    const dto = { name: 'Alex', source: 'linkedin' as const };
    const saved = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alex',
        source: 'linkedin',
        company: '',
        role: '',
        email: '',
        status: 'queued',
        notes: '',
        tags: [],
      }),
    );
    expect(repo.save).toHaveBeenCalled();
    expect(saved.id).toBe(1);
  });
});
