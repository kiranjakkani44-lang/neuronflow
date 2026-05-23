# Graph Report - neuronflow  (2026-05-23)

## Corpus Check
- 46 files · ~27,826 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 482 nodes · 568 edges · 53 communities (38 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35267d92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Client UI Layer|Client UI Layer]]
- [[_COMMUNITY_React Dependencies|React Dependencies]]
- [[_COMMUNITY_Client TypeScript Config|Client TypeScript Config]]
- [[_COMMUNITY_Server TypeScript Config|Server TypeScript Config]]
- [[_COMMUNITY_Server Dependencies|Server Dependencies]]
- [[_COMMUNITY_API & Authentication|API & Authentication]]
- [[_COMMUNITY_Server Routing|Server Routing]]
- [[_COMMUNITY_Server Package Config|Server Package Config]]
- [[_COMMUNITY_Server Dev Dependencies|Server Dev Dependencies]]
- [[_COMMUNITY_Landing & Page Components|Landing & Page Components]]
- [[_COMMUNITY_Client Dev Dependencies|Client Dev Dependencies]]
- [[_COMMUNITY_Client Build Config|Client Build Config]]
- [[_COMMUNITY_Prisma Schema & Seed|Prisma Schema & Seed]]
- [[_COMMUNITY_Express Server Core|Express Server Core]]
- [[_COMMUNITY_Vite Proxy Config|Vite Proxy Config]]
- [[_COMMUNITY_Docker & Nginx|Docker & Nginx]]
- [[_COMMUNITY_HTML Entry Points|HTML Entry Points]]
- [[_COMMUNITY_Client Package Metadata|Client Package Metadata]]
- [[_COMMUNITY_Auth & JWT Utils|Auth & JWT Utils]]
- [[_COMMUNITY_Server Entry & Index|Server Entry & Index]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 51|Community 51]]

