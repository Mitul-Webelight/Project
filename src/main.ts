import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { appConfig } from "./config/app.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { swaggerInfo } from "./constants/constants";

async function createNestApp() {
  return NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
}

function swaggerConfig(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle(swaggerInfo.title)
    .setDescription(swaggerInfo.description)
    .setVersion("v1")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);
}

async function bootstrap() {
  const app = await createNestApp();

  app.use(cookieParser());

  swaggerConfig(app);

  const port = appConfig.port ?? 3000;

  await app.listen(port, () => {
    console.log(`listening on port:`, port);
  });
}
bootstrap();
