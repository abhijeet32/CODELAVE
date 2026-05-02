import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DockerService } from './docker.service';

describe('DockerService', () => {
  let service: DockerService;

  beforeEach(async () => {
    const configService = {
      get: jest.fn((key: string, def?: any) => {
        if (key === 'DOCKER_HOST') return 'tcp://localhost:2376';
        return def;
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [DockerService, { provide: ConfigService, useValue: configService }],
    }).compile();
    service = module.get<DockerService>(DockerService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  it('should parse memory limits correctly', () => {
    // Access private method via any
    const parse = (service as any).parseMemoryLimit.bind(service);
    expect(parse('256m')).toBe(256 * 1024 * 1024);
    expect(parse('1g')).toBe(1024 * 1024 * 1024);
    expect(parse('512k')).toBe(512 * 1024);
  });

  it('should build correct exec commands', () => {
    const build = (service as any).buildExecCommand.bind(service);
    expect(build('print("hi")', 'python')).toEqual(['python3', '-c', 'print("hi")']);
    expect(build('console.log(1)', 'javascript')).toEqual(['node', '-e', 'console.log(1)']);
    expect(build('echo hi', 'bash')).toEqual(['sh', '-c', 'echo hi']);
    expect(build('puts "hi"', 'ruby')).toEqual(['ruby', '-e', 'puts "hi"']);
  });

  it('should sanitize error messages', () => {
    const sanitize = (service as any).sanitizeErrorMessage.bind(service);
    expect(sanitize('Error at tcp://192.168.1.1:2376')).not.toContain('192.168.1.1');
  });

  it('ping should return false when daemon unreachable', async () => {
    const result = await service.ping();
    expect(result).toBe(false);
  });
});
