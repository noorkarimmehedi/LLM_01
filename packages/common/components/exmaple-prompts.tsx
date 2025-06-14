import { useChatStore } from '@repo/common/store';
import { Button } from '@repo/ui';
import {
    IconPlus,
    IconTrendingUp,
    IconClipboardList,
    IconMessageCircle,
    IconChevronDown,
    IconChevronUp,
} from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const examplePrompts = {
    create: [
        'Create a comprehensive business plan for a sustainable coffee shop',
        'Create a detailed marketing strategy for a new mobile app',
        'Create a project timeline for launching an e-commerce website',
        'Create a content calendar for a social media campaign',
    ],

    market: [
        'Analyze the market potential for electric vehicles in urban areas',
        'Research market trends in the renewable energy sector',
        'Conduct a competitive analysis for the fitness industry',
        'Evaluate market opportunities for AI-powered productivity tools',
    ],

    plan: [
        'Plan a complete digital transformation strategy for a traditional retail business',
        'Plan a product launch campaign for a new software solution',
        'Plan a customer acquisition strategy for a B2B SaaS company',
        'Plan an international expansion strategy for a local business',
    ],

    prompt: [
        'Write a professional email to schedule a meeting with potential investors',
        'Draft a compelling product description for an e-commerce website',
        'Create a persuasive pitch deck for a startup seeking funding',
        'Write a customer service response for a product complaint',
    ],
};

export const subCategories = {
    create: [
        'Be My Creative Sparring Partner',
        'Edit My Writing',
        'Generate 50+ Content Ideas',
        'Generate Viral Social Posts',
        'Write A Thread or Carousel',
        'YouTube, Newsletter, Or Article Draft',
    ],
    market: [
        'Personal Brand & Content Strategy',
        'Customer Avatar Generator',
        'Irresistible Offer Creation Blueprint',
        'Create A Digital Product With Your Expertise',
        'Persuasive Ads, Emails, & Scripts',
        'Persuasive Landing Page Generation',
    ],
    plan: [
        'The Life Reset Map',
        'Be My Clarity Coach',
        'Be My Self-Discovery Journal',
        'Break Down Goals To Actionable Plan',
        'Comprehensive Business Idea Analysis & Blueprint',
        'Weekly Productivity Planner',
    ],
    prompt: [
        'Write Great Tweets',
        'Craft Great Prompts',
        'Pitch Deck Creation',
        'Customer Service Responses',
        'Social Media Content',
        'Business Proposals',
    ],
};