## God Nodes (most connected - your core abstractions)
1. `dependencies` - 20 edges
2. `AgentEngine` - 17 edges
3. `compilerOptions` - 16 edges
4. `compilerOptions` - 15 edges
5. `devDependencies` - 14 edges
6. `AuthRequest` - 12 edges
7. `authMiddleware()` - 12 edges
8. `===========================================` - 12 edges
9. `dependencies` - 11 edges
10. `scripts` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Project README` --references--> `Landing Page`  [EXTRACTED]
  README.md → client/src/pages/Landing.tsx
- `Project README` --references--> `Dashboard Overview`  [EXTRACTED]
  README.md → client/src/pages/dashboard/Overview.tsx
- `Vite Config` --conceptually_related_to--> `Server Entry Point`  [INFERRED]
  client/vite.config.ts → server/src/index.ts
- `Landing Page` --conceptually_related_to--> `Landing Page Design`  [INFERRED]
  client/src/pages/Landing.tsx → client/src/stitch_assets/Landing.html
- `Docker Compose Config` --rationale_for--> `Project README`  [INFERRED]
  docker-compose.yml → README.md

## Hyperedges (group relationships)
- **** — server_index, routes_auth, routes_agents, routes_deployments [INFERRED]
- **** — api_client, authstore, pages_login [EXTRACTED]
- **** — pages_landing, pages_agents, pages_agentdetail, pages_dashboard_myagents [INFERRED 0.75]

## Communities (53 total, 15 thin omitted)

### Community 0 - "Client UI Layer"
Cohesion: 0.05
Nodes (22): About, AdminAgents, AdminAudits, AdminLeads, AdminOverview, AdminUsers, AgentDetail, AgentLogs (+14 more)

### Community 1 - "React Dependencies"
Cohesion: 0.07
Nodes (28): dependencies, axios, clsx, framer-motion, lucide-react, react, react-dom, react-router-dom (+20 more)

### Community 2 - "Client TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+10 more)

### Community 3 - "Server TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, baseUrl, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, outDir (+10 more)

### Community 4 - "Server Dependencies"
Cohesion: 0.1
Nodes (20): dependencies, axios, bcryptjs, compression, cookie-parser, cors, dotenv, express (+12 more)

### Community 6 - "Server Routing"
Cohesion: 0.5
Nodes (3): AuthRequest, prisma, router

### Community 7 - "Server Package Config"
Cohesion: 0.06
Nodes (28): description, devDependencies, nodemon, prisma, ts-node-dev, @types/bcryptjs, @types/compression, @types/cookie-parser (+20 more)

### Community 8 - "Server Dev Dependencies"
Cohesion: 0.05
Nodes (41): ===========================================, ===========================================, API not responding, Backup, code:bash (# 1. Clone and setup), code:bash (certbot renew --force-renewal), code:yaml (# Add to docker-compose.production.yml), code:ini (MemoryMax=2G) (+33 more)

### Community 9 - "Landing & Page Components"
Cohesion: 0.21
Nodes (12): Axios API Client, Auth Store (Zustand), Docker Compose Config, Landing Page Design, Agent Detail Page, Agent Marketplace, My Agents Dashboard, Dashboard Overview (+4 more)

### Community 10 - "Client Dev Dependencies"
Cohesion: 0.19
Nodes (8): AgentEngine, AgentTask, AgentType, llm, LLMService, prisma, retryWithBackoff(), sanitizeLLMInput()

### Community 11 - "Client Build Config"
Cohesion: 0.25
Nodes (7): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, include

### Community 12 - "Prisma Schema & Seed"
Cohesion: 0.38
Nodes (7): Agents Model, Database Seed, Agents Routes, Auth Routes, Deployments Routes, Server Entry Point, Vite Config

### Community 13 - "Express Server Core"
Cohesion: 0.11
Nodes (17): 1. Start the server, 2. Start the client, 3. Open the app, API Routes, Architecture, code:bash (cd server), code:bash (cd client), code:bash (# Required) (+9 more)

### Community 15 - "Docker & Nginx"
Cohesion: 0.67
Nodes (3): Client App Router, Dashboard Layout, Public Layout

### Community 18 - "Client Package Metadata"
Cohesion: 0.48
Nodes (4): Login(), Register(), AuthState, useAuthStore

### Community 22 - "Community 22"
Cohesion: 0.28
Nodes (7): authMiddleware(), AuthRequest, checkRateLimit(), inMemoryBlacklist, inMemoryRateLimits, isTokenBlacklisted(), optionalAuth()

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (4): PaymentOrder, planFeatures, planPrices, Subscription

### Community 24 - "Community 24"
Cohesion: 0.21
Nodes (9): acquireFileLock(), initScheduler(), instanceId, LOCK_FILE, prisma, releaseFileLock(), stopScheduler(), triggerAllAgents() (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.12
Nodes (15): attempts, client, loginAttempts, now, payload, prisma, reset_expires, reset_token (+7 more)

### Community 26 - "Community 26"
Cohesion: 0.18
Nodes (11): llm, prisma, optionalAuth(), deploymentId, leadDep, leadId, metrics, results (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (8): broadcastToUser(), heartbeat, prisma, remaining, router, sseClients, prisma, router

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (3): ErrorBoundary, Props, State

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (6): validateJwtSecret(), allOk, allowedOrigins, app, checks, prisma

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (7): auth, generatedSignature, orderPayload, PLAN_PRICES, planPrices, prisma, router

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (6): authMiddleware(), limitNum, pageNum, prisma, router, where

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (5): allowedFields, parsed, prisma, router, updates

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (5): now, prisma, router, sevenDaysAgo, thirtyDaysAgo

### Community 35 - "Community 35"
Cohesion: 0.33
Nodes (4): id, prisma, router, updateData

### Community 51 - "Community 51"
Cohesion: 0.5
Nodes (3): prisma, tokenBlacklist, JWT_SECRET

## Knowledge Gaps
- **265 isolated node(s):** `name`, `version`, `description`, `main`, `dev` (+260 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AgentEngine` connect `Client Dev Dependencies` to `Community 24`, `Community 26`, `Community 35`, `Server Routing`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `AuthRequest` connect `Server Routing` to `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 51`, `Community 25`, `Community 26`, `Community 27`, `Community 30`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `authMiddleware()` connect `Community 32` to `Community 33`, `Community 34`, `Community 35`, `Server Routing`, `Community 51`, `Community 25`, `Community 26`, `Community 27`, `Community 30`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _265 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Client UI Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `React Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Client TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._