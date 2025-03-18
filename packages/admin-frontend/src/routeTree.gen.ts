/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as AuthLogoutIndexImport } from './routes/auth/logout.index'
import { Route as AuthLoginIndexImport } from './routes/auth/login.index'
import { Route as LayoutUserIndexImport } from './routes/_layout/user/index'
import { Route as LayoutTransactionIndexImport } from './routes/_layout/transaction/index'
import { Route as LayoutCurrencyIndexImport } from './routes/_layout/currency/index'
import { Route as LayoutUserManageImport } from './routes/_layout/user/manage'
import { Route as LayoutUserUserIdEditImport } from './routes/_layout/user/$userId.edit'

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const AuthLogoutIndexRoute = AuthLogoutIndexImport.update({
  id: '/auth/logout/',
  path: '/auth/logout/',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginIndexRoute = AuthLoginIndexImport.update({
  id: '/auth/login/',
  path: '/auth/login/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutUserIndexRoute = LayoutUserIndexImport.update({
  id: '/user/',
  path: '/user/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTransactionIndexRoute = LayoutTransactionIndexImport.update({
  id: '/transaction/',
  path: '/transaction/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutCurrencyIndexRoute = LayoutCurrencyIndexImport.update({
  id: '/currency/',
  path: '/currency/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUserManageRoute = LayoutUserManageImport.update({
  id: '/user/manage',
  path: '/user/manage',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUserUserIdEditRoute = LayoutUserUserIdEditImport.update({
  id: '/user/$userId/edit',
  path: '/user/$userId/edit',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user/manage': {
      id: '/_layout/user/manage'
      path: '/user/manage'
      fullPath: '/user/manage'
      preLoaderRoute: typeof LayoutUserManageImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/currency/': {
      id: '/_layout/currency/'
      path: '/currency'
      fullPath: '/currency'
      preLoaderRoute: typeof LayoutCurrencyIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/transaction/': {
      id: '/_layout/transaction/'
      path: '/transaction'
      fullPath: '/transaction'
      preLoaderRoute: typeof LayoutTransactionIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user/': {
      id: '/_layout/user/'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof LayoutUserIndexImport
      parentRoute: typeof LayoutImport
    }
    '/auth/login/': {
      id: '/auth/login/'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/auth/logout/': {
      id: '/auth/logout/'
      path: '/auth/logout'
      fullPath: '/auth/logout'
      preLoaderRoute: typeof AuthLogoutIndexImport
      parentRoute: typeof rootRoute
    }
    '/_layout/user/$userId/edit': {
      id: '/_layout/user/$userId/edit'
      path: '/user/$userId/edit'
      fullPath: '/user/$userId/edit'
      preLoaderRoute: typeof LayoutUserUserIdEditImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutIndexRoute: typeof LayoutIndexRoute
  LayoutUserManageRoute: typeof LayoutUserManageRoute
  LayoutCurrencyIndexRoute: typeof LayoutCurrencyIndexRoute
  LayoutTransactionIndexRoute: typeof LayoutTransactionIndexRoute
  LayoutUserIndexRoute: typeof LayoutUserIndexRoute
  LayoutUserUserIdEditRoute: typeof LayoutUserUserIdEditRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutIndexRoute: LayoutIndexRoute,
  LayoutUserManageRoute: LayoutUserManageRoute,
  LayoutCurrencyIndexRoute: LayoutCurrencyIndexRoute,
  LayoutTransactionIndexRoute: LayoutTransactionIndexRoute,
  LayoutUserIndexRoute: LayoutUserIndexRoute,
  LayoutUserUserIdEditRoute: LayoutUserUserIdEditRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/': typeof LayoutIndexRoute
  '/user/manage': typeof LayoutUserManageRoute
  '/currency': typeof LayoutCurrencyIndexRoute
  '/transaction': typeof LayoutTransactionIndexRoute
  '/user': typeof LayoutUserIndexRoute
  '/auth/login': typeof AuthLoginIndexRoute
  '/auth/logout': typeof AuthLogoutIndexRoute
  '/user/$userId/edit': typeof LayoutUserUserIdEditRoute
}

export interface FileRoutesByTo {
  '/': typeof LayoutIndexRoute
  '/user/manage': typeof LayoutUserManageRoute
  '/currency': typeof LayoutCurrencyIndexRoute
  '/transaction': typeof LayoutTransactionIndexRoute
  '/user': typeof LayoutUserIndexRoute
  '/auth/login': typeof AuthLoginIndexRoute
  '/auth/logout': typeof AuthLogoutIndexRoute
  '/user/$userId/edit': typeof LayoutUserUserIdEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/': typeof LayoutIndexRoute
  '/_layout/user/manage': typeof LayoutUserManageRoute
  '/_layout/currency/': typeof LayoutCurrencyIndexRoute
  '/_layout/transaction/': typeof LayoutTransactionIndexRoute
  '/_layout/user/': typeof LayoutUserIndexRoute
  '/auth/login/': typeof AuthLoginIndexRoute
  '/auth/logout/': typeof AuthLogoutIndexRoute
  '/_layout/user/$userId/edit': typeof LayoutUserUserIdEditRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/'
    | '/user/manage'
    | '/currency'
    | '/transaction'
    | '/user'
    | '/auth/login'
    | '/auth/logout'
    | '/user/$userId/edit'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/user/manage'
    | '/currency'
    | '/transaction'
    | '/user'
    | '/auth/login'
    | '/auth/logout'
    | '/user/$userId/edit'
  id:
    | '__root__'
    | '/_layout'
    | '/_layout/'
    | '/_layout/user/manage'
    | '/_layout/currency/'
    | '/_layout/transaction/'
    | '/_layout/user/'
    | '/auth/login/'
    | '/auth/logout/'
    | '/_layout/user/$userId/edit'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  AuthLoginIndexRoute: typeof AuthLoginIndexRoute
  AuthLogoutIndexRoute: typeof AuthLogoutIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  AuthLoginIndexRoute: AuthLoginIndexRoute,
  AuthLogoutIndexRoute: AuthLogoutIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/auth/login/",
        "/auth/logout/"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/",
        "/_layout/user/manage",
        "/_layout/currency/",
        "/_layout/transaction/",
        "/_layout/user/",
        "/_layout/user/$userId/edit"
      ]
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/user/manage": {
      "filePath": "_layout/user/manage.tsx",
      "parent": "/_layout"
    },
    "/_layout/currency/": {
      "filePath": "_layout/currency/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/transaction/": {
      "filePath": "_layout/transaction/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/user/": {
      "filePath": "_layout/user/index.tsx",
      "parent": "/_layout"
    },
    "/auth/login/": {
      "filePath": "auth/login.index.tsx"
    },
    "/auth/logout/": {
      "filePath": "auth/logout.index.tsx"
    },
    "/_layout/user/$userId/edit": {
      "filePath": "_layout/user/$userId.edit.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
