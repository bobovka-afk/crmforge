import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from '../../../src/common/encryption/encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: unknown) => {
              if (key === 'NODE_ENV') return 'test';
              if (key === 'ENCRYPTION_KEY') return '';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get(EncryptionService);
  });

  it('encrypts and decrypts json payload', () => {
    const payload = { subdomain: 'demo', accessToken: 'token' };
    const encrypted = service.encryptJson(payload);
    expect(service.decryptJson(encrypted)).toEqual(payload);
  });
});
