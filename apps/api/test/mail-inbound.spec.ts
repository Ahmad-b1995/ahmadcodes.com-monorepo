import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import mailConfig from '../src/config/mail.config';
import smtpConfig from '../src/config/smtp.config';
import { MailInboundController } from '../src/mail/mail-inbound.controller';
import { MailMessage } from '../src/mail/mail.entity';
import {
  INBOUND_MAX_BODY_LENGTH,
  INBOUND_MAX_SUBJECT_LENGTH,
} from '../src/mail/mail-inbound.constants';
import { MailService } from '../src/mail/mail.service';

describe('POST /mail/inbound', () => {
  const inboundSecret = 'test-inbound-secret-32chars!!';
  let app: NestExpressApplication;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let create: jest.Mock;

  const baseDto = {
    fromAddress: 'sender@example.com',
    toAddresses: ['contact@ahmadcodes.com'],
    subject: 'Hello',
    bodyHtml: '<p>Hi</p>',
    bodyText: 'Hi',
    messageId: '<msg-1@example.com>',
  };

  beforeEach(async () => {
    process.env.INBOUND_MAIL_SECRET = inboundSecret;

    findOne = jest.fn().mockResolvedValue(null);
    save = jest.fn().mockImplementation((entity: MailMessage) =>
      Promise.resolve({
        ...entity,
        id: 42,
      }),
    );
    create = jest.fn().mockImplementation((partial: Partial<MailMessage>) => ({
      ...partial,
    }));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MailInboundController],
      providers: [
        MailService,
        {
          provide: smtpConfig.KEY,
          useValue: {
            host: '',
            port: 587,
            secure: false,
            user: '',
            password: '',
            fromAddress: '',
            fromName: '',
          },
        },
        {
          provide: getRepositoryToken(MailMessage),
          useValue: {
            findOne,
            create,
            save,
          },
        },
        {
          provide: mailConfig.KEY,
          useValue: { inboundSecret },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>({
      bodyParser: false,
    });
    app.useBodyParser('json', { limit: '2mb' });
    app.useBodyParser('urlencoded', { extended: true, limit: '500kb' });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    delete process.env.INBOUND_MAIL_SECRET;
  });

  it('returns 401 without X-Inbound-Secret', async () => {
    await request(app.getHttpServer())
      .post('/mail/inbound')
      .send(baseDto)
      .expect(401);
  });

  it('returns 401 with wrong X-Inbound-Secret', async () => {
    await request(app.getHttpServer())
      .post('/mail/inbound')
      .set('X-Inbound-Secret', 'wrong-secret')
      .send(baseDto)
      .expect(401);
  });

  it('returns 200 and creates received row for valid payload', async () => {
    const res = await request(app.getHttpServer())
      .post('/mail/inbound')
      .set('X-Inbound-Secret', inboundSecret)
      .send(baseDto)
      .expect(200);

    const body = res.body as Pick<
      MailMessage,
      'direction' | 'status' | 'fromAddress'
    >;
    expect(body.direction).toBe('received');
    expect(body.status).toBe('received');
    expect(body.fromAddress).toBe(baseDto.fromAddress);
    expect(save).toHaveBeenCalledTimes(1);
    const callArgs = save.mock.calls as unknown as [MailMessage][];
    const saved = callArgs[0][0];
    expect(saved.direction).toBe('received');
    expect(saved.status).toBe('received');
    expect(saved.receivedAt).toBeDefined();
  });

  it('returns existing row when messageId already exists (idempotent)', async () => {
    const existing: Partial<MailMessage> = {
      id: 7,
      direction: 'received',
      status: 'received',
      messageId: baseDto.messageId,
      fromAddress: 'old@example.com',
      subject: 'Old',
    };
    findOne.mockResolvedValueOnce(existing);

    const res = await request(app.getHttpServer())
      .post('/mail/inbound')
      .set('X-Inbound-Secret', inboundSecret)
      .send(baseDto)
      .expect(200);

    const body = res.body as Pick<MailMessage, 'id' | 'fromAddress'>;
    expect(body.id).toBe(7);
    expect(body.fromAddress).toBe('old@example.com');
    expect(save).not.toHaveBeenCalled();
  });

  it('returns 413 when bodyHtml exceeds max length', async () => {
    const huge = 'a'.repeat(INBOUND_MAX_BODY_LENGTH + 1);
    await request(app.getHttpServer())
      .post('/mail/inbound')
      .set('X-Inbound-Secret', inboundSecret)
      .send({ ...baseDto, bodyHtml: huge, bodyText: 'ok' })
      .expect(413);
  });

  it('returns 413 when subject exceeds max length', async () => {
    const hugeSubject = 's'.repeat(INBOUND_MAX_SUBJECT_LENGTH + 1);
    await request(app.getHttpServer())
      .post('/mail/inbound')
      .set('X-Inbound-Secret', inboundSecret)
      .send({
        ...baseDto,
        subject: hugeSubject,
        messageId: undefined,
      })
      .expect(413);
  });
});
