import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkedInPostService } from './linkedin-post.service';
import { LinkedInPost } from './linkedin-post.entity';

describe('LinkedInPostService', () => {
  let service: LinkedInPostService;
  let repo: jest.Mocked<
    Pick<Repository<LinkedInPost>, 'create' | 'save' | 'findOne' | 'remove'>
  >;

  beforeEach(async () => {
    repo = {
      create: jest.fn((x: Partial<LinkedInPost>) => x as LinkedInPost),
      save: jest.fn(async (x: LinkedInPost) => ({ ...x, id: 1 })),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkedInPostService,
        {
          provide: getRepositoryToken(LinkedInPost),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(LinkedInPostService);
  });

  it('creates a linkedin post with defaults', async () => {
    const dto = { title: 'Launch post' };
    const saved = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Launch post',
        body: '',
        hashtags: [],
        engagement: {},
      }),
    );
    expect(repo.save).toHaveBeenCalled();
    expect(saved.id).toBe(1);
  });
});
