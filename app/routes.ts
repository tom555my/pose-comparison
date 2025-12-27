import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/party.tsx'),
	route('api/compare', 'routes/api.compare.ts'),
] satisfies RouteConfig;
