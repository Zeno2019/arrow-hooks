import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
  index('./routes/home.tsx'),
  route('hooks/*', './routes/hook-page.tsx'),
] satisfies RouteConfig;
