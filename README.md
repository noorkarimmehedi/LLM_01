# Arc Lab

[Arc Lab](https://arclab.ai) is a sophisticated AI-powered chatbot platform that prioritizes privacy while offering powerful research and agentic capabilities. Built as a monorepo with Next.js, TypeScript, and cutting-edge AI models, Arc Lab stands out with its workflow orchestration system and focus on privacy, storing all user data locally in the browser using IndexedDB, ensuring your conversations never leave your device.

## Features

- 🤖 **Multi-Model Support**: Chat with GPT-4.1, Claude 3.7 Sonnet, Gemini 2 Flash, and more
- 🔒 **Privacy-First**: All data stored locally in your browser
- 🧠 **Agentic Workflows**: Advanced research and analysis capabilities
- 🌐 **Web Search Integration**: Real-time information gathering
- 📱 **Responsive Design**: Works seamlessly across all devices
- ⚡ **Fast & Efficient**: Built with Next.js 14 and optimized for performance

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI Models**: OpenAI, Anthropic, Google, Fireworks
- **Database**: IndexedDB (local storage)
- **Authentication**: Clerk
- **Analytics**: PostHog
- **Deployment**: Vercel

## Architecture

Arc Lab is built as a monorepo with a clear separation of concerns:

```
├── apps/
│   └── web/                 # Next.js web application
├── packages/
│   ├── ai/                  # AI models and workflow orchestration
│   ├── actions/             # Shared actions and API handlers
│   ├── common/              # Common utilities and hooks
│   ├── orchestrator/        # Workflow engine and task management
│   ├── prisma/              # Database schema and client
│   ├── shared/              # Shared types and constants
│   ├── ui/                  # Reusable UI components
│   ├── tailwind-config/     # Shared Tailwind configuration
│   └── typescript-config/   # Shared TypeScript configuration
```

## Workflow Orchestration

Arc Lab's workflow orchestration enables powerful agentic capabilities through a modular, step-by-step approach. Here's how to create a research agent:

### 1. Define Event and Context Types

First, establish the data structure for events and context:

```typescript
// Define the events emitted by each task
type AgentEvents = {
    taskPlanner: {
        tasks: string[];
        query: string;
    };
    informationGatherer: {
        searchResults: string[];
    };
    informationAnalyzer: {
        analysis: string;
        insights: string[];
    };
    reportGenerator: {
        report: string;
    };
};

// Define the shared context between tasks
type AgentContext = {
    query: string;
    tasks: string[];
    searchResults: string[];
    analysis: string;
    insights: string[];
    report: string;
};
```

### 2. Initialize Core Components

Next, set up the event emitter, context, and workflow builder:

```typescript
import { OpenAI } from 'openai';
import { createTask } from 'task';
import { WorkflowBuilder } from './builder';
import { Context } from './context';
import { TypedEventEmitter } from './events';

// Initialize event emitter with proper typing
const events = new TypedEventEmitter<AgentEvents>();

// Create the workflow builder with proper context
const builder = new WorkflowBuilder<AgentEvents, AgentContext>('research-agent', {
    events,
    context: new Context<AgentContext>({
        query: '',
        tasks: [],
        searchResults: [],
        analysis: '',
        insights: [],
        report: '',
    }),
});

// Initialize LLM client
const llm = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
```

### 3. Define Research Tasks

Create specialized tasks for each step of the research process:

#### Planning Task

```typescript
// Task Planner: Breaks down a research query into specific tasks
const taskPlanner = createTask({
    name: 'taskPlanner',
    execute: async ({ context, data }) => {
        const userQuery = data?.query || 'Research the impact of AI on healthcare';

        const planResponse = await llm.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a task planning assistant that breaks down research queries into specific search tasks.',
                },
                {
                    role: 'user',
                    content: `Break down this research query into specific search tasks: "${userQuery}". Return a JSON array of tasks.`,
                },
            ],
            response_format: { type: 'json_object' },
        });

        const content = planResponse.choices[0].message.content || '{"tasks": []}';
        const parsedContent = JSON.parse(content);
        const tasks = parsedContent.tasks || [];

        context?.set('query', userQuery);
        context?.set('tasks', tasks);

        return {
            tasks,
            query: userQuery,
        };
    },
    route: () => 'informationGatherer',
});
```

#### Information Gathering Task

```typescript
// Information Gatherer: Searches for information based on tasks
const informationGatherer = createTask({
    name: 'informationGatherer',
    dependencies: ['taskPlanner'],
    execute: async ({ context, data }) => {
        const tasks = data.taskPlanner.tasks;
        const searchResults: string[] = [];

        // Process each task to gather information
        for (const task of tasks) {
            const searchResponse = await llm.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a search engine that returns factual information.',
                    },
                    {
                        role: 'user',
                        content: `Search for information about: ${task}. Return relevant facts and data.`,
                    },
                ],
            });

            const result = searchResponse.choices[0].message.content || '';
            if (result) {
                searchResults.push(result);
            }
        }

        context?.set('searchResults', searchResults);

        return {
            searchResults,
        };
    },
    route: () => 'informationAnalyzer',
});
```

#### Analysis Task

```typescript
// Information Analyzer: Analyzes gathered information for insights
const informationAnalyzer = createTask({
    name: 'informationAnalyzer',
    dependencies: ['informationGatherer'],
    execute: async ({ context, data }) => {
        const searchResults = data.informationGatherer.searchResults;
        const query = context?.get('query') || '';

        const analysisResponse = await llm.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an analytical assistant that identifies patterns and extracts insights from information.',
                },
                {
                    role: 'user',
                    content: `Analyze the following information regarding "${query}" and provide a coherent analysis with key insights:\n\n${searchResults.join('\n\n')}`,
                },
            ],
            response_format: { type: 'json_object' },
        });

        const content =
            analysisResponse.choices[0].message.content || '{"analysis": "", "insights": []}';
        const parsedContent = JSON.parse(content);
        const analysis = parsedContent.analysis || '';
        const insights = parsedContent.insights || [];

        context?.set('analysis', analysis);
        context?.set('insights', insights);

        return {
            analysis,
            insights,
        };
    },
    route: () => 'reportGenerator',
});
```

#### Report Generation Task

```typescript
// Report Generator: Creates a comprehensive report
const reportGenerator = createTask({
    name: 'reportGenerator',
    dependencies: ['informationAnalyzer'],
    execute: async ({ context, data }) => {
        const { analysis, insights } = data.informationAnalyzer;
        const { query, searchResults } = context?.getAll() || { query: '', searchResults: [] };

        const reportResponse = await llm.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a report writing assistant that creates comprehensive, well-structured reports.',
                },
                {
                    role: 'user',
                    content: `Create a comprehensive report on "${query}" using the following analysis and insights.\n\nAnalysis: ${analysis}\n\nInsights: ${insights.join('\n- ')}\n\nStructure the report with an executive summary, key findings, detailed analysis, and conclusions.`,
                },
            ],
        });

        const report = reportResponse.choices[0].message.content || '';

        context?.set('report', report);

        return {
            report,
        };
    },
    route: () => 'end',
});
```

### 4. Build and Execute the Workflow

Finally, assemble and run the workflow:

```typescript
// Add all tasks to the workflow
builder.addTask(taskPlanner);
builder.addTask(informationGatherer);
builder.addTask(informationAnalyzer);
builder.addTask(reportGenerator);

// Build the workflow
const workflow = builder.build();

// Start the workflow with an initial query
workflow.start('taskPlanner', { query: 'Research the impact of AI on healthcare' });

// Export the workflow for external use
export const researchAgent = workflow;
```

The workflow processes through these stages:

1. **Planning**: Breaks down complex questions into specific research tasks
2. **Information Gathering**: Collects relevant data for each task
3. **Analysis**: Processes and analyzes the gathered information
4. **Report Generation**: Creates a comprehensive final report

## Privacy & Security

Arc Lab prioritizes user privacy by storing all data locally in the browser using IndexedDB. This means:

- ✅ **No Server Storage**: Your conversations never leave your device
- ✅ **No Data Mining**: We don't collect or analyze your chat data
- ✅ **Complete Control**: You can delete all data at any time
- ✅ **Secure Communication**: Direct API calls with end-to-end encryption

## Getting Started

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/ccleo.git
cd ccleo
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
```

4. Add your API keys to `.env.local`:
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
FIREWORKS_API_KEY=your_fireworks_key
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

5. Start the development server:
```bash
bun run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:

- 📧 Email: support@arclab.ai
- 🐛 Report bugs: [GitHub Issues](https://github.com/your-repo/ccleo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/ccleo/discussions)

---

Built with ❤️ by the Arc Lab team
