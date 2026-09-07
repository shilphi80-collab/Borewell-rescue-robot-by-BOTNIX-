export interface PromptTemplate {
  id: string;
  category: 'report' | 'pitch' | 'poster' | 'functions';
  title: string;
  targetAudience: string;
  promptText: string;
  tips: string;
}

export const COMPETITION_PROMPTS: PromptTemplate[] = [
  {
    id: 'p-1',
    category: 'report',
    title: 'Comprehensive Written Technical Report Prompt',
    targetAudience: 'Malaysia International Robotics Jury / Technical Committee',
    promptText: `Act as a senior robotics professor and international judge evaluator. Write an exhaustive, highly technical research report for my "Borehole Rescue Robot" designed for the International Robotics Championship in Malaysia.

Here are the details of my robot:
- Robot Name: [Insert Name, e.g. ROBO-RESCUE]
- Problem Addressed: Trapped children in narrow vertical boreholes (150mm - 350mm diameter) up to 45m deep where excavation is too slow and hazardous.
- Key Functions: [List functions: 360 camera, oxygen delivery line, 2-way audio intercom, soft pneumatic inflatable body harness, load-sensed winch].
- How It Was Made: [Describe materials: aluminum chassis, silicone gripper, STM32 MCU, 50m hybrid umbilical].
- Testing & Results: [Describe: tested to 40m, lifted 25kg mannequin, descent time <2 min].

Please generate the report following standard IEEE/Robotics Competition format with:
1. Abstract
2. Introduction & Problem Statement
3. Mechatronics Architecture (Mechanical, Electrical, Firmware)
4. Safety & Pediatric Medical Compliance (Pressure limits & fail-safes)
5. Working Principle & 6-Step Rescue Protocol
6. Experimental Validation & Test Results
7. Conclusion & Global Humanitarian Impact for Malaysia & Southeast Asia.`,
    tips: 'Use this prompt with Gemini to generate polished sections for your written competition paper.',
  },
  {
    id: 'p-2',
    category: 'pitch',
    title: '3-Minute International Jury Pitch & Demonstration Script',
    targetAudience: 'Booth Judges & Referees at Malaysia Round',
    promptText: `Create an impactful 3-minute oral pitch script for me to present my Borehole Rescue Robot to international judges at the competition booth in Malaysia.

Structure it into:
- 0:00 - 0:30 (The Hook): The harrowing reality of children trapped in abandoned boreholes and why current methods fail.
- 0:30 - 1:15 (The Innovation): Introduce my robot's non-invasive pneumatic silicone harness and immediate life-support line (oxygen + audio).
- 1:15 - 2:00 (Live Demonstration Cues): Show how the robot centers in the shaft, scans with dual cameras, and inflates the conformal body harness.
- 2:00 - 2:30 (Validation & Specs): 45m depth, 30kg payload, <3 min deployment time, tested in simulation rig.
- 2:30 - 3:00 (Closing): Ready for real-world disaster relief deployment across Malaysia and developing nations.`,
    tips: 'Practice this in front of a mirror or with your team. Keep the robot powered on to show LED illumination and gripper actuation during the pitch.',
  },
  {
    id: 'p-3',
    category: 'functions',
    title: 'Subsystem & Function Specification Generator Prompt',
    targetAudience: 'Technical Fact Sheet & Exhibition Banner',
    promptText: `Write an engineering specification breakdown for a specific subsystem of my Borehole Rescue Robot:
- Subsystem Name: [e.g. Inflatable Thoracic Rescue Harness]
- Working Principle: How it actuates and grips without harming a child.
- Fail-Safe Features: What happens if power or air leaks.
- Key Metrics: Pressure (kPa), speed (seconds), payload (kg), material grade.

Format it as concise bullet points with engineering precision suitable for a technical competition display board.`,
    tips: 'Ideal when adding a brand-new custom function in the "How It Works" tab of this app.',
  },
  {
    id: 'p-4',
    category: 'poster',
    title: 'Competition Booth Poster / Tri-Fold Layout Prompt',
    targetAudience: 'Conference Poster & Presentation Deck',
    promptText: `Generate a structured layout and concise text content for an A0-sized engineering exhibition poster for my Borehole Rescue Robot at the Malaysia International Round.

Divide into 5 visual quadrants:
1. Title Banner & Team Affiliation
2. Problem Overview with vertical cross-section diagram description
3. Robot Anatomy & Fabrication Callouts (pointing to photos of chassis, PCB, gripper)
4. Functional Workflow Flowchart (Descent -> Inspection -> Life Support -> Capture -> Extraction)
5. Test Data Charts & Field Test Benchmarks.`,
    tips: 'Directly copy text from the "Written Report" and "How It Works" tabs in this app into your design tool (Canva, PowerPoint, or LaTeX).',
  }
];