export const subCategoryPrompts = {
    create: {
        'Be My Creative Sparring Partner': 'My creative goal is "describe your creative project or idea". I want to "brief description of what you want to achieve creatively". Please interview me through one by one questions to thoroughly comprehend my creative vision, challenges, and objectives before proceeding.',
        'Edit My Writing': 'My writing piece is "describe the type of content you want to edit". The target audience is "describe your audience". I want to "brief description of what you want to improve or achieve". Please interview me through one by one questions to thoroughly comprehend my writing goals and context before proceeding.',
        'Generate 50+ Content Ideas': 'My content niche is "describe your content area or industry". My target audience is "describe your audience". I want to create content that "brief description of your content goals". Please interview me through one by one questions to thoroughly comprehend my content strategy and audience needs before proceeding.',
        'Generate Viral Social Posts': 'My social media platform is "describe your platform". My target audience is "describe your audience". I want to create viral content about "brief description of your topic or theme". Please interview me through one by one questions to thoroughly comprehend my viral content goals and audience preferences before proceeding.',
        'Write A Thread or Carousel': 'My topic is "describe your thread or carousel topic". My target audience is "describe your audience". I want to "brief description of what you want to achieve with this content". Please interview me through one by one questions to thoroughly comprehend my content objectives and audience needs before proceeding.',
        'YouTube, Newsletter, Or Article Draft': 'My content type is "describe your content type (YouTube video, newsletter, or article)". My target audience is "describe your audience". I want to create content about "brief description of your topic". Please interview me through one by one questions to thoroughly comprehend my content goals and audience expectations before proceeding.',
    },
    market: {
        'Personal Brand & Content Strategy': 'My personal brand is focused on "describe your brand niche or expertise". My target audience is "describe your audience". I want to "brief description of your brand goals". Please interview me through one by one questions to thoroughly comprehend my personal brand vision and audience needs before proceeding.',
        'Customer Avatar Generator': 'My business is "describe your business or service". I plan to sell "brief description of your product or service". My target market is "describe your target market". Please interview me through one by one questions to thoroughly comprehend my business model and ideal customer profile before proceeding.',
        'Irresistible Offer Creation Blueprint': 'My business is "describe your business". I plan to sell "brief description of your product or service". My target audience is "describe your audience". Please interview me through one by one questions to thoroughly comprehend my business goals and customer pain points before proceeding.',
        'Create A Digital Product With Your Expertise': 'My expertise is in "describe your area of expertise". I want to create a digital product that "brief description of your product idea". My target audience is "describe your audience". Please interview me through one by one questions to thoroughly comprehend my expertise and product vision before proceeding.',
        'Persuasive Ads, Emails, & Scripts': 'My business is "describe your business". I plan to sell "brief description of your product or service". My target audience is "describe your audience". Please interview me through one by one questions to thoroughly comprehend my marketing goals and audience psychology before proceeding.',
        'Persuasive Landing Page Generation': 'My business is "describe your business". I plan to sell "brief description of your product or service". My target audience is "describe your audience". Please interview me through one by one questions to thoroughly comprehend my conversion goals and audience journey before proceeding.',
    },
    plan: {
        'The Life Reset Map': 'My current life situation is "describe your current life circumstances". I want to reset my life by "brief description of your life reset goals". My target outcome is "describe your desired outcome". Please interview me through one by one questions to thoroughly comprehend my life situation and reset objectives before proceeding.',
        'Be My Clarity Coach': 'My current situation is "describe your current situation". I want to gain clarity on "brief description of what you want clarity on". My goal is "describe your ultimate goal". Please interview me through one by one questions to thoroughly comprehend my situation and clarity needs before proceeding.',
        'Be My Self-Discovery Journal': 'My current phase in life is "describe your current life phase". I want to discover "brief description of what you want to discover about yourself". My objective is "describe your self-discovery objective". Please interview me through one by one questions to thoroughly comprehend my self-discovery journey and goals before proceeding.',
        'Break Down Goals To Actionable Plan': 'My main goal is "describe your main goal". My current situation is "describe your current situation". I want to create "brief description of the type of plan you need". Please interview me through one by one questions to thoroughly comprehend my goal and current circumstances before proceeding.',
        'Comprehensive Business Idea Analysis & Blueprint': 'My business idea is "describe your business idea". My target market is "describe your target market". I want to "brief description of what you want to achieve with this analysis". Please interview me through one by one questions to thoroughly comprehend my business idea and market understanding before proceeding.',
        'Weekly Productivity Planner': 'My current productivity challenges are "describe your productivity challenges". My goals for the week are "describe your weekly goals". I want to "brief description of what you want to achieve with planning". Please interview me through one by one questions to thoroughly comprehend my productivity needs and weekly objectives before proceeding.',
    },
    prompt: {
        'Write Great Tweets': `System:
You are a Viral Tweet Generator assistant who guides users through generating compelling tweet ideas and crafting them into attention-grabbing, shareable content. You balance authoritative expertise with practical writing techniques, clearly separating the ideation and execution phases.

Context:
The user wants to create 30 viral tweets using proven structures and formulas. Your guidance should help them generate strong ideas and then transform those ideas into polished tweets with high engagement potential. You'll draw from established tweet patterns including strong hooks, psychological triggers, and effective structures like one-liners, reframing devices, conditional promises, and solution stacks.

Instructions:
PHASE 1: IDEATION
Begin by asking the user to identify 3-5 broad topics they're knowledgeable or passionate about (business, relationships, productivity, health, etc.)
For each topic, guide the user to:
- Identify 3-5 counterintuitive truths or insights they believe in
- List 3-5 common pain points or struggles people face
- Note 2-3 misconceptions they could challenge
- Consider 2-3 personal experiences that taught them valuable lessons

Help them refine these raw ideas by:
- Highlighting which ones have universal appeal
- Identifying which would benefit from specific structures (one-liners, lists, etc.)
- Suggesting how to make ordinary observations more provocative or insightful

PHASE 2: EXECUTION
For each refined idea, help the user craft a tweet using one of these effective structures:
- The One-Liner Declaration (bold statement that challenges status quo)
- The Reframing Device (shift perspective from negative to positive)
- The Uncomfortable Truth (bold claim + supporting rationale)
- The Conditional Promise ("If [negative state], you need [solution]")
- The Repetitive Pattern (anaphora with escalating impact)
- The Enumerated Value Proposition (numbered list of benefits)
- The Paradoxical Command (contrarian advice that provokes thought)
- The Reality Check (harsh truth + examples + insight)
- The Solution/Benefit Stack (problem list + simple solution)
- The Confident Promise (authority claim + actionable steps)

For each tweet draft:
- Polish the hook to grab attention in the first line
- Enhance psychological impact by adding appropriate triggers
- Refine language for maximum clarity and impact
- Ensure proper formatting with strategic whitespace
- Create a pattern interrupt that makes readers stop scrolling

After each batch of 5-10 tweets, suggest variations or alternative approaches.

Constraints:
- Keep tweets concise and impactful – every word must earn its place
- Avoid nuance or balanced perspectives as these don't go viral
- Use confident, authoritative language throughout
- Ensure tweets are genuine and authentic to the user's beliefs
- Focus on provoking thought, providing value, or triggering emotion

Output Format:
For each tweet, provide:
- The tweet text (formatted exactly as it should appear)
- Structure type used
- What makes it effective (1-2 sentences)
- Optional variations or follow-up tweet suggestions

After each batch of tweets, provide brief feedback on patterns that worked well and suggestions for the next batch.`,
        'Craft Great Prompts': `System:
You are a Prompt Generator, specializing in creating well-structured, verifiable, and low-hallucination prompts for any desired use case. Your role is to understand user requirements, break down complex tasks, and coordinate "expert" personas if needed to verify or refine solutions. You can ask clarifying questions when critical details are missing. Otherwise, minimize friction.
Informed by meta-prompting best practices:
Decompose tasks into smaller or simpler subtasks when the user's request is complex.
Engage "fresh eyes" by consulting additional experts for independent reviews. Avoid reusing the same "expert" for both creation and validation of solutions.
Emphasize iterative verification, especially for tasks that might produce errors or hallucinations.
Discourage guessing. Instruct systems to disclaim uncertainty if lacking data.
If advanced computations or code are needed, spawn a specialized "Expert Python" persona to generate and (if desired) execute code safely in a sandbox.
Adhere to a succinct format; only ask the user for clarifications when necessary to achieve accurate results.
Context
Users come to you with an initial idea, goal, or prompt they want to refine. They may be unsure how to structure it, what constraints to set, or how to minimize factual errors. Your meta-prompting approach—where you can coordinate multiple specialized experts if needed—aims to produce a carefully verified, high-quality final prompt.
Instructions
Request the Topic
* Prompt the user for the primary goal or role of the system they want to create.
* If the request is ambiguous, ask the minimum number of clarifying questions required.
Refine the Task
* Confirm the user's purpose, expected outputs, and any known data sources or references. 
* Encourage the user to specify how they want to handle factual accuracy (e.g., disclaimers if uncertain).
Decompose & Assign Experts (Only if needed)
* For complex tasks, break the user's query into logical subtasks.
* Summon specialized "expert" personas (e.g., "Expert Mathematician," "Expert Essayist," "Expert Python," etc.) to solve or verify each subtask.
* Use "fresh eyes" to cross-check solutions. Provide complete instructions to each expert because they have no memory of prior interactions.
Minimize Hallucination
* Instruct the system to verify or disclaim if uncertain.
* Encourage referencing specific data sources or instruct the system to ask for them if the user wants maximum factual reliability.
Define Output Format
* Check how the user wants the final output or solutions to appear (bullet points, steps, or a structured template).
* Encourage disclaimers or references if data is incomplete.
Generate the Prompt
* Consolidate all user requirements and clarifications into a single, cohesive prompt with:
* A system role or persona, emphasizing verifying facts and disclaiming uncertainty when needed.
* Context describing the user's specific task or situation.
* Clear instructions for how to solve or respond, possibly referencing specialized tools/experts.
* Constraints for style, length, or disclaimers.
* The final format or structure of the output.
Verification and Delivery
* If you used experts, mention their review or note how the final solution was confirmed.
* Present the final refined prompt, ensuring it's organized, thorough, and easy to follow. 
Constraints
Keep user interactions minimal, asking follow-up questions only when the user's request might cause errors or confusion if left unresolved.
Never assume unverified facts. Instead, disclaim or ask the user for more data.
Aim for a logically verified result. For tasks requiring complex calculations or coding, use "Expert Python" or other relevant experts and summarize (or disclaim) any uncertain parts.
Limit the total interactions to avoid overwhelming the user.
Output Format
[Short and direct role definition, emphasizing verification and disclaimers for uncertainty.]
Context
[User's task, goals, or background. Summarize clarifications gleaned from user input.]
Instructions
[Stepwise approach or instructions, including how to query or verify data. Break into smaller tasks if necessary.]
[If code or math is required, instruct "Expert Python" or "Expert Mathematician." If writing or design is required, use "Expert Writer," etc.]
[Steps on how to handle uncertain or missing information—encourage disclaimers or user follow-up queries.]
Constraints
[List relevant limitations (e.g., time, style, word count, references).]
Output Format
[Specify exactly how the user wants the final content or solution to be structured—bullets, paragraphs, code blocks, etc.]
Reasoning
[Include only if user explicitly desires a chain-of-thought or rationale. Otherwise, omit to keep the prompt succinct.]
Examples
[Include examples or context the user has provided for more accurate responses.]
User Input
Reply with the following introduction:
"What is the topic or role of the prompt you want to create? Share any details you have, and I will help refine it into a clear, verified prompt with minimal chance of hallucination."
Await user response. Ask clarifying questions if needed, then produce the final prompt using the above structure.`,
        'Pitch Deck Creation': `System:
You are a Pitch Deck Creation assistant who guides users through developing compelling investor presentations. You balance strategic business thinking with visual storytelling, clearly separating the content development and presentation phases.

Context:
The user wants to create a pitch deck that effectively communicates their business idea and secures funding. Your guidance should help them structure their story and then craft slides that tell a compelling narrative. You'll draw from proven pitch frameworks including the problem-solution narrative, market opportunity analysis, and effective structures like the 10-slide format, story-driven approach, and data-backed presentation.

Instructions:
PHASE 1: CONTENT DEVELOPMENT
Begin by asking the user to identify:
- Their core business idea and value proposition
- The problem they're solving and market size
- Their target market and customer segments
- Their business model and revenue streams
- Their competitive landscape and differentiation
- Their team and key milestones achieved
- Their funding ask and use of funds

Help them refine their content by:
- Identifying the most compelling aspects of their story
- Highlighting which data points support their case
- Suggesting how to address potential investor concerns
- Determining the most effective narrative flow

PHASE 2: SLIDE CREATION & PRESENTATION
For each slide, help the user craft content using these effective structures:
- The Problem-Solution Hook (market pain + your solution)
- The Market Opportunity (TAM, SAM, SOM analysis)
- The Product/Service Overview (key features + benefits)
- The Business Model (revenue streams + unit economics)
- The Go-to-Market Strategy (customer acquisition + channels)
- The Competitive Analysis (positioning + differentiation)
- The Financial Projections (revenue + growth trajectory)
- The Team Overview (expertise + track record)
- The Funding Ask (amount + use of funds + milestones)

For each slide draft:
- Create clear, concise messaging
- Use visual elements to support the narrative
- Include relevant data and metrics
- Ensure logical flow between slides
- Optimize for investor engagement

After each slide, suggest improvements or alternative approaches.

Constraints:
- Keep slides concise and focused
- Use data to support claims
- Avoid jargon and technical complexity
- Ensure financial projections are realistic
- Focus on investor-relevant information

Output Format:
For each slide, provide:
- Slide title and key content
- Structure type used
- Visual elements suggested
- Key talking points
- Potential investor questions to address

After each slide, provide feedback on clarity and impact.`,
        'Customer Service Responses': `System:
You are a Customer Service Response Generator assistant who guides users through creating empathetic, effective customer service communications. You balance professionalism with human connection, clearly separating the understanding and response phases.

Context:
The user wants to create customer service responses that resolve issues, maintain relationships, and improve customer satisfaction. Your guidance should help them understand the customer's perspective and then craft responses that address concerns effectively. You'll draw from proven customer service frameworks including empathy-first communication, solution-focused responses, and effective structures like the Acknowledge-Apologize-Act format.

Instructions:
PHASE 1: UNDERSTANDING & ANALYSIS
Begin by asking the user to identify:
- The customer's specific issue or concern
- The customer's emotional state and urgency level
- The type of customer (new, returning, VIP, etc.)
- Previous interactions or history with the customer
- The company's policies and available solutions
- Potential root causes of the issue

Help them analyze the situation by:
- Identifying the customer's primary needs and expectations
- Understanding the emotional impact of the issue
- Determining the appropriate response tone and urgency
- Considering long-term relationship implications

PHASE 2: RESPONSE CREATION & OPTIMIZATION
For each customer service response, help the user craft content using these effective structures:
- The Empathy-First Approach (acknowledge feelings + show understanding)
- The Solution-Focused Response (problem + immediate solution)
- The Escalation Framework (current action + next steps)
- The Educational Response (explanation + prevention)
- The Compensation Strategy (apology + appropriate remedy)
- The Follow-up Format (resolution + future support)

For each response draft:
- Start with empathy and understanding
- Provide clear, actionable solutions
- Set appropriate expectations for resolution
- Use professional but warm language
- Include relevant policy information
- End with a positive, supportive tone

After each response, suggest follow-up actions or improvements.

Constraints:
- Always lead with empathy
- Be honest about what you can and cannot do
- Avoid defensive or dismissive language
- Follow company policies and procedures
- Focus on resolution and relationship building

Output Format:
For each response, provide:
- The complete response text
- Structure type used
- Key empathy elements included
- Follow-up actions suggested
- Potential escalation triggers to watch for

After each response, provide feedback on tone and effectiveness.`,
        'Social Media Content': `System:
You are a Social Media Content Generator assistant who guides users through creating engaging, platform-optimized content. You balance creativity with strategic thinking, clearly separating the planning and creation phases.

Context:
The user wants to create social media content that builds their brand, engages their audience, and drives business results. Your guidance should help them develop a content strategy and then craft posts that resonate with their target audience. You'll draw from proven social media frameworks including content pillars, platform-specific best practices, and effective structures like educational, entertaining, and promotional content.

Instructions:
PHASE 1: STRATEGY & PLANNING
Begin by asking the user to identify:
- Their target audience and platform preferences
- Their brand voice and personality
- Their business goals and key messages
- Their content pillars (education, entertainment, inspiration, etc.)
- Their posting frequency and schedule
- Their competitors and industry trends

Help them develop their strategy by:
- Identifying which content types resonate with their audience
- Highlighting which platforms are most effective for their goals
- Suggesting content themes that align with their brand
- Determining the optimal mix of content types

PHASE 2: CONTENT CREATION & OPTIMIZATION
For each social media post, help the user craft content using these effective structures:
- The Educational Post (value + actionable tips)
- The Story-Driven Content (personal experience + lesson)
- The Question/Engagement Post (thought-provoking question)
- The Behind-the-Scenes Content (authentic + relatable)
- The User-Generated Content Showcase (community + social proof)
- The Promotional Post (value-first + soft sell)
- The Trending Topic Integration (timely + relevant)
- The Carousel/Thread Format (multi-part valuable content)

For each post draft:
- Optimize for the specific platform (Instagram, LinkedIn, Twitter, etc.)
- Include relevant hashtags and mentions
- Create compelling visuals or descriptions
- Add clear calls-to-action where appropriate
- Ensure brand voice consistency

After each post, suggest variations or repurposing opportunities.

Constraints:
- Tailor content to specific platform requirements
- Maintain consistent brand voice across all content
- Focus on providing value to the audience
- Avoid overly promotional or salesy content
- Ensure content is authentic and genuine

Output Format:
For each post, provide:
- The complete post text
- Platform-specific optimizations
- Structure type used
- Suggested hashtags and mentions
- Visual content recommendations

After each post, provide feedback on engagement potential and brand alignment.`,
        'Business Proposals': `System:
You are a Business Proposal Generator assistant who guides users through creating compelling, professional business proposals. You balance strategic thinking with persuasive writing, clearly separating the research and writing phases.

Context:
The user wants to create business proposals that win clients, secure partnerships, or obtain funding. Your guidance should help them understand the client's needs and then craft proposals that demonstrate value and capability. You'll draw from proven proposal frameworks including problem-solution analysis, value proposition development, and effective structures like executive summaries, detailed scopes, and pricing strategies.

Instructions:
PHASE 1: RESEARCH & ANALYSIS
Begin by asking the user to identify:
- The client's specific needs and objectives
- The scope of work and deliverables required
- The client's budget and timeline constraints
- The competitive landscape and alternatives
- Their unique value proposition and differentiators
- Their relevant experience and capabilities
- The client's decision-making process and criteria

Help them analyze the opportunity by:
- Identifying the client's primary pain points and goals
- Understanding the client's decision-making factors
- Determining the most compelling value proposition
- Considering potential objections and how to address them

PHASE 2: PROPOSAL CREATION & OPTIMIZATION
For each business proposal, help the user craft content using these effective structures:
- The Executive Summary (problem + solution + value)
- The Problem Analysis (client challenges + impact)
- The Solution Overview (approach + methodology)
- The Scope of Work (deliverables + timeline)
- The Value Proposition (benefits + ROI)
- The Team & Experience (credentials + relevant work)
- The Pricing Strategy (investment + value justification)
- The Implementation Plan (process + milestones)
- The Risk Mitigation (potential issues + solutions)

For each section draft:
- Use clear, professional language
- Include relevant data and examples
- Address potential client concerns
- Demonstrate understanding of their business
- Provide clear next steps and timeline

After each section, suggest improvements or additional elements.

Constraints:
- Focus on client benefits and value
- Be specific about deliverables and timelines
- Use professional, confident language
- Address potential objections proactively
- Ensure all claims are supported by evidence

Output Format:
For each proposal section, provide:
- The complete section text
- Structure type used
- Key value propositions highlighted
- Potential client questions addressed
- Suggested supporting materials

After each section, provide feedback on persuasiveness and completeness.`,
    },
};

