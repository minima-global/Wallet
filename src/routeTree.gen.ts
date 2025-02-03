/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as TokenCreateIndexImport } from './routes/token-create/index'
import { Route as SendIndexImport } from './routes/send/index'
import { Route as ReceiveIndexImport } from './routes/receive/index'
import { Route as HistoryIndexImport } from './routes/history/index'
import { Route as CurrencyDisplayIndexImport } from './routes/currency-display/index'
import { Route as TokenCreateReviewImport } from './routes/token-create/review'
import { Route as SendConfirmationImport } from './routes/send/confirmation'
import { Route as ReceiveValidateImport } from './routes/receive/validate'
import { Route as ReceiveReportImport } from './routes/receive/report'
import { Route as NftsReviewImport } from './routes/nfts/review'
import { Route as NftsMyImport } from './routes/nfts/my'
import { Route as NftsCreateImport } from './routes/nfts/create'
import { Route as HistorySummaryImport } from './routes/history/summary'
import { Route as BalanceIdImport } from './routes/balance/$id'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TokenCreateIndexRoute = TokenCreateIndexImport.update({
  id: '/token-create/',
  path: '/token-create/',
  getParentRoute: () => rootRoute,
} as any)

const SendIndexRoute = SendIndexImport.update({
  id: '/send/',
  path: '/send/',
  getParentRoute: () => rootRoute,
} as any)

const ReceiveIndexRoute = ReceiveIndexImport.update({
  id: '/receive/',
  path: '/receive/',
  getParentRoute: () => rootRoute,
} as any)

const HistoryIndexRoute = HistoryIndexImport.update({
  id: '/history/',
  path: '/history/',
  getParentRoute: () => rootRoute,
} as any)

const CurrencyDisplayIndexRoute = CurrencyDisplayIndexImport.update({
  id: '/currency-display/',
  path: '/currency-display/',
  getParentRoute: () => rootRoute,
} as any)

const TokenCreateReviewRoute = TokenCreateReviewImport.update({
  id: '/token-create/review',
  path: '/token-create/review',
  getParentRoute: () => rootRoute,
} as any)

const SendConfirmationRoute = SendConfirmationImport.update({
  id: '/send/confirmation',
  path: '/send/confirmation',
  getParentRoute: () => rootRoute,
} as any)

const ReceiveValidateRoute = ReceiveValidateImport.update({
  id: '/receive/validate',
  path: '/receive/validate',
  getParentRoute: () => rootRoute,
} as any)

const ReceiveReportRoute = ReceiveReportImport.update({
  id: '/receive/report',
  path: '/receive/report',
  getParentRoute: () => rootRoute,
} as any)

const NftsReviewRoute = NftsReviewImport.update({
  id: '/nfts/review',
  path: '/nfts/review',
  getParentRoute: () => rootRoute,
} as any)

const NftsMyRoute = NftsMyImport.update({
  id: '/nfts/my',
  path: '/nfts/my',
  getParentRoute: () => rootRoute,
} as any)

const NftsCreateRoute = NftsCreateImport.update({
  id: '/nfts/create',
  path: '/nfts/create',
  getParentRoute: () => rootRoute,
} as any)

const HistorySummaryRoute = HistorySummaryImport.update({
  id: '/history/summary',
  path: '/history/summary',
  getParentRoute: () => rootRoute,
} as any)

