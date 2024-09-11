// "use client";
// import { useState } from "react";
// import ReactMarkdown from "react-markdown";

// export default function Home() {
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [setI, setSetI] = useState<string | null>(null);
//   const [setII, setSetII] = useState<string | null>(null);
//   const [setIII, setSetIII] = useState<string | null>(null);
//   const [selectedSet, setSelectedSet] = useState<string | null>(null);
//   const [researchResult, setResearchResult] = useState<any>(null);
//   const [finalResult, setFinalResult] = useState<any>(null);

//   // Function to parse the ideation_result Markdown string
//   const parseMarkdownSets = (markdown: string) => {
//     // Refine the regex to capture each Set (Set I, Set II, Set III) and their content
//     const regex =
//       /(\*\*Set I:\*\*[\s\S]*?)(?=\*\*Set II:\*\*|\*\*Set III:\*\*|\Z)|(\*\*Set II:\*\*[\s\S]*?)(?=\*\*Set III:\*\*|\Z)|(\*\*Set III:\*\*[\s\S]*)/g;

//     const matches = markdown.match(regex);

//     // If we have at least 3 matches, assign the content to the respective sets
//     if (matches && matches.length >= 3) {
//       setSetI(matches[0]);
//       setSetII(matches[1]);
//       setSetIII(matches[2]);
//     } else if (matches && matches.length === 2) {
//       setSetI(matches[0]);
//       setSetII(matches[1]);
//       setSetIII(""); // Set III may be optional
//     } else if (matches && matches.length === 1) {
//       setSetI(matches[0]);
//       setSetII("");
//       setSetIII("");
//     } else {
//       console.error("Failed to parse the Markdown string properly.");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       //   const response = await fetch(
//       //     "https://fastapi-sql-production.up.railway.app/users/execute_agent_teams",
//       //     {
//       //       method: "POST",
//       //       headers: {
//       //         "Content-Type": "application/json",
//       //       },
//       //       body: JSON.stringify({ initial_input: inputText }),
//       //     }
//       //   );
//       //   const data = await response.json();
//       const data = {
//         success: true,
//         ideation_result:
//           '**Set I:**\n- **Titles**\n  1. "How Sugar Affects Your Mood: The Hidden Connection"\n  2. "Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health"\n  3. "The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It"\n  \n- **Thumbnails**\n  1. **Title:** "How Sugar Affects Your Mood: The Hidden Connection"\n     - **Concept:** A split image showing a happy face on one side and a sad face on the other, with sugar cubes in the middle. Bold text overlay: "Sugar = Mood Swings?"\n  2. **Title:** "Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health"\n     - **Concept:** An image of a person breaking chains made of sugar cubes, with a bright background. Text overlay: "Break Free from Sugar!"\n  3. **Title:** "The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It"\n     - **Concept:** A brain with sugar cubes around it, with a magnifying glass focusing on the cubes. Text overlay: "Is Sugar Controlling You?"\n\n- **Video Outline**\n  1. **How Sugar Affects Your Mood: The Hidden Connection**\n     - **Hook:** Start with a relatable scenario of mood swings after consuming sugar.\n     - **Key Points:**\n       - The biochemical impact of sugar on the brain.\n       - Personal anecdotes or testimonials about mood changes.\n       - Scientific studies linking sugar to mood disorders.\n       - Tips for recognizing sugar-induced mood swings.\n       - Actionable steps to reduce sugar for better mood regulation.\n     - **Grand Payoff:** A compelling conclusion that encourages viewers to reflect on their sugar intake and its emotional impact.\n\n  2. **Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health**\n     - **Hook:** Present a shocking statistic about sugar consumption and mental health.\n     - **Key Points:**\n       - Understanding sugar addiction and its effects on mental health.\n       - Step-by-step guide to reducing sugar intake.\n       - Practical tips for healthier alternatives.\n       - Success stories of individuals who improved their mental health by cutting sugar.\n       - Resources for further support and information.\n     - **Grand Payoff:** A motivational call to action encouraging viewers to take the first step towards a sugar-free life.\n\n  3. **The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It**\n     - **Hook:** Start with a powerful statement about sugar being as addictive as drugs.\n     - **Key Points:**\n       - Explanation of the science behind sugar addiction.\n       - The psychological and physiological reasons for cravings.\n       - Strategies to combat sugar cravings effectively.\n       - Personal stories of overcoming sugar addiction.\n       - Expert insights on managing cravings and maintaining mental health.\n     - **Grand Payoff:** A strong message of empowerment, encouraging viewers to reclaim control over their dietary choices.\n\n- **Optimized Prompt for Stage 2**\n  - Research the biochemical effects of sugar on mood and mental health, including relevant studies and statistics. Gather personal testimonials and expert opinions on the impact of sugar reduction on emotional well-being. Identify practical tips and resources for viewers looking to reduce sugar intake.\n\n- **Optimized Prompt for Stage 3**\n  - Target Audience: Adults aged 25-45 dealing with mental health issues, particularly interested in dietary impacts on mood and motivation.\n  - Title: "How Sugar Affects Your Mood: The Hidden Connection"\n  - Thumbnail Concept: A split image of happy and sad faces with sugar cubes in the middle.\n  - Narrative Outline: Start with relatable mood swings, discuss biochemical impacts, share testimonials, and provide actionable steps for reducing sugar intake.\n  - Tone: Informative yet empathetic, encouraging viewers to reflect on their habits.\n  - Keywords: "sugar mood connection," "mental health," "reduce sugar intake."\n  - Call to Action: "Comment below with your experiences and subscribe for more tips on improving your mental health!"\n\n- **Additional Information**\n  - Consider incorporating visuals and graphics to illustrate the scientific concepts discussed. Use engaging storytelling techniques to maintain viewer interest throughout the video.\n\n**Set II:**\n- **Titles**\n  1. "Sugar and Sleep: How Your Diet Affects Your Rest"\n  2. "Real Stories: How Cutting Sugar Changed My Life"\n  \n- **Thumbnails**\n  1. **Title:** "Sugar and Sleep: How Your Diet Affects Your Rest"\n     - **Concept:** A bed with sugar cubes scattered around it, with a person looking restless. Text overlay: "Is Sugar Stealing Your Sleep?"\n  2. **Title:** "Real Stories: How Cutting Sugar Changed My Life"\n     - **Concept:** Before-and-after images of individuals who reduced sugar, with a bright, uplifting background. Text overlay: "Transform Your Life!"\n\n- **Video Outline**\n  1. **Sugar and Sleep: How Your Diet Affects Your Rest**\n     - **Hook:** Start with a relatable scenario of tossing and turning at night.\n     - **Key Points:**\n       - The relationship between sugar intake and sleep quality.\n       - Scientific studies linking sugar to sleep disturbances.\n       - Personal stories of improved sleep after reducing sugar.\n       - Tips for better sleep hygiene and dietary adjustments.\n       - Resources for further reading on sleep and diet.\n     - **Grand Payoff:** A powerful conclusion that encourages viewers to consider their sugar intake for better sleep.\n\n  2. **Real Stories: How Cutting Sugar Changed My Life**\n     - **Hook:** Present a compelling personal story of someone who transformed their life by cutting sugar.\n     - **Key Points:**\n       - Various personal testimonials highlighting different experiences.\n       - The emotional and physical benefits of reducing sugar.\n       - Tips for viewers on how to start their journey.\n       - Expert commentary on the psychological aspects of sugar addiction.\n       - Community support resources for those looking to cut sugar.\n     - **Grand Payoff:** An inspiring message that motivates viewers to take action based on real-life success stories.\n\n- **Optimized Prompt for Stage 2**\n  - Research the effects of sugar on sleep quality, including scientific studies and personal testimonials. Gather compelling stories from individuals who have successfully reduced sugar and the positive changes they experienced in their lives. Identify practical tips for improving sleep and reducing sugar intake.\n\n- **Optimized Prompt for Stage 3**\n  - Target Audience: Adults aged 25-45 dealing with mental health issues, particularly interested in dietary impacts on sleep and personal transformation stories.\n  - Title: "Sugar and Sleep: How Your Diet Affects Your Rest"\n  - Thumbnail Concept: A bed with sugar cubes and a restless person.\n  - Narrative Outline: Start with relatable sleep issues, discuss sugar\'s impact on sleep, share testimonials, and provide actionable tips for better sleep.\n  - Tone: Informative and relatable, encouraging viewers to reflect on their dietary choices.\n  - Keywords: "sugar sleep connection," "diet and rest," "improve sleep quality."\n  - Call to Action: "Share your sleep struggles in the comments and subscribe for more insights on health and wellness!"\n\n- **Additional Information**\n  - Utilize engaging visuals and animations to illustrate the connection between sugar and sleep. Incorporate expert interviews to enhance credibility and provide depth to the discussion.\n\n**Set III:**\n- **Titles**\n  1. "The Hidden Dangers of Sugar: What You Need to Know"\n  2. "Sugar Detox: A 30-Day Challenge for Better Mental Health"\n  \n- **Thumbnails**\n  1. **Title:** "The Hidden Dangers of Sugar: What You Need to Know"\n     - **Concept:** A dark background with a sugar skull and warning signs. Text overlay: "Are You at Risk?"\n  2. **Title:** "Sugar Detox: A 30-Day Challenge for Better Mental Health"\n     - **Concept:** A calendar with sugar-free days marked, with a person looking determined. Text overlay: "Join the Challenge!"\n\n- **Video Outline**\n  1. **The Hidden Dangers of Sugar: What You Need to Know**\n     - **Hook:** Start with a shocking fact about sugar consumption.\n     - **Key Points:**\n       - Discuss the hidden dangers of sugar in everyday foods.\n       - Scientific evidence linking sugar to various health issues.\n       - Personal stories of health transformations after reducing sugar.\n       - Tips for identifying hidden sugars in products.\n       - Resources for further education on sugar consumption.\n     - **Grand Payoff:** A strong call to action for viewers to reassess their sugar intake and make informed choices.\n\n  2. **Sugar Detox: A 30-Day Challenge for Better Mental Health**\n     - **Hook:** Present a compelling invitation to join a community challenge.\n     - **Key Points:**\n       - Outline the benefits of a sugar detox for mental health.\n       - Provide a step-by-step guide for the 30-day challenge.\n       - Share success stories from participants.\n       - Tips for overcoming cravings and staying motivated.\n       - Community support resources for participants.\n     - **Grand Payoff:** An empowering message encouraging viewers to take the challenge and share their journey.\n\n- **Optimized Prompt for Stage 2**\n  - Research the hidden dangers of sugar in common foods and the health implications of excessive sugar consumption. Gather testimonials from individuals who have undergone a sugar detox and the positive changes they experienced. Identify practical steps for viewers to participate in a sugar detox challenge.\n\n- **Optimized Prompt for Stage 3**\n  - Target Audience: Adults aged 25-45 dealing with mental health issues, particularly interested in understanding sugar\'s dangers and participating in health challenges.\n  - Title: "The Hidden Dangers of Sugar: What You Need to Know"\n  - Thumbnail Concept: A dark background with a sugar skull and warning signs.\n  - Narrative Outline: Start with a shocking fact, discuss hidden dangers, share testimonials, and provide actionable steps for reducing sugar intake.\n  - Tone: Urgent and informative, motivating viewers to take action.\n  - Keywords: "hidden dangers of sugar," "sugar detox," "mental health improvement."\n  - Call to Action: "Comment below if you\'re ready to take control of your health and subscribe for more life-changing tips!"\n\n- **Additional Information**\n  - Incorporate engaging graphics and animations to illustrate the dangers of sugar. Use a mix of personal stories and expert insights to create a compelling narrative that resonates with viewers. \n\n**Next Steps:** Coordinate with the SEO_Platform_Strategist and Target_Audience_Trend_Alchemist to ensure alignment with the overall content strategy and gather feedback for further refinement.',
//         research_result:
//           '# SEO Optimization Report for Proposed Video Topics on Sugar and Health\n\n## 1. How Sugar Affects Your Mood: The Hidden Connection\n\n### Keyword Analysis\n- **Keywords:** Sugar, Mood, Mental Health, Depression\n- **Search Volume:** 12,000\n- **Competition Index:** 0.45 (Low)\n- **Average Bid:** $1.20\n- **Trend:** Increasing\n\n### Title & Thumbnail Feedback\n- **Title:** Strongly relevant; consider adding "Science" for more authority: "The Science of How Sugar Affects Your Mood."\n- **Thumbnail:** Use a split image showing "Happy" vs. "Sad" faces with sugar visuals.\n\n### Content Outline Assessment\n- Include scientific studies and personal anecdotes.\n- Use bullet points for clarity on sugar\'s biochemical effects.\n\n---\n\n## 2. Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health\n\n### Keyword Analysis\n- **Keywords:** Break Sugar Addiction, Mental Health, Guide\n- **Search Volume:** 8,500\n- **Competition Index:** 0.35 (Low)\n- **Average Bid:** $1.00\n- **Trend:** Stable\n\n### Title & Thumbnail Feedback\n- **Title:** Effective; consider "Your Ultimate Guide to Breaking Free from Sugar."\n- **Thumbnail:** Use a visual of chains breaking with sugar cubes.\n\n### Content Outline Assessment\n- Provide actionable steps and success stories.\n- Include a checklist for viewers to follow.\n\n---\n\n## 3. The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It\n\n### Keyword Analysis\n- **Keywords:** Sugar Addiction, Quit Sugar, Science\n- **Search Volume:** 9,000\n- **Competition Index:** 0.50 (Moderate)\n- **Average Bid:** $1.50\n- **Trend:** Increasing\n\n### Title & Thumbnail Feedback\n- **Title:** Strong; consider "Understanding Sugar Addiction: The Science Behind It."\n- **Thumbnail:** Use brain imagery with sugar visuals.\n\n### Content Outline Assessment\n- Discuss psychological aspects and withdrawal symptoms.\n- Include expert opinions and research findings.\n\n---\n\n## 4. Sugar and Sleep: How Your Diet Affects Your Rest\n\n### Keyword Analysis\n- **Keywords:** Sugar, Sleep Quality, Diet\n- **Search Volume:** 7,500\n- **Competition Index:** 0.40 (Low)\n- **Average Bid:** $1.10\n- **Trend:** Increasing\n\n### Title & Thumbnail Feedback\n- **Title:** Good; consider "How Sugar Impacts Your Sleep Quality."\n- **Thumbnail:** Use a visual of a bed with sugar cubes.\n\n### Content Outline Assessment\n- Explore studies linking sugar intake and sleep disturbances.\n- Provide tips for better sleep hygiene.\n\n---\n\n## 5. Real Stories: How Cutting Sugar Changed My Life\n\n### Keyword Analysis\n- **Keywords:** Sugar Reduction, Personal Stories, Health Transformation\n- **Search Volume:** 6,000\n- **Competition Index:** 0.30 (Low)\n- **Average Bid:** $0.90\n- **Trend:** Stable\n\n### Title & Thumbnail Feedback\n- **Title:** Engaging; consider "Transformative Stories: Cutting Sugar for Better Health."\n- **Thumbnail:** Use before-and-after visuals of individuals.\n\n### Content Outline Assessment\n- Feature testimonials and personal journeys.\n- Include a call-to-action for viewers to share their stories.\n\n---\n\n## General Recommendations\n- **Keyword Cannibalization:** Ensure titles are distinct to avoid overlap in search results.\n- **Platform Compliance:** Adhere to community guidelines regarding health claims.\n- **Visual Content:** Create infographics summarizing key points from studies for better engagement.\n\nBy implementing these recommendations, the proposed video topics can achieve higher visibility and engagement while effectively addressing the target audience\'s interests.',
//         total_process_time: 156.52844619750977,
//       };
//       console.log(data.ideation_result);
//       parseMarkdownSets(data.ideation_result); // Parse ideation_result
//       setResearchResult(data.research_result);
//     } catch (error) {
//       console.error("Error fetching ideation data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateScript = async () => {
//     setLoading(true);
//     try {
//       //   const response = await fetch(
//       //     "https://fastapi-sql-production.up.railway.app/users/generate_script",
//       //     {
//       //       method: "POST",
//       //       headers: {
//       //         "Content-Type": "application/json",
//       //       },
//       //       body: JSON.stringify({
//       //         ideation_result: selectedSet,
//       //         research_result: researchResult,
//       //       }),
//       //     }
//       //   );
//       //   const data = await response.json();
//       console.log(selectedSet);
//   const data = {
//     success: true,
//     ideation_result:
//       '**Set I:**\n- **Titles**\n  1. "How Sugar Affects Your Mood: The Hidden Connection"\n  2. "Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health"\n  3. "The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It"\n  \n- **Thumbnails**\n  1. **Title:** "How Sugar Affects Your Mood: The Hidden Connection"\n     - **Concept:** A split image showing a happy face on one side and a sad face on the other, with sugar cubes in the middle. Bold text overlay: "Sugar = Mood Swings?"\n  2. **Title:** "Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health"\n     - **Concept:** An image of a person breaking chains made of sugar cubes, with a bright background. Text overlay: "Break Free from Sugar!"\n  3. **Title:** "The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It"\n     - **Concept:** A brain with sugar cubes around it, with a magnifying glass focusing on the cubes. Text overlay: "Is Sugar Controlling You?"\n\n- **Video Outline**\n  1. **How Sugar Affects Your Mood: The Hidden Connection**\n     - **Hook:** Start with a relatable scenario of mood swings after consuming sugar.\n     - **Key Points:**\n       - The biochemical impact of sugar on the brain.\n       - Personal anecdotes or testimonials about mood changes.\n       - Scientific studies linking sugar to mood disorders.\n       - Tips for recognizing sugar-induced mood swings.\n       - Actionable steps to reduce sugar for better mood regulation.\n     - **Grand Payoff:** A compelling conclusion that encourages viewers to reflect on their sugar intake and its emotional impact.\n\n  2. **Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health**\n     - **Hook:** Present a shocking statistic about sugar consumption and mental health.\n     - **Key Points:**\n       - Understanding sugar addiction and its effects on mental health.\n       - Step-by-step guide to reducing sugar intake.\n       - Practical tips for healthier alternatives.\n       - Success stories of individuals who improved their mental health by cutting sugar.\n       - Resources for further support and information.\n     - **Grand Payoff:** A motivational call to action encouraging viewers to take the first step towards a sugar-free life.\n\n  3. **The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It**\n     - **Hook:** Start with a powerful statement about sugar being as addictive as drugs.\n     - **Key Points:**\n       - Explanation of the science behind sugar addiction.\n       - The psychological and physiological reasons for cravings.\n       - Strategies to combat sugar cravings effectively.\n       - Personal stories of overcoming sugar addiction.\n       - Expert insights on managing cravings and maintaining mental health.\n     - **Grand Payoff:** A strong message of empowerment, encouraging viewers to reclaim control over their dietary choices.\n\n- **Optimized Prompt for Stage 2**\n  - Research the biochemical effects of sugar on mood and mental health, including relevant studies and statistics. Gather personal testimonials and expert opinions on the impact of sugar reduction on emotional well-being. Identify practical tips and resources for viewers looking to reduce sugar intake.\n\n- **Optimized Prompt for Stage 3**\n  - Target Audience: Adults aged 25-45 dealing with mental health issues, particularly interested in dietary impacts on mood and motivation.\n  - Title: "How Sugar Affects Your Mood: The Hidden Connection"\n  - Thumbnail Concept: A split image of happy and sad faces with sugar cubes in the middle.\n  - Narrative Outline: Start with relatable mood swings, discuss biochemical impacts, share testimonials, and provide actionable steps for reducing sugar intake.\n  - Tone: Informative yet empathetic, encouraging viewers to reflect on their habits.\n  - Keywords: "sugar mood connection," "mental health," "reduce sugar intake."\n  - Call to Action: "Comment below with your experiences and subscribe for more tips on improving your mental health!"\n\n- **Additional Information**\n  - Consider incorporating visuals and graphics to illustrate the scientific concepts discussed. Use engaging storytelling techniques to maintain viewer interest throughout the video.\n\n**Set II:**\n- **Titles**\n  1. "Sugar and Sleep: How Your Diet Affects Your Rest"\n  2. "Real Stories: How Cutting Sugar Changed My Life"\n  \n- **Thumbnails**\n  1. **Title:** "Sugar and Sleep: How Your Diet Affects Your Rest"\n     - **Concept:** A bed with sugar cubes scattered around it, with a person looking restless. Text overlay: "Is Sugar Stealing Your Sleep?"\n  2. **Title:** "Real Stories: How Cutting Sugar Changed My Life"\n     - **Concept:** Before-and-after images of individuals who reduced sugar, with a bright, uplifting background. Text overlay: "Transform Your Life!"\n\n- **Video Outline**\n  1. **Sugar and Sleep: How Your Diet Affects Your Rest**\n     - **Hook:** Start with a relatable scenario of tossing and turning at night.\n     - **Key Points:**\n       - The relationship between sugar intake and sleep quality.\n       - Scientific studies linking sugar to sleep disturbances.\n       - Personal stories of improved sleep after reducing sugar.\n       - Tips for better sleep hygiene and dietary adjustments.\n       - Resources for further reading on sleep and diet.\n     - **Grand Payoff:** A powerful conclusion that encourages viewers to consider their sugar intake for better sleep.\n\n  2. **Real Stories: How Cutting Sugar Changed My Life**\n     - **Hook:** Present a compelling personal story of someone who transformed their life by cutting sugar.\n     - **Key Points:**\n       - Various personal testimonials highlighting different experiences.\n       - The emotional and physical benefits of reducing sugar.\n       - Tips for viewers on how to start their journey.\n       - Expert commentary on the psychological aspects of sugar addiction.\n       - Community support resources for those looking to cut sugar.\n     - **Grand Payoff:** An inspiring message that motivates viewers to take action based on real-life success stories.\n\n- **Optimized Prompt for Stage 2**\n  - Research the effects of sugar on sleep quality, including scientific studies and personal testimonials. Gather compelling stories from individuals who have successfully reduced sugar and the positive changes they experienced in their lives. Identify practical tips for improving sleep and reducing sugar intake.\n\n- **Optimized Prompt for Stage 3**\n  - Target Audience: Adults aged 25-45 dealing with mental health issues, particularly interested in dietary impacts on sleep and personal transformation stories.\n  - Title: "Sugar and Sleep: How Your Diet Affects Your Rest"\n  - Thumbnail Concept: A bed with sugar cubes and a restless person.\n  - Narrative Outline: Start with relatable sleep issues, discuss sugar\'s impact on sleep, share testimonials, and provide actionable tips for better sleep.\n  - Tone: Informative and relatable, encouraging viewers to reflect on their dietary choices.\n  - Keywords: "sugar sleep connection," "diet and rest," "improve sleep quality."\n  - Call to Action: "Share your sleep struggles in the comments and subscribe for more insights on health and wellness!"\n\n- **Additional Information**\n  - Utilize engaging visuals and animations to illustrate the connection between sugar and sleep. Incorporate expert interviews to enhance credibility and provide depth to the discussion.\n\n**Set III:**\n- **Titles**\n  1. "The Hidden Dangers of Sugar: What You Need to Know"\n  2. "Sugar Detox: A 30-Day Challenge for Better Mental Health"\n  \n- **Thumbnails**\n  1. **Title:** "The Hidden Dangers of Sugar: What You Need to Know"\n     - **Concept:** A dark background with a sugar skull and warning signs. Text overlay: "Are You at Risk?"\n  2. **Title:** "Sugar Detox: A 30-Day Challenge for Better Mental Health"\n     - **Concept:** A calendar with sugar-free days marked, with a person looking determined. Text overlay: "Join the Challenge!"\n\n- **Video Outline**\n  1. **The Hidden Dangers of Sugar: What You Need to Know**\n     - **Hook:** Start with a shocking fact about sugar consumption.\n     - **Key Points:**\n       - Discuss the hidden dangers of sugar in everyday foods.\n       - Scientific evidence linking sugar to various health issues.\n       - Personal stories of health transformations after reducing sugar.\n       - Tips for identifying hidden sugars in products.\n       - Resources for further education on sugar consumption.\n     - **Grand Payoff:** A strong call to action for viewers to reassess their sugar intake and make informed choices.\n\n  2. **Sugar Detox: A 30-Day Challenge for Better Mental Health**\n     - **Hook:** Present a compelling invitation to join a community challenge.\n     - **Key Points:**\n       - Outline the benefits of a sugar detox for mental health.\n       - Provide a step-by-step guide for the 30-day challenge.\n       - Share success stories from participants.\n       - Tips for overcoming cravings and staying motivated.\n       - Community support resources for participants.\n     - **Grand Payoff:** An empowering message encouraging viewers to take the challenge and share their journey.\n\n- **Optimized Prompt for Stage 2**\n  - Research the hidden dangers of sugar in common foods and the health implications of excessive sugar consumption. Gather testimonials from individuals who have undergone a sugar detox and the positive changes they experienced. Identify practical steps for viewers to participate in a sugar detox challenge.\n\n- **Optimized Prompt for Stage 3**\n  - Target Audience: Adults aged 25-45 dealing with mental health issues, particularly interested in understanding sugar\'s dangers and participating in health challenges.\n  - Title: "The Hidden Dangers of Sugar: What You Need to Know"\n  - Thumbnail Concept: A dark background with a sugar skull and warning signs.\n  - Narrative Outline: Start with a shocking fact, discuss hidden dangers, share testimonials, and provide actionable steps for reducing sugar intake.\n  - Tone: Urgent and informative, motivating viewers to take action.\n  - Keywords: "hidden dangers of sugar," "sugar detox," "mental health improvement."\n  - Call to Action: "Comment below if you\'re ready to take control of your health and subscribe for more life-changing tips!"\n\n- **Additional Information**\n  - Incorporate engaging graphics and animations to illustrate the dangers of sugar. Use a mix of personal stories and expert insights to create a compelling narrative that resonates with viewers. \n\n**Next Steps:** Coordinate with the SEO_Platform_Strategist and Target_Audience_Trend_Alchemist to ensure alignment with the overall content strategy and gather feedback for further refinement.',
//     research_result:
//       '# SEO Optimization Report for Proposed Video Topics on Sugar and Health\n\n## 1. How Sugar Affects Your Mood: The Hidden Connection\n\n### Keyword Analysis\n- **Keywords:** Sugar, Mood, Mental Health, Depression\n- **Search Volume:** 12,000\n- **Competition Index:** 0.45 (Low)\n- **Average Bid:** $1.20\n- **Trend:** Increasing\n\n### Title & Thumbnail Feedback\n- **Title:** Strongly relevant; consider adding "Science" for more authority: "The Science of How Sugar Affects Your Mood."\n- **Thumbnail:** Use a split image showing "Happy" vs. "Sad" faces with sugar visuals.\n\n### Content Outline Assessment\n- Include scientific studies and personal anecdotes.\n- Use bullet points for clarity on sugar\'s biochemical effects.\n\n---\n\n## 2. Breaking Free from Sugar: A Step-by-Step Guide to Improve Your Mental Health\n\n### Keyword Analysis\n- **Keywords:** Break Sugar Addiction, Mental Health, Guide\n- **Search Volume:** 8,500\n- **Competition Index:** 0.35 (Low)\n- **Average Bid:** $1.00\n- **Trend:** Stable\n\n### Title & Thumbnail Feedback\n- **Title:** Effective; consider "Your Ultimate Guide to Breaking Free from Sugar."\n- **Thumbnail:** Use a visual of chains breaking with sugar cubes.\n\n### Content Outline Assessment\n- Provide actionable steps and success stories.\n- Include a checklist for viewers to follow.\n\n---\n\n## 3. The Science of Sugar Addiction: Why It’s Hard to Quit and How to Do It\n\n### Keyword Analysis\n- **Keywords:** Sugar Addiction, Quit Sugar, Science\n- **Search Volume:** 9,000\n- **Competition Index:** 0.50 (Moderate)\n- **Average Bid:** $1.50\n- **Trend:** Increasing\n\n### Title & Thumbnail Feedback\n- **Title:** Strong; consider "Understanding Sugar Addiction: The Science Behind It."\n- **Thumbnail:** Use brain imagery with sugar visuals.\n\n### Content Outline Assessment\n- Discuss psychological aspects and withdrawal symptoms.\n- Include expert opinions and research findings.\n\n---\n\n## 4. Sugar and Sleep: How Your Diet Affects Your Rest\n\n### Keyword Analysis\n- **Keywords:** Sugar, Sleep Quality, Diet\n- **Search Volume:** 7,500\n- **Competition Index:** 0.40 (Low)\n- **Average Bid:** $1.10\n- **Trend:** Increasing\n\n### Title & Thumbnail Feedback\n- **Title:** Good; consider "How Sugar Impacts Your Sleep Quality."\n- **Thumbnail:** Use a visual of a bed with sugar cubes.\n\n### Content Outline Assessment\n- Explore studies linking sugar intake and sleep disturbances.\n- Provide tips for better sleep hygiene.\n\n---\n\n## 5. Real Stories: How Cutting Sugar Changed My Life\n\n### Keyword Analysis\n- **Keywords:** Sugar Reduction, Personal Stories, Health Transformation\n- **Search Volume:** 6,000\n- **Competition Index:** 0.30 (Low)\n- **Average Bid:** $0.90\n- **Trend:** Stable\n\n### Title & Thumbnail Feedback\n- **Title:** Engaging; consider "Transformative Stories: Cutting Sugar for Better Health."\n- **Thumbnail:** Use before-and-after visuals of individuals.\n\n### Content Outline Assessment\n- Feature testimonials and personal journeys.\n- Include a call-to-action for viewers to share their stories.\n\n---\n\n## General Recommendations\n- **Keyword Cannibalization:** Ensure titles are distinct to avoid overlap in search results.\n- **Platform Compliance:** Adhere to community guidelines regarding health claims.\n- **Visual Content:** Create infographics summarizing key points from studies for better engagement.\n\nBy implementing these recommendations, the proposed video topics can achieve higher visibility and engagement while effectively addressing the target audience\'s interests.',
//     total_process_time: 156.52844619750977,
//   };
//       setFinalResult(data);
//     } catch (error) {
//       console.error("Error generating script:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 text-black">
//       <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
//         Ideation Generator
//       </h1>

