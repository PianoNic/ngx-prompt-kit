import { Injectable } from '@angular/core';

type Intent =
  | 'greeting'
  | 'farewell'
  | 'gratitude'
  | 'identity'
  | 'capability'
  | 'help'
  | 'opinion'
  | 'compare'
  | 'howto'
  | 'why'
  | 'when'
  | 'where'
  | 'who'
  | 'list'
  | 'code'
  | 'debug'
  | 'translate'
  | 'summarize'
  | 'math'
  | 'yesno'
  | 'question'
  | 'short'
  | 'fallback';

interface Match {
  intent: Intent;
  test: (lower: string, raw: string) => boolean;
  replies: readonly string[];
}

const RULES: readonly Match[] = [
  {
    intent: 'greeting',
    test: (s) =>
      /^\s*(hi|hello|hey|yo|hola|servus|hallo|sup|good (morning|afternoon|evening))\b/.test(s),
    replies: [
      'Hey — what can I help you with today?',
      "Hi there. What's on your plate?",
      'Hello. Where do you want to start?',
    ],
  },
  {
    intent: 'farewell',
    test: (s) => /\b(bye|goodbye|see ya|cya|later|good night|gn|tschüss|ciao)\b/.test(s),
    replies: [
      'Catch you later. Ping me when you need another pass.',
      'Bye — come back when the next thing breaks.',
      'See you. The conversation will be here when you return.',
    ],
  },
  {
    intent: 'gratitude',
    test: (s) => /\b(thanks|thank you|thx|ty|cheers|appreciate it|danke)\b/.test(s),
    replies: [
      "Anytime. What's next?",
      'Glad it landed. Want to keep going?',
      'No problem — say the word if you need a follow-up.',
    ],
  },
  {
    intent: 'identity',
    test: (s) =>
      /\b(who are you|what are you|your name|are you (gpt|claude|an ai|a bot|human))\b/.test(s),
    replies: [
      "I'm a scripted demo, not a real model. I'm pattern-matching your message to look chat-like — wire ngx-prompt-kit to a real backend to get an actual LLM behind these bubbles.",
      "I'm a dumb mock running in your browser — no API calls. The point is to show off the components, not the brains.",
    ],
  },
  {
    intent: 'capability',
    test: (s) => /\b(what can you (do|help)|capabilit|what do you do)\b/.test(s),
    replies: [
      "Almost nothing — I'm a scripted reply generator pattern-matching your input. The real value here is the UI: typewriter streaming, message edit, action bar, attachments. Plug in a real model to do real work.",
      'I match keywords and pick a canned response. Useful for previewing the kit; not useful for actual answers.',
    ],
  },
  {
    intent: 'help',
    test: (s) => /\b(help me|i need help|stuck|can you help|please help)\b/.test(s),
    replies: [
      "Tell me more — what specifically is blocking you? The more concrete, the better the (mock) reply you'll get.",
      "Sure. Drop the error message, the file path, or what you've tried so far.",
    ],
  },
  {
    intent: 'compare',
    test: (s) => /\b(vs|versus|compare|difference between|better than|or)\b.*\?/.test(s),
    replies: [
      "Short answer: it depends on the constraint you care about most. Tell me what you're optimising for — speed, cost, ergonomics — and I'll give you a sharper take.",
      'Both work. The honest answer is the trade-off matters more than the pick: one usually wins on ergonomics, the other on raw control.',
    ],
  },
  {
    intent: 'howto',
    test: (s) => /^\s*(how (do|can|should|to)|how would)\b/.test(s),
    replies: [
      'Three rough steps: (1) reproduce the smallest version of the problem in isolation, (2) change one variable at a time, (3) confirm the fix on the original case. The middle step is where most of the time goes.',
      "Start by writing down the success condition in one sentence. Most 'how do I' questions get clearer when the goal stops being fuzzy.",
    ],
  },
  {
    intent: 'why',
    test: (s) => /^\s*why\b/.test(s),
    replies: [
      "Usually it's one of three things: a stale assumption, an off-by-one, or something the framework is doing for you that you forgot about. Which feels closest?",
      'Good question to ask. Walk me through what you expected vs what you saw — the gap is where the answer lives.',
    ],
  },
  {
    intent: 'when',
    test: (s) => /^\s*when\b/.test(s),
    replies: [
      'Depends on the trigger. Tell me the surrounding state and I can be specific.',
      "It happens whenever the precondition flips — what's the precondition you're tracking?",
    ],
  },
  {
    intent: 'where',
    test: (s) => /^\s*where\b/.test(s),
    replies: [
      'Most likely in the module that owns that piece of state. If you grep for the symbol, the first non-test hit is usually it.',
      'Check the routing layer first, then the service that the route resolves to.',
    ],
  },
  {
    intent: 'who',
    test: (s) => /^\s*who\b/.test(s),
    replies: [
      'Hard to say without the context — got a name, a team, or a commit hash to anchor on?',
      "If it's a code question: blame the file. If it's a process question: probably whoever owns the area on the org chart.",
    ],
  },
  {
    intent: 'list',
    test: (s) => /\b(list|enumerate|examples of|give me|name (some|a few)|top \d+)\b/.test(s),
    replies: [
      'Off the top of my head: the obvious one, the slightly clever one, and the one nobody mentions until it bites them in production. Want me to expand on any of the three?',
      'A few candidates: the safe default, a faster alternative with sharper edges, and a third option that only makes sense at scale. Which direction do you want to go?',
    ],
  },
  {
    intent: 'code',
    test: (s) =>
      /\b(code|function|class|component|service|signal|computed|effect|typescript|angular|rxjs|tailwind|css|html|api|endpoint)\b/.test(
        s,
      ),
    replies: [
      'Sketch: define the contract first (input + output), then write the smallest implementation that satisfies it, then add a test that pins the behaviour. Refactoring is cheap once those three exist.',
      "Use a signal for state, computed for derived values, and effect only for side effects (DOM writes, logging, fetch). If you find yourself calling .set() inside an effect, that's almost always the wrong shape.",
    ],
  },
  {
    intent: 'debug',
    test: (s) =>
      /\b(error|bug|crash|broken|not working|doesn'?t work|fix|exception|undefined|null)\b/.test(s),
    replies: [
      "Start with the stack trace's first non-framework frame — that's almost always the real culprit. What does it say?",
      'Three things to check: (1) is the input actually what you think it is? log it. (2) is the function being called at the moment you assume? log that too. (3) does the framework do something async between (1) and (2) that you forgot about?',
    ],
  },
  {
    intent: 'translate',
    test: (s) => /\b(translate|translation|in (german|spanish|french|japanese|english))\b/.test(s),
    replies: [
      "I can't actually translate — I'm a scripted mock. In a real app this would route to a translation model or a dedicated API.",
    ],
  },
  {
    intent: 'summarize',
    test: (s) => /\b(summari[sz]e|tl;?dr|short version|in one (sentence|paragraph))\b/.test(s),
    replies: [
      'TL;DR: the boring answer is usually the right one. Pick the option with fewer moving parts and ship it.',
      'One sentence: do the simplest thing that could possibly work, then iterate when it actually breaks instead of when you imagine it might.',
    ],
  },
  {
    intent: 'math',
    test: (_s, raw) => /^\s*[-+(]?\d[\d\s+\-*/().,]*$/.test(raw) && /[+\-*/]/.test(raw),
    replies: ["Looks like math. I won't evaluate it — wire a real backend and the model can."],
  },
  {
    intent: 'yesno',
    test: (s) =>
      /^\s*(should i|can i|is it|are you|do you|does it|will it|would you|could you)\b.*\?/.test(s),
    replies: [
      "Probably yes — but the cost is the boring middle bit nobody wants to do. What's the constraint that makes you ask?",
      "Yes, with one caveat: make sure the rollback path is obvious before you commit. Then it's safe.",
      'No — at least not without a measurement first. Let the data decide; gut calls here usually rot.',
    ],
  },
  {
    intent: 'opinion',
    test: (s) => /\b(what do you think|opinion|do you like|prefer|recommend|suggest)\b/.test(s),
    replies: [
      "Honest take: most of the time the boring choice ages better than the clever one. What are the two options you're weighing?",
      "I'd default to whichever your team can debug at 2am. Familiarity beats theoretical elegance for production code.",
    ],
  },
  {
    intent: 'question',
    test: (_s, raw) => raw.trim().endsWith('?'),
    replies: [
      "Good question. Without more context I'd lean on the obvious answer — but tell me what you've already ruled out and I can be sharper.",
      "It depends on a couple of things I don't have visibility into. What's the surrounding setup?",
    ],
  },
  {
    intent: 'short',
    test: (_s, raw) => raw.trim().split(/\s+/).length <= 2,
    replies: [
      'Say more — I need a bit more to work with.',
      'Got it. What do you want to do with it?',
      "Hmm, that's terse. What's the broader question?",
    ],
  },
];

const FALLBACKS: readonly string[] = [
  "Got it. In a real app I'd reason about that and give you a substantive answer — here I'm pattern-matching for a demo, so the response is canned. Try a clearer question keyword (how / why / what / can / should) to see different scripted shapes.",
  "Noted. This showcase doesn't call a real model, so the reply is generic. Wire ngx-prompt-kit to your backend (OpenAI, Anthropic, local Ollama, whatever) and you'll get an actual answer here.",
  'I hear you. Mock-mode reply: anything I say next would be made up — the showcase ships intent matching for greetings, questions, code, debug, etc., and a fallback for everything else. You hit the fallback.',
];

@Injectable({ providedIn: 'root' })
export class ScriptedLlmService {
  /** Round-robin index per intent so repeated triggers cycle through the variants. */
  private readonly cursors = new Map<Intent, number>();

  reply(userText: string): string {
    const raw = userText ?? '';
    const lower = raw.toLowerCase();
    for (const rule of RULES) {
      if (rule.test(lower, raw)) {
        return this.pick(rule.intent, rule.replies);
      }
    }
    return this.pick('fallback', FALLBACKS);
  }

  private pick(intent: Intent, pool: readonly string[]): string {
    const i = (this.cursors.get(intent) ?? 0) % pool.length;
    this.cursors.set(intent, i + 1);
    return pool[i];
  }
}
