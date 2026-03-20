import { ValidationPipe } from '@nestjs/common';

export const useValidationPipes = () => {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableCircularCheck: true,
    },
  });
};