//       {/* Input Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mb-6"
//       >
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Enter your text"
//           required
//           className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
//         >
//           Submit
//         </button>
//       </form>

//       {/* Loading Spinner */}
//       {loading && <p className="text-center text-indigo-600">Loading...</p>}

//       {/* Display Ideation Data in Boxes */}
//       {setI && setII && setIII && (
//         <div className="max-w-3xl mx-auto">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Choose a Set:
//           </h2>
//           <div className="space-y-4">
//             <label className="flex items-start space-x-3">
//               <input
//                 type="radio"
//                 value="Set I"
//                 checked={selectedSet === "Set I"}
//                 onChange={() => setSelectedSet(setI!)}
//                 className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:bg-indigo-500"
//               />
//               <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
//                 <ReactMarkdown>{setI}</ReactMarkdown>
//               </div>
//             </label>

//             <label className="flex items-start space-x-3">
//               <input
//                 type="radio"
//                 value="Set II"
//                 checked={selectedSet === "Set II"}
//                 onChange={() => setSelectedSet(setII!)}
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
//               />
//               <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
//                 <ReactMarkdown>{setII}</ReactMarkdown>
//               </div>
//             </label>

//             <label className="flex items-start space-x-3">
//               <input
//                 type="radio"
//                 value="Set III"
//                 checked={selectedSet === "Set III"}
//                 onChange={() => setSelectedSet(setIII!)}
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
//               />
//               <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
//                 <ReactMarkdown>{setIII}</ReactMarkdown>
//               </div>
//             </label>
//           </div>

