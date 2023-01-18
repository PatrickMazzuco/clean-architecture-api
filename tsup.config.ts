import { defineConfig } from 'tsup';

export default defineConfig({
  tsconfig: 'tsconfig.build.json',
  entry: ['src', '!src/**/*.spec.*', '!src/**/*.test.*'],
  silent: true,
  clean: true,
  minify: true,
  splitting: false
});
