import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

describe('AuthService', () => {
    let service: AuthService;
    let authRepository: jest.Mocked<AuthRepository>;

    const buildService = async (
        overrides?: Partial<AuthRepository>,
        jwtSignImpl?: jest.Mock,
        jwtVerifyImpl?: jest.Mock,
    ) => {
        authRepository = {
            buscarUsuarioPorCorreo: jest.fn(),
            crearUsuario: jest.fn(),
            crearPersona: jest.fn(),
            buscarUsuarioPorId: jest.fn(),
            guardarRefreshToken: jest.fn().mockResolvedValue(undefined),
            buscarRefreshTokenValido: jest.fn(),
            revocarRefreshToken: jest.fn().mockResolvedValue(undefined),
            ...overrides,
        } as any;

        const jwtService = {
            signAsync:
                jwtSignImpl ??
                jest.fn().mockResolvedValue('signed-token-xyz'),
            verifyAsync:
                jwtVerifyImpl ??
                jest.fn().mockResolvedValue({ sub: 1 }),
        } as unknown as JwtService;

        const configService = {
            get: jest.fn().mockReturnValue(undefined),
        } as unknown as ConfigService;

        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: AuthRepository, useValue: authRepository },
                { provide: JwtService, useValue: jwtService },
                { provide: ConfigService, useValue: configService },
            ],
        }).compile();

        service = moduleRef.get(AuthService);
    };

    describe('login', () => {
        it('lanza UnauthorizedException si el usuario no existe', async () => {
            await buildService({
                buscarUsuarioPorCorreo: jest.fn().mockResolvedValue(null),
            });

            await expect(
                service.login({
                    correo_electronico: 'x@y.com',
                    contrasena: '123',
                }),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        });
    });

    describe('refresh', () => {
        it('lanza UnauthorizedException si el refresh token no está en BD', async () => {
            await buildService(
                {
                    buscarRefreshTokenValido: jest.fn().mockResolvedValue(null),
                },
                jest.fn().mockResolvedValue('valid-token'),
            );

            await expect(
                service.refresh({ refresh_token: 'some-token' }),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        });

        it('genera nuevos tokens y revoca el viejo cuando todo es válido', async () => {
            const signAsync = jest
                .fn()
                .mockResolvedValueOnce('new-access')
                .mockResolvedValueOnce('new-refresh');

            await buildService(
                {
                    buscarRefreshTokenValido: jest.fn().mockResolvedValue({
                        id: 10,
                        expires_at: new Date(Date.now() + 60_000),
                        usuario: {
                            id: 1,
                            correo_electronico: 'a@b.com',
                            rol: 'user',
                        },
                    }),
                    revocarRefreshToken: jest.fn().mockResolvedValue(undefined),
                },
                signAsync,
            );

            const result = await service.refresh({ refresh_token: 'old' });

            expect(authRepository.revocarRefreshToken).toHaveBeenCalledWith(10);
            expect(authRepository.guardarRefreshToken).toHaveBeenCalledWith(
                1,
                expect.any(String),
                expect.any(Date),
            );
            expect(result.access_token).toBe('new-access');
            expect(result.refresh_token).toBe('new-refresh');
        });
    });
});