//           <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
//             Research Result:
//           </h3>
//           <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
//             <ReactMarkdown>{researchResult}</ReactMarkdown>
//           </div>

//           <button
//             onClick={handleGenerateScript}
//             className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
//           >
//             Generate Script
//           </button>
//         </div>
//       )}

//       {/* Final Output */}
//       {finalResult && (
//         <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Generated Script
//           </h2>
//           <pre className="bg-gray-100 p-4 rounded-lg">
//             {JSON.stringify(finalResult, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [setI, setSetI] = useState<string | null>(null);
  const [setII, setSetII] = useState<string | null>(null);
  const [setIII, setSetIII] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [researchResult, setResearchResult] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<any>(null);

  //   const parseMarkdownSets = (markdown: string) => {
  //     const regex =
  //       /(\*\*Set I:\*\*[\s\S]*?)(?=\*\*Set II:\*\*|\*\*Set III:\*\*|\Z)|(\*\*Set II:\*\*[\s\S]*?)(?=\*\*Set III:\*\*|\Z)|(\*\*Set III:\*\*[\s\S]*)/g;
  //     const matches = markdown.match(regex);

  //     if (matches && matches.length >= 3) {
  //       setSetI(matches[0]);
  //       setSetII(matches[1]);
  //       setSetIII(matches[2]);
  //     } else if (matches && matches.length === 2) {
  //       setSetI(matches[0]);
  //       setSetII(matches[1]);
  //       setSetIII(""); // Set III may be optional
  //     } else if (matches && matches.length === 1) {
  //       setSetI(matches[0]);
  //       setSetII("");
  //       setSetIII("");
  //     } else {
  //       console.error("Failed to parse the Markdown string properly.");
  //     }
  //   };
  const parseMarkdownSets = (markdown: string) => {
    // Updated regex to capture content between the sets, without including '**'
    const regex =
      /Set I:[\s\S]*?(?=Set II:|Set III:|\Z)|Set II:[\s\S]*?(?=Set III:|\Z)|Set III:[\s\S]*/g;

    // Matching content between the Set markers
    const matches = markdown.match(regex);

    if (matches && matches.length >= 3) {
      setSetI(matches[0].replace(/Set I:/, "").trim()); // Remove "Set I:" and trim any extra spaces
      setSetII(matches[1].replace(/Set II:/, "").trim()); // Remove "Set II:" and trim any extra spaces
      setSetIII(matches[2].replace(/Set III:/, "").trim()); // Remove "Set III:" and trim any extra spaces
    } else if (matches && matches.length === 2) {
      setSetI(matches[0].replace(/Set I:/, "").trim());
      setSetII(matches[1].replace(/Set II:/, "").trim());
      setSetIII(""); // Set III may be optional
    } else if (matches && matches.length === 1) {
      setSetI(matches[0].replace(/Set I:/, "").trim());
      setSetII("");
      setSetIII("");
    } else {
      console.error("Failed to parse the Markdown string properly.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://fastapi-sql-production.up.railway.app/users/execute_agent_teams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initial_input: inputText }),
        }
      );
      const data = await response.json();

      parseMarkdownSets(data.ideation_result);
      setResearchResult(data.research_result);
    } catch (error) {
      console.error("Error fetching ideation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://fastapi-sql-production.up.railway.app/users/generate_script",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ideation_result: selectedSet,
            research_result: researchResult,
          }),
        }
      );
      const data = await response.json();

      setFinalResult(data);
    } catch (error) {
      console.error("Error generating script:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
        Script Generator
      </h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text"
          required
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Submit
        </button>
      </form>

      {/* Display Ideation Data in Dropdown */}
      {setI && setII && setIII && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Choose a Set:
          </h2>
          <div className="mb-6">
            <select
              value={selectedSet || ""}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select a Set
              </option>
              <option value={setI}>Set I</option>
              <option value={setII}>Set II</option>
              <option value={setIII}>Set III</option>
            </select>
          </div>

          {/* Render the selected markdown content */}
          {selectedSet && (
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <ReactMarkdown>{selectedSet}</ReactMarkdown>
            </div>
          )}

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
            Research Result:
          </h3>
          <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <ReactMarkdown>{researchResult}</ReactMarkdown>
          </div>

          <button
            onClick={handleGenerateScript}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Generate Script
          </button>
        </div>
      )}
      {/* Loading Spinner */}
      {loading && <p className="text-center text-indigo-600">Loading...</p>}
      {/* Final Output */}
      {finalResult && finalResult.final_script && (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Generated Script
          </h2>

          {/* Final Script */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Final Script:
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ReactMarkdown>
                {finalResult.final_script.Scientific_Accuracy_Clarity_Guardian}
              </ReactMarkdown>
            </div>
          </div>

          {/* Refined Call to Action */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Refined Call to Action:
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ReactMarkdown>
                {
                  finalResult.final_script
                    .Call_to_Action_Channel_Integration_Specialist
                }
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
