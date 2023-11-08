import {
  DynamicModule,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { ClientProxy, ClientTCP, Closeable } from '@nestjs/microservices';
import {
  ClientProviderOptions,
  ClientsModuleOptionsFactory,
  ClientsProviderAsyncOptions,
} from './interfaces';
import { GENERAL } from 'src/const/general.const';
import { UserService } from './user.service';

@Module({})
export class UserModule {
  static register(clientOptions: ClientProviderOptions): DynamicModule {
    const client = {
      provide: GENERAL.CLIENT.USER,
      useValue: this.assignOnAppShutdownHook(new ClientTCP(clientOptions)),
    };
    return {
      global: clientOptions.glogal,
      module: UserModule,
      providers: [client, UserService],
      exports: [UserService],
    };
  }

  static registerAsync(option: ClientsProviderAsyncOptions): DynamicModule {
    return {
      global: option.global,
      module: UserModule,
      imports: option.imports,
      providers: [
        ...this.createAsyncProviders(option).concat(
          option.extraProviders || [],
        ),
        UserService,
      ],
      exports: [UserService],
    };
  }

  private static createAsyncProviders(
    options: ClientsProviderAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: ClientsProviderAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: GENERAL.CLIENT.USER,
        useFactory: this.createFactoryWrapper(options.useFactory),
        inject: options.inject || [],
      };
    }
    return {
      provide: GENERAL.CLIENT.USER,
      useFactory: this.createFactoryWrapper(
        (optionsFactory: ClientsModuleOptionsFactory) =>
          optionsFactory.createClientOptions(),
      ),
      inject: [options.useExisting || options.useClass],
    };
  }

  private static createFactoryWrapper(
    useFactory: ClientsProviderAsyncOptions['useFactory'],
  ) {
    return async (...args: any[]) => {
      const clientOptions = await useFactory(...args);
      const clientProxyRef = new ClientTCP(clientOptions);
      return this.assignOnAppShutdownHook(clientProxyRef);
    };
  }

  private static assignOnAppShutdownHook(
    client: ClientProxy & Closeable,
  ): ClientProxy & Closeable {
    (client as unknown as OnApplicationShutdown).onApplicationShutdown =
      client.close;
    return client;
  }
}
