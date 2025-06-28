
# Warframe App

/warframe-app
│
├── /app
│   ├── /components
│   │   ├── WorldstateDisplay.tsx
│   │   ├── SearchBar.tsx
│   │   └── SearchResults.tsx
│   ├── /worldstate
│   │   └── page.tsx         # /worldstate route
│   ├── /search
│   │   └── page.tsx         # /search route
│   └── page.tsx             # Home route
│
├── /lib
│   ├── worldstateParser.ts
│   ├── dropTableParser.ts
│   ├── worldstateService.ts
│   ├── dropTableService.ts
│   └── helpers.ts
│
├── /models
│   ├── relic.ts
│   └── item.ts
│
├── /pages
│   └── api
│       ├── worldstate.ts    # /api/worldstate
│       └── search.ts        # /api/search
│
├── /data
│   ├── worldstate.json
│   └── drops.json
│
├── package.json
└── README.md
