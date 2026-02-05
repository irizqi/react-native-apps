
import { ApiRoute } from '@monoriz/api';

export const apiRoutes = new ApiRoute({
    // Simple routes
    getUsers: '/users',
    getAllProducts: '/products',

    // Named parameters with :param
    getUser: { path: '/users/:id', params: ['id'] },
    updateUser: { path: '/users/:id', params: ['id'] },
    deleteUser: { path: '/users/:id', params: ['id'] },

    // Named parameters with {param}
    getProduct: { path: '/products/{id}', params: ['id'] },

    // Multiple named parameters
    getUserPost: {
        path: '/users/:userId/posts/:postId',
        params: ['userId', 'postId']
    },
    getPostComment: {
        path: '/posts/:postId/comments/:commentId',
        params: ['postId', 'commentId']
    },

    // Legacy positional parameters
    getCategory: '/categories/$0',
    getCategoryProduct: '/categories/$0/products/$1',

    // Auth routes
    login: '/auth/login',
    resetPassword: { path: '/auth/reset-password/:token', params: ['token'] },
}, 'https://api.example.com');