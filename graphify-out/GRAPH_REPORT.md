# Graph Report - neuronflow  (2026-05-15)

## Corpus Check
- 34 files · ~14,527 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 261 nodes · 265 edges · 25 communities (22 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_Auth & JWT Utils|Auth & JWT Utils]]
- [[_COMMUNITY_Server Entry & Index|Server Entry & Index]]

## God Nodes (most connected - your core abstractions)
1. `dependencies` - 18 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 15 edges
4. `devDependencies` - 13 edges
5. `dependencies` - 11 edges
6. `devDependencies` - 9 edges
7. `NeuronFlow` - 9 edges
8. `scripts` - 8 edges
9. `AuthRequest` - 7 edges
10. `authMiddleware()` - 7 edges

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

## Communities (25 total, 3 thin omitted)

### Community 0 - "Client UI Layer"
Cohesion: 0.08
Nodes (12): AgentDetail, AgentLogs, Agents, Billing, Contact, DashboardOverview, Landing, Leads (+4 more)

### Community 1 - "React Dependencies"
Cohesion: 0.1
Nodes (19): dependencies, axios, clsx, framer-motion, lucide-react, react, react-dom, react-router-dom (+11 more)

### Community 2 - "Client TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+10 more)

### Community 3 - "Server TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, baseUrl, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, outDir (+10 more)

### Community 4 - "Server Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, axios, bcryptjs, compression, cookie-parser, cors, dotenv, express (+10 more)

### Community 5 - "API & Authentication"
Cohesion: 0.1
Nodes (7): api, token, sparklineData, sparklineDataUp, Login(), AuthState, useAuthStore

### Community 6 - "Server Routing"
Cohesion: 0.09
Nodes (26): authMiddleware(), AuthRequest, optionalAuth(), parsed, prisma, router, prisma, router (+18 more)

### Community 7 - "Server Package Config"
Cohesion: 0.15
Nodes (12): description, main, name, scripts, build, dev, prisma:generate, prisma:push (+4 more)

### Community 8 - "Server Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, nodemon, prisma, ts-node-dev, @types/bcryptjs, @types/compression, @types/cookie-parser, @types/cors (+5 more)

### Community 9 - "Landing & Page Components"
Cohesion: 0.21
Nodes (12): Axios API Client, Auth Store (Zustand), Docker Compose Config, Landing Page Design, Agent Detail Page, Agent Marketplace, My Agents Dashboard, Dashboard Overview (+4 more)

### Community 10 - "Client Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom, typescript, vite (+1 more)

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

## Knowledge Gaps
- **166 isolated node(s):** `name`, `version`, `description`, `main`, `dev` (+161 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Server Dependencies` to `Server Package Config`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Server Dev Dependencies` to `Server Package Config`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _166 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Client UI Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `React Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Client TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Server TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._