import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     ProductsModule,
//     PrismaModule,
//   ],
// })
@Module({
  imports: [ProductsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