const BalanceIdRoute = BalanceIdImport.update({
  id: '/balance/$id',
  path: '/balance/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/balance/$id': {
      id: '/balance/$id'
      path: '/balance/$id'
      fullPath: '/balance/$id'
      preLoaderRoute: typeof BalanceIdImport
      parentRoute: typeof rootRoute
    }
    '/history/summary': {
      id: '/history/summary'
      path: '/history/summary'
      fullPath: '/history/summary'
      preLoaderRoute: typeof HistorySummaryImport
      parentRoute: typeof rootRoute
    }
    '/nfts/create': {
      id: '/nfts/create'
      path: '/nfts/create'
      fullPath: '/nfts/create'
      preLoaderRoute: typeof NftsCreateImport
      parentRoute: typeof rootRoute
    }
    '/nfts/my': {
      id: '/nfts/my'
      path: '/nfts/my'
      fullPath: '/nfts/my'
      preLoaderRoute: typeof NftsMyImport
      parentRoute: typeof rootRoute
    }
    '/nfts/review': {
      id: '/nfts/review'
      path: '/nfts/review'
      fullPath: '/nfts/review'
      preLoaderRoute: typeof NftsReviewImport
      parentRoute: typeof rootRoute
    }
    '/receive/report': {
      id: '/receive/report'
      path: '/receive/report'
      fullPath: '/receive/report'
      preLoaderRoute: typeof ReceiveReportImport
      parentRoute: typeof rootRoute
    }
    '/receive/validate': {
      id: '/receive/validate'
      path: '/receive/validate'
      fullPath: '/receive/validate'
      preLoaderRoute: typeof ReceiveValidateImport
      parentRoute: typeof rootRoute
    }
    '/send/confirmation': {
      id: '/send/confirmation'
      path: '/send/confirmation'
      fullPath: '/send/confirmation'
      preLoaderRoute: typeof SendConfirmationImport
      parentRoute: typeof rootRoute
    }
    '/token-create/review': {
      id: '/token-create/review'
      path: '/token-create/review'
      fullPath: '/token-create/review'
      preLoaderRoute: typeof TokenCreateReviewImport
      parentRoute: typeof rootRoute
    }
    '/currency-display/': {
      id: '/currency-display/'
      path: '/currency-display'
      fullPath: '/currency-display'
      preLoaderRoute: typeof CurrencyDisplayIndexImport
      parentRoute: typeof rootRoute
    }
    '/history/': {
      id: '/history/'
      path: '/history'
      fullPath: '/history'
      preLoaderRoute: typeof HistoryIndexImport
      parentRoute: typeof rootRoute
    }
    '/receive/': {
      id: '/receive/'
      path: '/receive'
      fullPath: '/receive'
      preLoaderRoute: typeof ReceiveIndexImport
      parentRoute: typeof rootRoute
    }
    '/send/': {
      id: '/send/'
      path: '/send'
      fullPath: '/send'
      preLoaderRoute: typeof SendIndexImport
      parentRoute: typeof rootRoute
    }
    '/token-create/': {
      id: '/token-create/'
      path: '/token-create'
      fullPath: '/token-create'
      preLoaderRoute: typeof TokenCreateIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/balance/$id': typeof BalanceIdRoute
  '/history/summary': typeof HistorySummaryRoute
  '/nfts/create': typeof NftsCreateRoute
  '/nfts/my': typeof NftsMyRoute
  '/nfts/review': typeof NftsReviewRoute
  '/receive/report': typeof ReceiveReportRoute
  '/receive/validate': typeof ReceiveValidateRoute
  '/send/confirmation': typeof SendConfirmationRoute
  '/token-create/review': typeof TokenCreateReviewRoute
  '/currency-display': typeof CurrencyDisplayIndexRoute
  '/history': typeof HistoryIndexRoute
  '/receive': typeof ReceiveIndexRoute
  '/send': typeof SendIndexRoute
  '/token-create': typeof TokenCreateIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/balance/$id': typeof BalanceIdRoute
  '/history/summary': typeof HistorySummaryRoute
  '/nfts/create': typeof NftsCreateRoute
  '/nfts/my': typeof NftsMyRoute
  '/nfts/review': typeof NftsReviewRoute
  '/receive/report': typeof ReceiveReportRoute
  '/receive/validate': typeof ReceiveValidateRoute
  '/send/confirmation': typeof SendConfirmationRoute
  '/token-create/review': typeof TokenCreateReviewRoute
  '/currency-display': typeof CurrencyDisplayIndexRoute
  '/history': typeof HistoryIndexRoute
  '/receive': typeof ReceiveIndexRoute
  '/send': typeof SendIndexRoute
  '/token-create': typeof TokenCreateIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/balance/$id': typeof BalanceIdRoute
  '/history/summary': typeof HistorySummaryRoute
  '/nfts/create': typeof NftsCreateRoute
  '/nfts/my': typeof NftsMyRoute
  '/nfts/review': typeof NftsReviewRoute
  '/receive/report': typeof ReceiveReportRoute
  '/receive/validate': typeof ReceiveValidateRoute
  '/send/confirmation': typeof SendConfirmationRoute
  '/token-create/review': typeof TokenCreateReviewRoute
  '/currency-display/': typeof CurrencyDisplayIndexRoute
  '/history/': typeof HistoryIndexRoute
  '/receive/': typeof ReceiveIndexRoute
  '/send/': typeof SendIndexRoute
  '/token-create/': typeof TokenCreateIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/balance/$id'
    | '/history/summary'
    | '/nfts/create'
    | '/nfts/my'
    | '/nfts/review'
    | '/receive/report'
    | '/receive/validate'
    | '/send/confirmation'
    | '/token-create/review'
    | '/currency-display'
    | '/history'
    | '/receive'
    | '/send'
    | '/token-create'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/balance/$id'
    | '/history/summary'
    | '/nfts/create'
    | '/nfts/my'
    | '/nfts/review'
    | '/receive/report'
    | '/receive/validate'
    | '/send/confirmation'
    | '/token-create/review'
    | '/currency-display'
    | '/history'
    | '/receive'
    | '/send'
    | '/token-create'
  id:
    | '__root__'
    | '/'
    | '/balance/$id'
    | '/history/summary'
    | '/nfts/create'
    | '/nfts/my'
    | '/nfts/review'
    | '/receive/report'
    | '/receive/validate'
    | '/send/confirmation'
    | '/token-create/review'
    | '/currency-display/'
    | '/history/'
    | '/receive/'
    | '/send/'
    | '/token-create/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  BalanceIdRoute: typeof BalanceIdRoute
  HistorySummaryRoute: typeof HistorySummaryRoute
  NftsCreateRoute: typeof NftsCreateRoute
  NftsMyRoute: typeof NftsMyRoute
  NftsReviewRoute: typeof NftsReviewRoute
  ReceiveReportRoute: typeof ReceiveReportRoute
  ReceiveValidateRoute: typeof ReceiveValidateRoute
  SendConfirmationRoute: typeof SendConfirmationRoute
  TokenCreateReviewRoute: typeof TokenCreateReviewRoute
  CurrencyDisplayIndexRoute: typeof CurrencyDisplayIndexRoute
  HistoryIndexRoute: typeof HistoryIndexRoute
  ReceiveIndexRoute: typeof ReceiveIndexRoute
  SendIndexRoute: typeof SendIndexRoute
  TokenCreateIndexRoute: typeof TokenCreateIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  BalanceIdRoute: BalanceIdRoute,
  HistorySummaryRoute: HistorySummaryRoute,
  NftsCreateRoute: NftsCreateRoute,
  NftsMyRoute: NftsMyRoute,
  NftsReviewRoute: NftsReviewRoute,
  ReceiveReportRoute: ReceiveReportRoute,
  ReceiveValidateRoute: ReceiveValidateRoute,
  SendConfirmationRoute: SendConfirmationRoute,
  TokenCreateReviewRoute: TokenCreateReviewRoute,
  CurrencyDisplayIndexRoute: CurrencyDisplayIndexRoute,
  HistoryIndexRoute: HistoryIndexRoute,
  ReceiveIndexRoute: ReceiveIndexRoute,
  SendIndexRoute: SendIndexRoute,
  TokenCreateIndexRoute: TokenCreateIndexRoute,
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
        "/",
        "/balance/$id",
        "/history/summary",
        "/nfts/create",
        "/nfts/my",
        "/nfts/review",
        "/receive/report",
        "/receive/validate",
        "/send/confirmation",
        "/token-create/review",
        "/currency-display/",
        "/history/",
        "/receive/",
        "/send/",
        "/token-create/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/balance/$id": {
      "filePath": "balance/$id.tsx"
    },
    "/history/summary": {
      "filePath": "history/summary.tsx"
    },
    "/nfts/create": {
      "filePath": "nfts/create.tsx"
    },
    "/nfts/my": {
      "filePath": "nfts/my.tsx"
    },
    "/nfts/review": {
      "filePath": "nfts/review.tsx"
    },
    "/receive/report": {
      "filePath": "receive/report.tsx"
    },
    "/receive/validate": {
      "filePath": "receive/validate.tsx"
    },
    "/send/confirmation": {
      "filePath": "send/confirmation.tsx"
    },
    "/token-create/review": {
      "filePath": "token-create/review.tsx"
    },
    "/currency-display/": {
      "filePath": "currency-display/index.tsx"
    },
    "/history/": {
      "filePath": "history/index.tsx"
    },
    "/receive/": {
      "filePath": "receive/index.tsx"
    },
    "/send/": {
      "filePath": "send/index.tsx"
    },
    "/token-create/": {
      "filePath": "token-create/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