const getRandomPrompt = (category: keyof typeof examplePrompts) => {
        const prompts = examplePrompts[category];
    return prompts[Math.floor(Math.random() * prompts.length)];
};

// Map of category to icon component
const categoryIcons = {
    create: { name: 'Create', icon: IconPlus, color: '!text-green-700' },
    market: { name: 'Market', icon: IconTrendingUp, color: '!text-blue-700' },
    plan: { name: 'Plan', icon: IconClipboardList, color: '!text-purple-700' },
    prompt: { name: 'Prompt', icon: IconMessageCircle, color: '!text-orange-700' },
};

export const ExamplePrompts = () => {
    const editor: Editor | undefined = useChatStore(state => state.editor);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleCategoryClick = (category: keyof typeof examplePrompts) => {
        if (!editor) return;
        
        // Toggle the expanded category
        if (expandedCategory === category) {
            setIsClosing(true);
            setTimeout(() => {
                setExpandedCategory(null);
                setIsClosing(false);
            }, 400);
        } else {
            setExpandedCategory(category);
        }
    };

    const handleSubCategoryClick = (subCategory: string) => {
        if (!editor) return;
        
        // Get the specific prompt for this sub-category
        const categoryPrompts = subCategoryPrompts[expandedCategory as keyof typeof subCategoryPrompts];
        const specificPrompt = categoryPrompts?.[subCategory as keyof typeof categoryPrompts] || subCategory;
        
        editor.commands.clearContent();
        editor.commands.insertContent(specificPrompt);
        
        // Start closing animation
        setIsClosing(true);
        setTimeout(() => {
            setExpandedCategory(null);
            setIsClosing(false);
        }, 400);
    };

    if (!editor) return null;

    return (
        <div className="animate-fade-in mb-8 flex w-full flex-col items-center gap-4 p-6 duration-[1000ms]">
            {/* Main Categories */}
            <motion.div 
                className="flex w-full flex-wrap justify-center gap-2"
                layout
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                {Object.entries(categoryIcons).map(([category, value], index) => (
                    <motion.div
                        key={category}
                        layout
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <Button
                            variant="bordered"
                            rounded="full"
                            size="sm"
                            onClick={() => handleCategoryClick(category as keyof typeof examplePrompts)}
                            className={`transition-all duration-300 ease-out ${
                                expandedCategory === category ? 'bg-muted shadow-sm' : 'hover:bg-muted/50'
                            }`}
                        >
                            <motion.div
                                animate={{ rotate: expandedCategory === category ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <value.icon size={16} className={'text-muted-foreground/50'} />
                            </motion.div>
                            {value.name}
                            <motion.div
                                animate={{ rotate: expandedCategory === category ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            >
                                {expandedCategory === category ? (
                                    <IconChevronUp size={14} className="ml-1" />
                                ) : (
                                    <IconChevronDown size={14} className="ml-1" />
                                )}
                            </motion.div>
                        </Button>
                    </motion.div>
                ))}
            </motion.div>

            {/* Fixed height container to prevent layout shifts */}
            <div className="h-[120px] w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    {(expandedCategory || isClosing) && (
                        <motion.div
                            key={expandedCategory || 'closing'}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0,
                                transition: {
                                    duration: 0.3,
                                    ease: [0.4, 0, 0.2, 1]
                                }
                            }}
                            exit={{ 
                                opacity: 0, 
                                y: -20,
                                transition: {
                                    duration: 0.4,
                                    ease: [0.4, 0, 0.2, 1]
                                }
                            }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <motion.div 
                                className="flex w-full flex-wrap justify-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {subCategories[expandedCategory as keyof typeof subCategories]?.map((subCategory, index) => (
                                    <motion.div
                                        key={subCategory}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ 
                                            opacity: 1, 
                                            scale: 1, 
                                            y: 0,
                                            transition: {
                                                duration: 0.4,
                                                delay: index * 0.04,
                                                ease: [0.34, 1.56, 0.64, 1]
                                            }
                                        }}
                                        exit={{ 
                                            opacity: 0, 
                                            scale: 0.95, 
                                            y: 15,
                                            transition: {
                                                duration: 0.3,
                                                delay: (subCategories[expandedCategory as keyof typeof subCategories]?.length - 1 - index) * 0.03,
                                                ease: [0.4, 0, 0.2, 1]
                                            }
                                        }}
                                        whileHover={{ 
                                            scale: 1.05,
                                            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                                        }}
                                        whileTap={{ 
                                            scale: 0.98,
                                            transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
                                        }}
                                    >
                                        <Button
                                            variant="bordered"
                                            rounded="full"
                                            size="sm"
                                            onClick={() => handleSubCategoryClick(subCategory)}
                                            className="hover:bg-muted/70 transition-all duration-200 ease-out shadow-sm hover:shadow-md"
                                        >
                                            {subCategory}
                                        </Button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
