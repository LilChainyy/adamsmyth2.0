export interface EducationalArticle {
  title: string;
  content: string;
  category: string;
  dimension:
    | "business_model"
    | "financials"
    | "competitive_position"
    | "risks"
    | "news_catalysts"
    | "valuation_context";
}

export const educationalArticles: EducationalArticle[] = [
  {
    title: "What is a P/E ratio and why it matters",
    dimension: "valuation_context",
    category: "valuation",
    content: `The Price-to-Earnings (P/E) ratio is one of the most widely used metrics for evaluating whether a stock is expensive or cheap relative to how much money the company makes. Think of it like buying a lemonade stand: if the stand earns $10/year and someone asks $100 for it, the P/E ratio is 10. You're paying 10 years' worth of earnings upfront.

To calculate it, divide the stock price by earnings per share (EPS). A stock trading at $150 with EPS of $6 has a P/E of 25. This means investors are willing to pay $25 for every $1 of current earnings.

Why does this matter? A high P/E (say 40+) usually means investors expect the company to grow earnings fast in the future — they're paying a premium for that expected growth. A low P/E (say 10-15) might mean the market expects slow growth, or it could signal an undervalued opportunity.

But P/E alone doesn't tell the full story. You need to compare it to peers in the same industry (tech companies typically have higher P/Es than utilities), the company's own historical P/E, and the growth rate. A P/E of 30 for a company growing earnings 30% per year is very different from a P/E of 30 for one growing at 5%.

Common pitfalls: P/E can be misleading when earnings are temporarily depressed (making P/E look artificially high) or when the company had a one-time gain (making P/E look artificially low). For companies with no earnings yet, P/E doesn't work at all — that's when you'd use Price-to-Sales instead.`,
  },
  {
    title: "How to read a company's revenue breakdown",
    dimension: "business_model",
    category: "fundamentals",
    content: `Understanding where a company's money comes from is like reading the menu at a restaurant — it tells you what they actually sell. Most large companies have multiple revenue streams, and knowing the breakdown reveals the real business behind the brand.

Take Apple: most people think "iPhones," but Apple actually reports revenue across five segments — iPhone, Mac, iPad, Wearables, and Services. Knowing that Services (App Store, iCloud, Apple Music) is the fastest-growing and highest-margin segment changes how you think about Apple's future.

Where to find this: Look in the company's quarterly earnings release or annual 10-K filing under "Revenue by Segment" or "Revenue Disaggregation." Financial data sites also summarize this nicely.

Key things to look for in a revenue breakdown:

Concentration risk: If 70%+ of revenue comes from one product or customer, the company is vulnerable. Imagine a three-legged stool with one leg doing all the work.

Growth drivers: Which segment is growing fastest? That often becomes the company's future identity. Amazon was "just a bookstore" until AWS became its profit engine.

Margin differences: Not all revenue is equal. A dollar of software revenue might yield $0.80 of profit, while a dollar of hardware revenue might yield only $0.20. Companies pivoting toward higher-margin segments are often rewarded by investors.

Geographic breakdown: Some companies also break out revenue by region. Strong international growth can signal a company isn't dependent on a single market.

When you see a revenue breakdown, ask yourself: "If I had to bet on which segment will matter most in 5 years, which would it be?" That question cuts through the noise.`,
  },
  {
    title: "Understanding profit margins",
    dimension: "financials",
    category: "fundamentals",
    content: `Profit margins tell you how much of every dollar in revenue a company actually keeps as profit. Think of it like this: if you run a pizza shop that brings in $1,000/day but spends $900 on ingredients, rent, and staff, your profit margin is 10%. You keep $100 for every $1,000 earned.

There are three levels of margin, and each tells a different story:

Gross Margin = (Revenue - Cost of Goods Sold) / Revenue. This shows the basic profitability of the product itself. A software company might have 80% gross margins (it costs very little to deliver software to one more customer), while a grocery store might have 25% (food costs a lot relative to selling price).

Operating Margin = Operating Income / Revenue. This subtracts all the operating expenses — salaries, marketing, R&D, rent. It tells you how efficiently the company is run. Two companies can have the same gross margin but very different operating margins if one spends heavily on marketing.

Net Margin = Net Income / Revenue. This is the bottom line — what's left after taxes, interest, and everything else. It's the truest measure of "how much does the company actually earn?"

Why margins matter more than raw profit numbers: A company earning $1 billion sounds impressive, but if it took $100 billion of revenue to get there (1% net margin), the business is extremely thin. Margins reveal the quality of earnings.

Trend matters most. A company whose operating margin expanded from 15% to 20% over three years is becoming more efficient — a positive signal. Shrinking margins might mean rising competition or poor cost control.

Industry context is essential. Comparing a SaaS company's margins (often 20-30% net) to a retailer's (often 2-5% net) is apples to oranges. Always compare within the same sector.`,
  },
  {
    title: "What is a competitive moat?",
    dimension: "competitive_position",
    category: "strategy",
    content: `Warren Buffett popularized the idea of a "moat" — a sustainable competitive advantage that protects a company from competitors the way a moat protects a castle. Companies with wide moats can maintain high profits for years because competitors can't easily replicate what they do.

There are several types of moats:

Network Effects: The product becomes more valuable as more people use it. Facebook, Visa, and Airbnb all benefit — each new user makes the platform better for everyone else. It's like a phone network: the first phone was useless, but now that billions exist, not being on one puts you at a disadvantage.

Switching Costs: It's painful to leave. Think of enterprise software like Salesforce — a company that spent years building workflows around it won't easily switch to a competitor. The hassle and retraining costs create stickiness.

Cost Advantages: Some companies can produce goods cheaper due to scale, geography, or proprietary processes. Walmart's massive scale lets it negotiate lower prices from suppliers, which it passes to customers, making it hard for smaller retailers to compete.

Intangible Assets: Brand recognition (Coca-Cola), patents (pharmaceutical companies), or regulatory licenses (utilities) that competitors can't easily obtain.

Efficient Scale: When a market is only big enough to support one or two profitable players, new entrants face an uphill battle. Think of cell towers — the capital cost is huge, and there's limited demand for a fifth carrier.

How to evaluate a moat: Look at the company's return on invested capital (ROIC) over 10+ years. Consistently high ROIC (15%+) usually signals a moat. Also ask: "If a well-funded competitor tried to replicate this business from scratch, how hard would it be?"

Moats can erode. Newspapers had moats until the internet destroyed their advertising model. Always consider whether technological or regulatory changes could weaken a moat.`,
  },
  {
    title: "How interest rates affect stock prices",
    dimension: "risks",
    category: "macro",
    content: `Interest rates are like gravity for stock prices — when rates go up, stock valuations tend to come down. Understanding why helps you interpret market movements that might otherwise feel random.

The basic mechanism: When the Federal Reserve raises interest rates, "risk-free" investments like Treasury bonds offer better returns. If a savings account pays 5%, investors demand more from stocks to justify the extra risk. This raises the bar for stocks and tends to push prices down, especially for expensive growth stocks.

Here's a simple way to think about it: Imagine you own a stock that won't pay meaningful profits for 10 years. You bought it for its future potential. If interest rates are near zero, waiting 10 years isn't costly — money in the bank earns nothing anyway. But if rates are 5%, every year you wait has a real opportunity cost. You could be earning 5% risk-free instead. So investors discount those future profits more heavily, and the stock price drops today.

This is why growth stocks (tech, biotech) are more sensitive to rate changes than value stocks (banks, utilities). Growth companies' value is mostly in far-future earnings, which get discounted more when rates rise.

But it's not all negative: Rising rates often signal a strong economy, which helps corporate earnings. Banks actually benefit from higher rates because they earn more on loans. And some companies with pricing power can raise prices alongside inflation.

Key takeaway: When you hear about the Fed raising or cutting rates, think about what kind of companies you own. High-growth, unprofitable companies are most affected by rising rates. Mature, profitable companies with strong current cash flows are more insulated. Rate changes don't mean you should do anything — but they explain why your portfolio might move on Fed announcement days.`,
  },
  {
    title: "What happens during earnings season",
    dimension: "news_catalysts",
    category: "events",
    content: `Four times a year, publicly traded companies report their quarterly financial results. This period — called "earnings season" — is when stock prices can make big moves because investors get fresh data on how a company is actually performing versus expectations.

The timeline: Earnings season typically starts about two weeks after a quarter ends. Q1 results come in April, Q2 in July, Q3 in October, and Q4 in January/February. Big tech companies usually report in the last week or two of the month.

Before the report: Analysts publish estimates for revenue and earnings per share (EPS). These estimates get aggregated into a "consensus." The stock price already reflects these expectations — this is important. The stock doesn't move based on whether earnings were "good" or "bad" in absolute terms, but whether they beat or missed the consensus.

The earnings call: After releasing numbers, the CEO and CFO host a conference call. They discuss results, explain trends, and — most importantly — provide "guidance" (their forecast for next quarter). Guidance often matters more than the actual results because investors are forward-looking.

Common scenarios:
- Beat and raise: Company beats estimates AND raises future guidance. Usually the best outcome for the stock.
- Beat but lower guidance: Stock often drops because investors care more about the future.
- Miss but raise guidance: Stock might still go up if the miss was minor but the future looks brighter.

Why stocks sometimes drop on good earnings: If a stock rallied 20% into earnings, the "beat" might already be priced in. Investors who bought the rumor now "sell the news."

What to do during earnings: As a learner, read the earnings release and listen to the call. It's the best way to understand what management thinks about their own business. Don't panic about single-day price moves — they often reverse as the market digests the information.`,
  },
  {
    title: "Revenue vs profit — what's the difference?",
    dimension: "financials",
    category: "fundamentals",
    content: `Revenue and profit are often confused, but they're fundamentally different — like the difference between how much water flows into a bucket and how much stays after it leaks. Revenue (also called "sales" or "top line") is the total money coming in. Profit (the "bottom line") is what's left after paying all expenses.

A simple example: A coffee shop sells $500,000 of coffee in a year. That's revenue. But after paying for beans ($100K), rent ($80K), staff ($200K), equipment ($30K), and other costs ($50K), the owner keeps $40,000. That's the net profit. Revenue was $500K, but profit was only $40K — an 8% margin.

Why the distinction matters for investors:

Revenue growth shows demand. If revenue is growing 20% per year, customers are buying more. But if the company is spending $1.10 to earn each $1.00 of revenue, growth is actually making things worse. This is the "growing unprofitably" trap that caught many companies in 2021-2022.

Profitability shows sustainability. A company can survive losses temporarily (funded by investors or cash reserves), but eventually, every business needs to earn more than it spends. As an investor, you want to see a clear path from revenue growth to eventual profit.

The income statement tells this story in order: Revenue at the top, then subtract costs layer by layer (cost of goods sold, then operating expenses, then interest and taxes) until you reach net income at the bottom. That's why revenue is called the "top line" and profit is the "bottom line."

Watch out for companies that only highlight revenue in their press releases while burying profit figures — it might mean the bottom line isn't pretty. The healthiest businesses grow both revenue AND profit simultaneously.`,
  },
  {
    title: "What does market cap actually mean?",
    dimension: "valuation_context",
    category: "valuation",
    content: `Market capitalization (market cap) is the total value the stock market places on a company. It's calculated simply: share price multiplied by total number of shares outstanding. If a company has 1 billion shares and each trades at $100, its market cap is $100 billion.

Think of it as the "price tag" if you wanted to buy the entire company at today's stock price. Of course, actually buying a whole company costs a premium above market price, but market cap gives you the baseline.

Why it matters more than stock price: A stock trading at $500/share isn't necessarily more expensive than one at $50. If the $500 stock has 100 million shares (market cap = $50B) and the $50 stock has 10 billion shares (market cap = $500B), the "cheaper" looking stock actually represents the much larger company.

Market cap categories:
- Mega cap: $200B+ (Apple, Microsoft, Amazon)
- Large cap: $10B-$200B (most well-known companies)
- Mid cap: $2B-$10B (growing companies, more volatile)
- Small cap: $300M-$2B (higher risk, higher potential reward)
- Micro cap: Under $300M (very risky, less liquid)

What market cap tells you: It helps you understand the scale of a company and set realistic expectations. A $2 trillion company (Apple) doubling in value means adding another $2 trillion — extremely unlikely in a short period. A $2 billion company doubling is much more feasible.

Market cap also determines which indexes a stock is in (S&P 500 requires large caps), how much analyst coverage it gets, and how easily you can buy/sell shares without moving the price.

Common misconception: Market cap doesn't equal the company's actual "worth" or how much cash it has. It's just the market's current opinion of value, and opinions change daily. The real value of a business depends on its future earnings — which nobody knows for sure.`,
  },
  {
    title: "How to think about company debt",
    dimension: "financials",
    category: "fundamentals",
    content: `Debt isn't inherently bad for a company — it's a tool. Just like a mortgage lets you buy a house you couldn't afford outright, corporate debt lets companies invest in growth, acquisitions, or operations before they generate enough cash on their own. The question isn't "does the company have debt?" but "can it comfortably service that debt?"

Key metrics for evaluating debt:

Debt-to-Equity ratio: Total debt divided by total shareholder equity. Under 1.0 means the company has more equity than debt (generally conservative). Over 2.0 means it's highly leveraged. But context matters — utilities and real estate companies typically carry more debt because their cash flows are predictable.

Interest Coverage ratio: Operating income divided by interest expense. If a company earns $10M in operating income and pays $2M in interest, coverage is 5x. Below 2x is concerning — it means the company is barely earning enough to pay its creditors. Above 5x is comfortable.

Net Debt: Total debt minus cash on hand. Some companies have $50B in debt but also $30B in cash, so net debt is only $20B. Apple carried significant debt for years while sitting on even more cash — the debt was for tax efficiency, not desperation.

When debt is good: Low-interest debt used to invest in projects that earn higher returns creates value. If a company borrows at 4% and invests in a project returning 15%, the debt is working for shareholders.

When debt is dangerous: When revenue drops unexpectedly (recession, competition, disruption), debt payments don't shrink with it. Companies with high fixed debt costs and cyclical revenue can find themselves in trouble fast. This is why airlines and retailers often go bankrupt during downturns — they have high fixed costs and volatile revenue.

The bottom line: Some debt is normal and healthy. What matters is whether the company generates enough steady cash flow to comfortably pay interest and eventually pay back principal. Look at the trend — rising debt with stagnant earnings is a warning sign.`,
  },
  {
    title: "What are stock buybacks?",
    dimension: "business_model",
    category: "capital-allocation",
    content: `A stock buyback (or share repurchase) is when a company uses its own money to buy its shares from the open market. Think of it like a pizza: if you have 8 slices and eliminate 2 of them, the remaining 6 slices each represent a bigger portion of the whole pizza. Similarly, when a company buys back shares, each remaining share represents a larger piece of the company.

Why companies do buybacks:

Returning cash to shareholders: Companies with excess cash have three main options — reinvest in the business, pay dividends, or buy back stock. Buybacks are the most tax-efficient for shareholders because you don't pay tax until you sell your shares, whereas dividends are taxed immediately.

Boosting EPS: If a company earns $10 billion and has 1 billion shares, EPS is $10. If it buys back 100 million shares, EPS becomes $11.11 (same earnings, fewer shares). This makes the stock look "cheaper" on a P/E basis and can push the price up.

Signal confidence: Management buying back stock signals they believe shares are undervalued. It's them putting the company's money where their mouth is.

When buybacks are controversial:

Bad timing: Companies often buy back the most stock when prices are high (they have more cash during good times) and stop when prices are low (preserving cash during tough times). This is literally buying high.

Debt-funded buybacks: Some companies borrow money to buy back stock. This boosts EPS in the short term but adds financial risk. If earnings drop, they still owe the debt.

Instead of investing: If a company buys back stock instead of investing in R&D, new products, or employees, it might be sacrificing long-term growth for short-term stock price performance.

How to evaluate: Look at the total share count over time. If it's consistently declining (like Apple, which has reduced shares by ~35% over a decade), buybacks are providing real value. If share count stays flat despite announced buybacks, the repurchases might just offset employee stock compensation — no real benefit to you.`,
  },
  {
    title: "Understanding dividends and dividend yield",
    dimension: "business_model",
    category: "capital-allocation",
    content: `A dividend is a cash payment a company makes to shareholders, typically quarterly, as a way of sharing profits. If you own 100 shares of a company that pays $1/share per quarter, you receive $400/year just for holding the stock. It's like owning a rental property that sends you a check every few months.

Dividend yield is the annual dividend payment divided by the stock price. If a stock costs $100 and pays $3/year in dividends, the yield is 3%. This lets you compare dividend income across different stocks regardless of share price.

Types of dividend payers:

Dividend aristocrats: Companies that have raised dividends for 25+ consecutive years (Coca-Cola, Johnson & Johnson, Procter & Gamble). These tend to be mature, stable businesses with predictable cash flows.

High yielders: Stocks with yields above 4-5% (REITs, utilities, telecom). Higher yield can mean higher income, but sometimes an unusually high yield is a warning — the stock price may have dropped (pushing yield up) because the company is struggling.

Growth companies: Many tech companies (Amazon, Google, Tesla) pay zero dividends, preferring to reinvest all profits into growth. This isn't bad — it just means your return comes entirely from stock price appreciation rather than income.

Key concepts:

Payout ratio: What percentage of earnings goes to dividends. A 60% payout ratio means the company pays 60% of profits as dividends and keeps 40%. Above 80% is potentially unsustainable — there's little margin for error if earnings dip.

Ex-dividend date: You must own the stock before this date to receive the upcoming dividend. The stock price typically drops by approximately the dividend amount on this date (since new buyers won't get that payment).

Dividend growth: A stock yielding 2% today but growing dividends 10% per year will yield much more on your original investment over time. This is why dividend growth investors focus on the growth rate, not just current yield.

Dividends vs buybacks: Both return cash to shareholders. Dividends provide predictable income; buybacks provide flexible value creation. Many mature companies do both.`,
  },
  {
    title: "What is free cash flow and why investors care",
    dimension: "financials",
    category: "fundamentals",
    content: `Free cash flow (FCF) is the cash a company generates after paying for everything needed to maintain and grow its business. Think of it as the money left in your checking account after paying all bills and making necessary home repairs. It's "free" because the company can do whatever it wants with it — buy back stock, pay dividends, make acquisitions, or save it.

The formula: FCF = Operating Cash Flow - Capital Expenditures (CapEx)

Why FCF matters more than net income: Net income (accounting profit) can be manipulated through accounting decisions — depreciation methods, revenue recognition timing, one-time charges. Cash flow is harder to fake. Either the cash came in or it didn't. As the saying goes, "revenue is vanity, profit is opinion, cash is fact."

A company can report positive net income while burning cash (if it's spending heavily on equipment or inventory that isn't captured in the income statement). Conversely, a company can report losses while generating positive free cash flow (if depreciation expenses exceed actual capital needs).

How to evaluate FCF:

FCF margin: Free cash flow divided by revenue. A 20% FCF margin means the company converts one-fifth of every revenue dollar into free cash. Software companies often have 25-35% FCF margins (minimal physical costs). Hardware manufacturers might have 5-10%.

FCF yield: Free cash flow per share divided by stock price. Like dividend yield, but for all the cash generated (not just what's paid out). A 5% FCF yield means the company generates enough cash to theoretically pay shareholders 5% of the stock price each year.

FCF growth: Consistently growing free cash flow is one of the strongest signals of a healthy business. It means the company is becoming more efficient at converting its operations into actual cash.

Red flags: Negative free cash flow isn't always bad (Amazon spent years investing in warehouses), but persistent negative FCF combined with slowing revenue growth is concerning. The company might be struggling to turn growth into sustainable economics.`,
  },
  {
    title: "How to evaluate a company's competitors",
    dimension: "competitive_position",
    category: "strategy",
    content: `Understanding a company's competitive landscape tells you whether its current success is likely to continue. A company might have great products today, but if competitors can easily replicate them, high profits won't last. Think of it like a race — you need to know who else is running and how fast they're catching up.

Step 1: Identify the real competitors. This isn't always obvious. Netflix's competitors aren't just Disney+ and HBO — they're also TikTok, YouTube, and video games (all competing for your attention and entertainment budget). Think about what problem the company solves and who else solves it.

Step 2: Compare on key metrics:
- Revenue growth rates: Who's growing faster?
- Market share: Who's gaining, who's losing?
- Profit margins: Who runs more efficiently?
- R&D spending: Who's investing in the future?
- Customer satisfaction/retention: Who do customers prefer?

Step 3: Assess competitive dynamics:
- Is the market growing (everyone can win) or mature (zero-sum)?
- Are customers locked in or easily switching?
- Is there a clear #1 pulling away, or is it an even fight?
- Are new entrants emerging that could disrupt everyone?

Frameworks to use:

Market share trajectory matters more than current share. A company with 20% share that's growing 5 points per year is in a better position than the leader with 40% that's losing ground.

Winner-take-most markets: In some industries (social media, marketplace businesses), one player tends to dominate. In others (restaurants, manufacturing), many companies coexist profitably. Know which type of market you're looking at.

Commoditization risk: If a product becomes interchangeable (think USB cables, basic cloud storage), competition becomes purely about price and margins collapse. Companies with differentiated products avoid this fate.

The simplest question: "If this company disappeared tomorrow, would customers struggle to find an alternative?" If yes, competitive position is strong. If they'd barely notice, it's weak.`,
  },
  {
    title: "What is diversification and why it matters",
    dimension: "risks",
    category: "portfolio-concepts",
    content: `Diversification is the investment equivalent of "don't put all your eggs in one basket." By spreading investments across different stocks, sectors, and asset types, you reduce the risk that any single bad event devastates your entire portfolio. It's the only "free lunch" in investing — you can reduce risk without necessarily reducing expected returns.

Why it works: Different investments respond differently to events. When oil prices spike, energy stocks rise but airline stocks fall. When interest rates rise, banks do well but real estate struggles. When the economy slows, consumer staples (toothpaste, groceries) hold up better than luxury goods. By owning a mix, some holdings cushion the blow from others.

Types of diversification:

Across stocks: Owning 15-20 stocks from different companies reduces company-specific risk (a single bad earnings report won't tank your whole portfolio).

Across sectors: If you own 10 stocks but they're all tech companies, you're not truly diversified. One regulation or industry downturn could hit all of them. Spread across technology, healthcare, financials, consumer goods, industrials, etc.

Across geographies: International exposure protects against country-specific risks. The US market can underperform for years while international markets outperform (and vice versa).

Across asset classes: Stocks, bonds, real estate, and commodities often move in different directions. Bonds typically go up when stocks crash (though 2022 was a rare exception).

Common mistakes:

Over-diversification: Owning 100+ stocks means no single position can meaningfully contribute to returns. You're just recreating an index fund with extra complexity.

Illusion of diversification: Owning five tech growth stocks isn't diversified — they'll all react similarly to market events. True diversification means owning things that don't move together.

The key insight: Diversification doesn't mean everything in your portfolio goes up. If everything always moves the same direction, you're not diversified. Seeing some holdings decline while others rise is diversification working correctly — it's a feature, not a bug.`,
  },
  {
    title: "How to read an earnings report",
    dimension: "news_catalysts",
    category: "events",
    content: `An earnings report is a company's quarterly financial scorecard. Learning to read one gives you direct access to how a company is actually performing — no news media filter needed. It looks intimidating at first, but you only need to focus on a few key areas.

What you receive: Companies release a press release (the highlights), followed by the full 10-Q filing (detailed financials), and then host an earnings call (management discussion). Start with the press release — it's designed to be readable.

The numbers that matter most:

Revenue: Did it grow? Did it beat analyst expectations? Look for the year-over-year comparison ("revenue grew 12% vs. the prior year period"). Also check whether growth came from selling more stuff or raising prices — they have different implications.

Earnings Per Share (EPS): Both GAAP (standard accounting rules) and non-GAAP (adjusted for one-time items). The non-GAAP number is what most investors compare against estimates. Did it beat or miss consensus?

Guidance: Management's outlook for next quarter (or full year). This often moves the stock more than actual results because investors are forward-looking. "We expect Q3 revenue of $X" tells you more about the future than Q2 actuals.

What to listen for on the call:

Tone and confidence: Is the CEO excited or making excuses? Are they specific about growth drivers or vague?

Margin trends: Are they expanding (good — becoming more efficient) or contracting (concerning — costs growing faster than revenue)?

Customer metrics: Subscriber growth, retention rates, average revenue per user — whatever metrics matter for that business.

One-time items: Did a big contract, acquisition, or write-off distort the numbers? Separate the recurring business from noise.

How to build the habit: Pick one company you own and read their next earnings release. Don't worry about understanding every line — focus on revenue, EPS vs. estimates, and guidance. Each quarter it gets easier, and you'll start noticing patterns.`,
  },
  {
    title: "What makes a stock expensive vs overvalued",
    dimension: "valuation_context",
    category: "valuation",
    content: `People often say a stock is "expensive" when the price or P/E ratio is high. But expensive and overvalued are different concepts — and confusing them is one of the most common mistakes beginners make.

Expensive means the valuation metrics (P/E, P/S, etc.) are high relative to the market or the stock's own history. Amazon has traded at a P/E of 60-100+ for most of its public life. It's always looked "expensive" by traditional metrics. Yet it returned thousands of percent because earnings grew fast enough to justify (and exceed) those high multiples.

Overvalued means the current price exceeds what the company is likely worth based on realistic future earnings. The stock won't grow into its valuation. This is harder to determine because it requires predicting the future.

The key distinction: A stock trading at 50x earnings that's growing earnings 40% annually might be expensive but fairly valued (or even cheap). A stock trading at 15x earnings but with declining revenue might look cheap but actually be overvalued because earnings are about to fall.

How to think about it:

Compare growth rate to P/E: The PEG ratio (P/E divided by growth rate) helps. A PEG of 1.0 means you're paying proportionally for growth. Under 1.0 is potentially attractive; over 2.0 means you're paying a big premium.

Think in scenarios: If the company executes perfectly, what could earnings be in 3-5 years? If it faces headwinds? What does the current price assume?

Historical context: If a stock typically trades at 20-25x earnings and now trades at 40x with no acceleration in growth, the expansion might not be sustainable.

Quality premium: High-quality businesses (consistent growth, strong moats, excellent management) deserve higher multiples. You'd pay more for a Ferrari than a used sedan, even if both get you to work. The Ferrari (quality company) retains value better.

The bottom line: "It looks expensive" isn't a reason to avoid a stock. "The price assumes growth that's unrealistic given competitive dynamics" is. Always ask what has to go right to justify today's price, and whether that's plausible.`,
  },
  {
    title: "Understanding supply chains and dependency risks",
    dimension: "risks",
    category: "risk-factors",
    content: `Every company depends on a chain of suppliers, manufacturers, logistics partners, and distributors to deliver its products. A supply chain is only as strong as its weakest link — and when that link breaks, even great companies can stumble. The COVID-19 pandemic taught this lesson vividly when chip shortages halted auto production and shipping delays disrupted everything.

Types of supply chain risk:

Single-source dependency: If a company relies on one supplier for a critical component, that supplier's problems become their problems. Apple depends heavily on TSMC for its chips — if TSMC's Taiwan facilities were disrupted, Apple would have no immediate alternative.

Geographic concentration: Many supply chains run through specific regions. A drought in Taiwan (affecting chip fabrication), a port closure in Shanghai, or political instability in a mining region can cascade globally.

Input cost volatility: Companies that depend on commodities (oil, lithium, wheat, copper) face margin pressure when prices spike. Airlines are famously exposed to fuel costs, which they can't fully pass to customers.

Logistics and shipping: Getting products from factory to customer involves ports, trucks, planes, and warehouses. Bottlenecks at any point delay revenue and frustrate customers.

How to evaluate supply chain risk:

Read the 10-K risk factors: Companies are required to disclose material risks, including supply chain dependencies. Look for mentions of key suppliers, geographic concentration, and contingency plans.

Supplier diversification: Does the company have backup suppliers? How quickly could it shift production? Companies that invested in "dual sourcing" before COVID fared better.

Inventory strategy: Some companies keep more inventory as a buffer (costly but protective). Others run "just-in-time" (efficient but fragile). The right approach depends on the industry and risk tolerance.

Vertical integration: Companies that own more of their supply chain (like Tesla building its own batteries) reduce dependency risk but take on more capital expenditure and complexity.

For investors: Supply chain risks are often invisible until they hit. When evaluating a company, ask: "What could disrupt their ability to make and deliver their product?" If the answer is "many things, and they have few alternatives," that's a meaningful risk to understand.`,
  },
  {
    title: "What analysts mean by 'bull case' and 'bear case'",
    dimension: "news_catalysts",
    category: "analysis",
    content: `When analysts present investment ideas, they often frame it as three scenarios: bull case (optimistic), base case (most likely), and bear case (pessimistic). This framework acknowledges that nobody knows the future — instead, you consider the range of possible outcomes.

Bull case: Everything goes right. The company executes its growth plan, the market expands, competition falters, and margins improve. The bull case often represents the top 10-20% of possible outcomes. An analyst's bull case price target reflects what the stock could be worth if optimistic assumptions play out.

Bear case: Things go wrong. Growth slows, a new competitor emerges, the economy weakens, or management makes mistakes. The bear case represents the bottom 10-20% of outcomes. It helps you understand downside risk — "if I'm wrong, how much could I lose?"

Base case: The most probable scenario, somewhere in the middle. This is what the analyst believes will likely happen given current trends continuing with some variation.

Why this framework matters for you:

Risk/reward assessment: If the bull case implies 50% upside but the bear case implies 40% downside, the risk/reward is roughly even. If it's 100% upside vs. 20% downside, the odds are more attractive.

Checking your assumptions: Before buying any stock, force yourself to articulate what could go wrong. If you can't think of a bear case, you haven't researched enough.

Avoiding all-in thinking: New investors tend to either love a stock (seeing only the bull case) or fear it (seeing only the bear case). Reality usually lands somewhere in between.

How to build your own scenarios:

Bull case triggers: What would need to happen? Market expansion, new product success, acquisition synergies, margin improvement.

Bear case triggers: Competition intensifying, regulation, technology disruption, management departures, macro downturn.

Probability weighting: Mentally assign rough probabilities (60% base case, 20% bull, 20% bear). This helps you think about expected value rather than just best-case scenarios.

Remember: Analysts disagree wildly on the same stock. One analyst's bull case might be another's base case. The goal isn't to find the "right" price — it's to think probabilistically about a range of outcomes.`,
  },
  {
    title: "Network effects — why some companies keep winning",
    dimension: "competitive_position",
    category: "strategy",
    content: `Network effects are one of the most powerful forces in business — they create a virtuous cycle where a product becomes more valuable as more people use it, which attracts more people, which makes it even more valuable. It's why WhatsApp beat other messaging apps, why Uber dominates ridesharing, and why it's almost impossible to start a new social network from scratch.

Types of network effects:

Direct network effects: Each new user directly makes the product better for all other users. Telephones are the classic example — the first telephone was useless, the second made both valuable, and now billions make the network indispensable. Modern examples: WhatsApp, iMessage, multiplayer games.

Indirect (two-sided) network effects: More users on one side attract more users on the other side. More Uber riders attract more drivers, which reduces wait times, which attracts more riders. More iPhone users attract more app developers, which creates more apps, which attracts more iPhone users.

Data network effects: More users generate more data, which improves the product through AI/machine learning, which attracts more users. Google Search gets better as more people search (it learns from clicks). Waze traffic data improves with more drivers using it.

Marketplace network effects: More sellers bring more buyers (more selection), and more buyers bring more sellers (more demand). Amazon, Etsy, and Airbnb all benefit from this dynamic.

Why network effects create moats:

Winner-take-most dynamics: In network-effect businesses, being #1 is dramatically better than being #2. The leader's product is inherently better because it has more users. This makes it nearly impossible for smaller competitors to catch up.

High switching costs: Even if a competitor offers a better product, users won't leave if all their friends/connections/content are on the existing platform.

Compounding advantage: Unlike other competitive advantages that can erode, network effects often strengthen over time as the network grows.

Limits and vulnerabilities:

Multi-homing: When users can easily use multiple platforms (posting on both Instagram and TikTok), network effects are weakened.

Niche disruption: New networks often start in a niche the incumbent ignores. Facebook beat MySpace by starting with college students. Discord captured gamers before broadening.

Quality degradation: If growth brings spam, toxicity, or irrelevant content (like Facebook's feed problems), users may leave despite the network.

For evaluation: When you see a company with network effects, ask "how strong is the lock-in?" and "is the network still growing?" A growing network with strong lock-in is one of the most powerful business models in existence.`,
  },
  {
    title: "Price-to-sales ratio — when P/E doesn't work",
    dimension: "valuation_context",
    category: "valuation",
    content: `The Price-to-Sales (P/S) ratio is a valuation metric that compares a company's stock price to its revenue. It's calculated as market cap divided by annual revenue (or share price divided by revenue per share). While P/E is the go-to valuation metric for profitable companies, P/S becomes essential when a company has no earnings — which is common for high-growth companies investing heavily in expansion.

When to use P/S instead of P/E:

Unprofitable growth companies: Companies like Snowflake, CrowdStrike (in their early years), or many SaaS businesses deliberately sacrifice profits to grow faster. They have no earnings, so P/E is undefined. P/S still works because they have revenue.

Companies with temporarily depressed earnings: If a cyclical company's earnings dipped due to a downturn (but revenue stayed relatively stable), P/S gives a cleaner picture than a distorted P/E.

Comparing across different accounting regimes: Revenue is harder to manipulate than earnings. Two companies might have very different profit structures but similar revenue, making P/S a more apples-to-apples comparison.

How to interpret P/S:

Low P/S (under 2): Either a slow-growth company, a company in trouble, or potentially undervalued. Retailers, automakers, and industrials often trade at low P/S because their margins are thin — a lot of revenue but not much profit per dollar.

Moderate P/S (2-8): Typical for healthy growing companies with decent margins. Most established software companies land here.

High P/S (10+): The market expects significant future growth AND high margins. Common for hot SaaS companies growing 30%+ annually. The expectation is that revenue will grow dramatically while margins expand, eventually justifying the premium.

The crucial connection — margins:

P/S only makes sense in context of margins. A company with 80% gross margins trading at 10x sales is very different from one with 20% margins at 10x sales. The high-margin company will convert much more of that revenue into eventual profit.

Rule of thumb: P/S multiplied by gross margin gives you a "margin-adjusted" sense of expensiveness. A 10x P/S with 80% margins is roughly equivalent to a 40x P/S with 20% margins in terms of what you're paying per dollar of gross profit.

Limitations: P/S completely ignores profitability and efficiency. A company could have enormous revenue but terrible economics (think early food delivery companies with massive negative margins). Revenue alone doesn't make a business valuable — the ability to eventually profit from that revenue does.`,
  },
];
