/* Extra question pool for Grown-Up Mode */
(function () {
  if (typeof CATEGORIES === "undefined") return;
  var c = CATEGORIES.find(function (x) { return x.id === "grownup"; });
  if (!c) return;
  var moreExplain = [
    {
      q: "What is a health insurance deductible?",
      answer: "A deductible is the amount you must pay out of pocket for covered health services before your insurance plan starts to pay. After you meet it, the insurer begins sharing costs.",
      accept: ["deductible", "out of pocket", "before insurance pays", "amount you pay first", "annual amount", "you pay before coverage", "before plan pays", "self pay portion"],
      key: ["deductible", "out of pocket", "covered services", "before insurance pays", "annual", "insurer shares costs", "threshold", "you pay first", "plan year", "coverage begins"]
    },
    {
      q: "What is a copay in health insurance?",
      answer: "A copay is a fixed dollar amount you pay for a covered service, like a doctor visit or prescription, usually due at the time of service.",
      accept: ["copay", "fixed amount", "flat fee", "per visit", "doctor visit fee", "prescription fee", "set dollar amount", "time of service"],
      key: ["copay", "fixed amount", "covered service", "doctor visit", "prescription", "at time of service", "flat fee", "set dollar", "per visit", "out of pocket"]
    },
    {
      q: "What is coinsurance?",
      answer: "Coinsurance is the percentage of a covered medical cost you pay after meeting your deductible, with the insurer paying the rest. For example, 20 percent coinsurance means you pay 20 percent.",
      accept: ["coinsurance", "percentage", "after deductible", "share of cost", "you pay a percent", "split with insurer", "percent of bill", "cost sharing"],
      key: ["coinsurance", "percentage", "after deductible", "cost sharing", "insurer pays rest", "you pay percent", "covered cost", "split", "twenty percent", "medical bill"]
    },
    {
      q: "What is an out-of-pocket maximum?",
      answer: "The out-of-pocket maximum is the most you have to pay for covered services in a plan year. After you reach it, the insurer pays 100 percent of covered costs.",
      accept: ["out of pocket maximum", "most you pay", "cap on costs", "annual limit", "spending cap", "then insurer pays all", "max you pay", "yearly limit"],
      key: ["out of pocket maximum", "most you pay", "plan year", "insurer pays 100 percent", "cap", "covered services", "spending limit", "annual", "ceiling", "protection"]
    },
    {
      q: "What is the difference between an HMO and a PPO?",
      answer: "An HMO requires you to use in-network providers and get referrals to see specialists, while a PPO offers more flexibility to see out-of-network providers without referrals, usually at higher cost.",
      accept: ["hmo", "ppo", "network", "referrals", "specialists", "flexibility", "in network", "out of network", "primary care doctor"],
      key: ["hmo", "ppo", "in network", "referrals", "specialists", "primary care doctor", "flexibility", "out of network", "higher cost", "provider choice"]
    },
    {
      q: "What is a premium in insurance?",
      answer: "A premium is the amount you pay, usually monthly, to keep an insurance policy active, regardless of whether you use any services.",
      accept: ["premium", "monthly payment", "to keep policy active", "regular payment", "what you pay for coverage", "subscription cost", "ongoing cost"],
      key: ["premium", "monthly", "policy active", "regular payment", "coverage cost", "regardless of use", "recurring", "insurance", "keep coverage", "payment"]
    },
    {
      q: "What is an HSA (Health Savings Account)?",
      answer: "An HSA is a tax-advantaged account paired with a high-deductible health plan that lets you save pre-tax money for qualified medical expenses. The funds roll over year to year and are yours to keep.",
      accept: ["hsa", "health savings account", "tax advantaged", "high deductible plan", "pre tax", "medical expenses", "rolls over", "tax free"],
      key: ["hsa", "health savings account", "tax advantaged", "high deductible plan", "pre tax", "qualified medical expenses", "rolls over", "yours to keep", "triple tax", "savings"]
    },
    {
      q: "What is an FSA (Flexible Spending Account)?",
      answer: "An FSA is an employer-sponsored account that lets you set aside pre-tax money for medical or dependent care expenses. Funds generally must be used within the plan year or you lose them.",
      accept: ["fsa", "flexible spending account", "pre tax", "use it or lose it", "employer account", "medical expenses", "dependent care", "plan year"],
      key: ["fsa", "flexible spending account", "pre tax", "employer sponsored", "use it or lose it", "medical expenses", "dependent care", "plan year", "set aside", "forfeit"]
    },
    {
      q: "What does APR mean on a loan or credit card?",
      answer: "APR stands for Annual Percentage Rate, the yearly cost of borrowing including interest and certain fees, expressed as a percentage. It lets you compare loan costs.",
      accept: ["apr", "annual percentage rate", "yearly cost of borrowing", "interest plus fees", "cost of credit", "yearly rate", "borrowing cost"],
      key: ["apr", "annual percentage rate", "yearly cost", "borrowing", "interest", "fees", "percentage", "compare loans", "cost of credit", "rate"]
    },
    {
      q: "What is the difference between APR and APY?",
      answer: "APR is the simple yearly interest rate without compounding, often used for loans, while APY (Annual Percentage Yield) includes the effect of compounding and is used for savings, making it the truer return.",
      accept: ["apr", "apy", "compounding", "loans", "savings", "annual percentage yield", "yearly return", "with compounding", "without compounding"],
      key: ["apr", "apy", "compounding", "annual percentage yield", "loans", "savings", "true return", "interest", "yearly rate", "compound effect"]
    },
    {
      q: "What is a credit score?",
      answer: "A credit score is a three-digit number, typically from 300 to 850, that summarizes your creditworthiness based on your borrowing and repayment history. Lenders use it to decide loan approval and rates.",
      accept: ["credit score", "three digit number", "300 to 850", "creditworthiness", "fico", "borrowing history", "repayment history", "lenders use it"],
      key: ["credit score", "three digit", "300 to 850", "creditworthiness", "repayment history", "lenders", "loan approval", "interest rates", "fico", "borrowing"]
    },
    {
      q: "What factors most affect your credit score?",
      answer: "Payment history and amounts owed (credit utilization) are the biggest factors, followed by length of credit history, new credit, and credit mix.",
      accept: ["payment history", "credit utilization", "amounts owed", "length of history", "new credit", "credit mix", "on time payments", "balances"],
      key: ["payment history", "credit utilization", "amounts owed", "length of history", "new credit", "credit mix", "on time payments", "balances", "biggest factor", "score"]
    },
    {
      q: "What is credit utilization?",
      answer: "Credit utilization is the percentage of your available revolving credit that you are using. Keeping it below about 30 percent generally helps your credit score.",
      accept: ["credit utilization", "percentage of credit used", "balance to limit", "below 30 percent", "revolving credit", "how much you use", "ratio"],
      key: ["credit utilization", "percentage used", "available credit", "below 30 percent", "revolving", "balance to limit", "ratio", "credit score", "lower is better", "balances"]
    },
    {
      q: "What is a FICO score?",
      answer: "A FICO score is the most widely used type of credit score, created by the Fair Isaac Corporation, ranging from 300 to 850 and used by most lenders.",
      accept: ["fico", "fair isaac", "credit score", "300 to 850", "most widely used", "lenders use it", "scoring model"],
      key: ["fico", "fair isaac", "credit score", "300 to 850", "most widely used", "lenders", "scoring model", "creditworthiness", "common", "number"]
    },
    {
      q: "How often can you get a free credit report?",
      answer: "Under federal law you are entitled to a free credit report from each of the three major bureaus, and these reports can be obtained through AnnualCreditReport.com.",
      accept: ["free", "annualcreditreport", "three bureaus", "equifax", "experian", "transunion", "federal law", "once a year"],
      key: ["free credit report", "annualcreditreport.com", "three bureaus", "equifax", "experian", "transunion", "federal law", "entitled", "yearly", "request"]
    },
    {
      q: "What is the difference between a debit card and a credit card?",
      answer: "A debit card draws money directly from your bank account, while a credit card borrows from the lender up to a limit, which you repay later, often with interest if not paid in full.",
      accept: ["debit", "credit", "your own money", "borrowed money", "bank account", "credit limit", "repay later", "interest", "loan"],
      key: ["debit card", "credit card", "bank account", "borrowed", "credit limit", "repay later", "interest", "your money", "lender", "balance"]
    },
    {
      q: "What is a down payment on a home?",
      answer: "A down payment is the portion of a home's purchase price you pay upfront in cash, with the rest financed by a mortgage. A larger down payment lowers your loan and monthly costs.",
      accept: ["down payment", "upfront cash", "portion of price", "rest is mortgage", "20 percent", "paid upfront", "initial payment"],
      key: ["down payment", "upfront", "purchase price", "cash", "mortgage finances rest", "20 percent", "lowers loan", "monthly cost", "initial", "home"]
    },
    {
      q: "What is PMI (Private Mortgage Insurance)?",
      answer: "PMI is insurance that lenders require when your down payment is less than 20 percent of a home's value. It protects the lender, not you, and adds to your monthly payment until you reach enough equity.",
      accept: ["pmi", "private mortgage insurance", "less than 20 percent", "protects lender", "extra monthly cost", "down payment too small", "until 20 percent equity"],
      key: ["pmi", "private mortgage insurance", "down payment under 20 percent", "protects lender", "monthly cost", "equity", "required", "not for you", "removed later", "mortgage"]
    },
    {
      q: "What is the difference between a fixed-rate and adjustable-rate mortgage?",
      answer: "A fixed-rate mortgage keeps the same interest rate for the life of the loan, while an adjustable-rate mortgage (ARM) starts lower but can change periodically based on market rates.",
      accept: ["fixed rate", "adjustable rate", "arm", "stays the same", "can change", "same interest", "varies", "market rates", "rate adjusts"],
      key: ["fixed rate", "adjustable rate", "arm", "same interest", "life of loan", "rate changes", "market rates", "starts lower", "periodically", "mortgage"]
    },
    {
      q: "What is home equity?",
      answer: "Home equity is the portion of your home's value that you actually own, calculated as the market value minus the remaining mortgage balance. It grows as you pay down the loan or the value rises.",
      accept: ["home equity", "value minus mortgage", "portion you own", "market value minus loan", "ownership stake", "what you own", "builds over time"],
      key: ["home equity", "market value", "mortgage balance", "portion you own", "value minus debt", "grows", "ownership", "pay down loan", "stake", "net value"]
    },
    {
      q: "What is escrow in a mortgage?",
      answer: "An escrow account is held by your mortgage servicer to collect and pay your property taxes and homeowners insurance on your behalf, usually bundled into your monthly payment.",
      accept: ["escrow", "property taxes", "homeowners insurance", "held by servicer", "part of monthly payment", "account for taxes", "lender collects"],
      key: ["escrow", "property taxes", "homeowners insurance", "mortgage servicer", "monthly payment", "collected", "paid on your behalf", "account", "bundled", "held"]
    },
    {
      q: "What is amortization on a loan?",
      answer: "Amortization is the process of paying off a loan with regular payments over time, where early payments go mostly toward interest and later payments go mostly toward principal.",
      accept: ["amortization", "paying off over time", "interest then principal", "regular payments", "schedule", "principal and interest", "spread out"],
      key: ["amortization", "regular payments", "over time", "early payments interest", "later payments principal", "schedule", "loan payoff", "principal", "interest", "gradual"]
    },
    {
      q: "What is the principal of a loan?",
      answer: "The principal is the original amount of money borrowed, separate from the interest charged. Payments reduce the principal balance over time.",
      accept: ["principal", "amount borrowed", "original loan", "not interest", "the balance", "money borrowed", "loan amount"],
      key: ["principal", "amount borrowed", "original loan", "separate from interest", "balance", "reduced by payments", "loan amount", "core debt", "borrowed", "owed"]
    },
    {
      q: "What is a security deposit on a rental?",
      answer: "A security deposit is money paid to a landlord at the start of a lease to cover potential damages or unpaid rent. It is usually refundable when you move out if the unit is in good condition.",
      accept: ["security deposit", "landlord", "covers damages", "refundable", "start of lease", "unpaid rent", "returned when you move out", "deposit"],
      key: ["security deposit", "landlord", "covers damages", "unpaid rent", "refundable", "start of lease", "returned", "move out", "good condition", "rental"]
    },
    {
      q: "What is a lease agreement?",
      answer: "A lease is a legally binding contract between a landlord and tenant that sets the rent, length of stay, and rules for occupying a property. Breaking it early can carry penalties.",
      accept: ["lease", "contract", "landlord and tenant", "binding", "rent and terms", "rental agreement", "length of stay", "rules"],
      key: ["lease", "contract", "landlord", "tenant", "binding", "rent", "term length", "rules", "penalties", "occupancy"]
    },
    {
      q: "What is renters insurance?",
      answer: "Renters insurance is a policy that covers a tenant's personal belongings against theft or damage and provides liability protection. It does not cover the building itself, which is the landlord's responsibility.",
      accept: ["renters insurance", "personal belongings", "liability", "theft", "damage", "tenant policy", "not the building", "covers your stuff"],
      key: ["renters insurance", "personal belongings", "liability", "theft", "damage", "tenant", "not the building", "policy", "protection", "affordable"]
    },
    {
      q: "What is a W-2 form?",
      answer: "A W-2 is a tax form your employer sends each year reporting your annual wages and the taxes withheld from your paycheck. You use it to file your income tax return.",
      accept: ["w2", "w-2", "employer form", "wages", "taxes withheld", "annual", "file taxes", "income statement"],
      key: ["w2", "employer", "wages", "taxes withheld", "annual", "file tax return", "income", "withholding", "paycheck", "report"]
    },
    {
      q: "What is a W-4 form?",
      answer: "A W-4 is a form you give your employer to tell them how much federal income tax to withhold from your paycheck, based on your filing status and allowances.",
      accept: ["w4", "w-4", "withholding form", "tells employer", "how much to withhold", "filing status", "paycheck withholding", "you fill out"],
      key: ["w4", "employer", "withholding", "federal income tax", "paycheck", "filing status", "allowances", "you complete", "controls withholding", "form"]
    },
    {
      q: "What is a 1099 form?",
      answer: "A 1099 is a tax form used to report income that is not from an employer, such as freelance, contractor, or investment income. The payer sends it and no taxes are withheld.",
      accept: ["1099", "non employee income", "freelance", "contractor", "no withholding", "self employed", "investment income", "reports income"],
      key: ["1099", "freelance", "contractor", "non employee", "no taxes withheld", "self employed", "investment income", "payer", "report income", "form"]
    },
    {
      q: "What is the difference between a tax deduction and a tax credit?",
      answer: "A tax deduction lowers your taxable income, while a tax credit reduces your tax bill dollar for dollar. Credits are generally more valuable than deductions of the same amount.",
      accept: ["deduction", "credit", "taxable income", "dollar for dollar", "reduces tax bill", "lowers income", "credit more valuable"],
      key: ["tax deduction", "tax credit", "taxable income", "dollar for dollar", "reduces tax", "lowers income", "more valuable", "subtract", "bill", "savings"]
    },
    {
      q: "What is a tax bracket?",
      answer: "A tax bracket is a range of income taxed at a particular rate in a progressive system. Only the income within each bracket is taxed at that bracket's rate, not all your income.",
      accept: ["tax bracket", "income range", "marginal rate", "progressive", "rate per range", "only income in bracket", "tiers"],
      key: ["tax bracket", "income range", "rate", "progressive", "marginal", "only income within", "tiers", "not all income", "taxed", "graduated"]
    },
    {
      q: "What is the standard deduction?",
      answer: "The standard deduction is a fixed dollar amount that reduces your taxable income, which most taxpayers take instead of itemizing individual deductions.",
      accept: ["standard deduction", "fixed amount", "reduces taxable income", "instead of itemizing", "default deduction", "flat reduction"],
      key: ["standard deduction", "fixed amount", "taxable income", "instead of itemizing", "default", "reduces tax", "most taxpayers", "flat", "subtract", "simple"]
    },
    {
      q: "What does it mean to itemize deductions?",
      answer: "Itemizing means listing individual deductible expenses like mortgage interest, state taxes, and charitable gifts instead of taking the standard deduction. You do it when your itemized total exceeds the standard deduction.",
      accept: ["itemize", "list expenses", "mortgage interest", "charitable gifts", "state taxes", "instead of standard", "individual deductions"],
      key: ["itemize", "individual deductions", "mortgage interest", "charitable gifts", "state taxes", "instead of standard", "list expenses", "exceeds standard", "schedule a", "taxable income"]
    },
    {
      q: "What is a 401(k)?",
      answer: "A 401(k) is an employer-sponsored retirement account that lets you contribute pre-tax money from your paycheck, often with an employer match, growing tax-deferred until withdrawal.",
      accept: ["401k", "401 k", "employer retirement", "pre tax", "employer match", "tax deferred", "retirement account", "paycheck contribution"],
      key: ["401k", "employer sponsored", "retirement", "pre tax", "employer match", "tax deferred", "paycheck", "grows", "withdrawal", "contribution"]
    },
    {
      q: "What is an employer 401(k) match?",
      answer: "An employer match is money your employer adds to your 401(k) based on what you contribute, up to a limit. It is essentially free money and a key reason to contribute enough to capture it.",
      accept: ["employer match", "free money", "matches contribution", "up to a limit", "adds to 401k", "matching funds", "company contributes"],
      key: ["employer match", "free money", "matches your contribution", "401k", "up to a limit", "company adds", "incentive", "retirement", "capture", "boost"]
    },
    {
      q: "What is the difference between a traditional and Roth IRA?",
      answer: "A traditional IRA uses pre-tax contributions that are taxed when withdrawn, while a Roth IRA uses after-tax contributions that grow and are withdrawn tax-free in retirement.",
      accept: ["traditional ira", "roth ira", "pre tax", "after tax", "taxed later", "tax free withdrawal", "retirement account", "when taxed"],
      key: ["traditional ira", "roth ira", "pre tax", "after tax", "taxed on withdrawal", "tax free in retirement", "contributions", "grows", "retirement", "timing of tax"]
    },
    {
      q: "What is compound interest?",
      answer: "Compound interest is interest earned on both your original principal and the accumulated interest, so your money grows faster over time. It is the basis of long-term investing growth.",
      accept: ["compound interest", "interest on interest", "principal plus interest", "grows faster", "snowball", "earns on earnings", "accumulates"],
      key: ["compound interest", "interest on interest", "principal", "accumulated interest", "grows faster", "over time", "snowball", "investing", "exponential", "earnings"]
    },
    {
      q: "What is an emergency fund?",
      answer: "An emergency fund is money set aside in an accessible account to cover unexpected expenses like job loss or medical bills, commonly recommended to hold three to six months of living expenses.",
      accept: ["emergency fund", "savings", "unexpected expenses", "three to six months", "job loss", "accessible", "rainy day", "safety net"],
      key: ["emergency fund", "savings", "unexpected expenses", "three to six months", "job loss", "accessible account", "safety net", "living expenses", "cushion", "rainy day"]
    },
    {
      q: "What is a deductible in auto insurance?",
      answer: "An auto insurance deductible is the amount you pay out of pocket toward a claim before your insurer covers the rest. Choosing a higher deductible usually lowers your premium.",
      accept: ["deductible", "out of pocket", "before insurer pays", "per claim", "higher lowers premium", "you pay first", "claim amount"],
      key: ["deductible", "out of pocket", "claim", "before insurer pays", "higher lowers premium", "you pay first", "auto insurance", "amount", "trade off", "cost"]
    },
    {
      q: "What is liability coverage in car insurance?",
      answer: "Liability coverage pays for injuries and property damage you cause to others in an accident. It is legally required in most states and does not cover your own vehicle.",
      accept: ["liability", "damage to others", "injuries you cause", "required by law", "not your car", "covers others", "mandatory"],
      key: ["liability", "damage to others", "injuries you cause", "legally required", "not your vehicle", "property damage", "mandatory", "accident", "covers others", "minimum"]
    },
    {
      q: "What is term life insurance?",
      answer: "Term life insurance provides a death benefit for a set period, such as 20 or 30 years, with no cash value. It is usually cheaper than permanent life insurance.",
      accept: ["term life", "set period", "death benefit", "no cash value", "cheaper", "expires", "temporary coverage", "20 or 30 years"],
      key: ["term life", "set period", "death benefit", "no cash value", "cheaper", "expires", "temporary", "fixed term", "premium", "coverage"]
    },
    {
      q: "What is the difference between gross and net pay?",
      answer: "Gross pay is your total earnings before any deductions, while net pay is what you actually take home after taxes, insurance, and other withholdings are subtracted.",
      accept: ["gross pay", "net pay", "before deductions", "after deductions", "take home", "total earnings", "what you keep"],
      key: ["gross pay", "net pay", "before deductions", "after deductions", "take home", "total earnings", "taxes", "withholdings", "paycheck", "subtracted"]
    },
    {
      q: "What is a warranty?",
      answer: "A warranty is a manufacturer's or seller's promise to repair or replace a product within a certain period if it fails under normal use. It defines what is covered and for how long.",
      accept: ["warranty", "promise to repair", "manufacturer guarantee", "repair or replace", "set period", "covers defects", "guarantee"],
      key: ["warranty", "repair or replace", "manufacturer", "set period", "normal use", "covers defects", "guarantee", "product fails", "terms", "coverage"]
    },
    {
      q: "What is an estate will?",
      answer: "A will is a legal document that states how you want your assets distributed and who cares for any dependents after you die. Without one, state law decides through probate.",
      accept: ["will", "legal document", "distribute assets", "after death", "names guardians", "estate", "probate if none", "wishes"],
      key: ["will", "legal document", "distribute assets", "after death", "dependents", "guardians", "probate", "estate", "wishes", "state law"]
    },
    {
      q: "What is a beneficiary?",
      answer: "A beneficiary is the person or entity you name to receive the proceeds of an account, insurance policy, or estate after your death. Naming one usually lets the asset bypass probate.",
      accept: ["beneficiary", "person named", "receives proceeds", "after death", "insurance payout", "inherits", "bypasses probate", "designated"],
      key: ["beneficiary", "named person", "receives proceeds", "after death", "insurance policy", "account", "inherits", "bypasses probate", "designated", "estate"]
    }
  ];
  var moreShout = [
    { q: "What three-letter term is the yearly cost of borrowing including interest and fees?", answer: "APR", accept: ["apr", "annual percentage rate"] },
    { q: "What four-character term describes interest earned with compounding on savings?", answer: "APY", accept: ["apy", "annual percentage yield"] },
    { q: "What type of health plan requires referrals and in-network providers (abbreviation)?", answer: "HMO", accept: ["hmo", "health maintenance organization"] },
    { q: "What flexible health plan lets you see out-of-network doctors without referrals (abbreviation)?", answer: "PPO", accept: ["ppo", "preferred provider organization"] },
    { q: "What insurance is required when your down payment is under 20 percent (abbreviation)?", answer: "PMI", accept: ["pmi", "private mortgage insurance"] },
    { q: "What employer-sponsored retirement account lets you contribute pre-tax from your paycheck?", answer: "401(k)", accept: ["401k", "401 k", "four oh one k", "four o one k"] },
    { q: "What tax form does an employer send reporting your annual wages?", answer: "W-2", accept: ["w2", "w-2", "w two", "form w2"] },
    { q: "What tax form tells your employer how much to withhold from your pay?", answer: "W-4", accept: ["w4", "w-4", "w four", "form w4"] },
    { q: "What form reports freelance or contractor income with no taxes withheld?", answer: "1099", accept: ["1099", "ten ninety nine", "form 1099", "one thousand ninety nine"] },
    { q: "What tax-advantaged account pairs with a high-deductible health plan and rolls over yearly?", answer: "HSA", accept: ["hsa", "health savings account"] },
    { q: "What use-it-or-lose-it employer health account is funded with pre-tax money?", answer: "FSA", accept: ["fsa", "flexible spending account"] },
    { q: "What is the maximum value on the most common FICO credit score scale?", answer: "850", accept: ["850", "eight hundred fifty", "eight fifty"] },
    { q: "What is the minimum value on the standard FICO credit score scale?", answer: "300", accept: ["300", "three hundred"] },
    { q: "Keeping credit utilization below what percentage is generally recommended?", answer: "30 percent", accept: ["30", "thirty", "30 percent", "thirty percent"] },
    { q: "What down payment percentage typically lets you avoid PMI on a home?", answer: "20 percent", accept: ["20", "twenty", "20 percent", "twenty percent"] },
    { q: "How many credit bureaus are there in the United States?", answer: "Three", accept: ["3", "three"] },
    { q: "How many months of expenses is a common target for an emergency fund (lower end)?", answer: "Three", accept: ["3", "three", "three months", "3 months"] },
    { q: "What kind of life insurance covers a set period and has no cash value?", answer: "Term", accept: ["term", "term life", "term insurance"] },
    { q: "What is the fixed dollar amount you pay at a doctor visit called?", answer: "Copay", accept: ["copay", "co-pay", "copayment"] },
    { q: "What is the amount you pay before insurance starts covering costs called?", answer: "Deductible", accept: ["deductible", "the deductible"] },
    { q: "What percentage-based cost share do you pay after meeting your deductible?", answer: "Coinsurance", accept: ["coinsurance", "co-insurance"] },
    { q: "What recurring payment keeps an insurance policy active?", answer: "Premium", accept: ["premium", "the premium", "premiums"] },
    { q: "What mortgage-held account pays your property taxes and home insurance?", answer: "Escrow", accept: ["escrow", "escrow account"] },
    { q: "What is the original amount of money borrowed on a loan called?", answer: "Principal", accept: ["principal", "the principal"] },
    { q: "What is the process of paying off a loan over time with scheduled payments?", answer: "Amortization", accept: ["amortization", "amortize", "amortisation"] },
    { q: "What is the portion of a home's value you actually own called?", answer: "Equity", accept: ["equity", "home equity"] },
    { q: "What upfront cash payment do you make when buying a home?", answer: "Down payment", accept: ["down payment", "downpayment", "deposit"] },
    { q: "What refundable money do you pay a landlord at the start of a lease?", answer: "Security deposit", accept: ["security deposit", "deposit", "damage deposit"] },
    { q: "What legally binding contract governs a rental between landlord and tenant?", answer: "Lease", accept: ["lease", "lease agreement", "rental agreement"] },
    { q: "What insurance covers a tenant's belongings but not the building?", answer: "Renters insurance", accept: ["renters insurance", "renter's insurance", "renters"] },
    { q: "What is the most you can owe for covered care in a plan year called (three words)?", answer: "Out-of-pocket maximum", accept: ["out of pocket maximum", "oop max", "out-of-pocket maximum", "out of pocket max"] },
    { q: "What fixed deduction do most taxpayers take instead of itemizing?", answer: "Standard deduction", accept: ["standard deduction", "the standard deduction"] },
    { q: "What reduces your tax bill dollar for dollar, more than a deduction?", answer: "Tax credit", accept: ["tax credit", "credit", "a credit"] },
    { q: "What lowers your taxable income rather than your tax directly?", answer: "Deduction", accept: ["deduction", "tax deduction", "a deduction"] },
    { q: "What income range taxed at a single rate is called a tax what?", answer: "Bracket", accept: ["bracket", "tax bracket"] },
    { q: "What is your total pay before deductions called?", answer: "Gross", accept: ["gross", "gross pay", "gross income"] },
    { q: "What is your take-home pay after deductions called?", answer: "Net", accept: ["net", "net pay", "take home"] },
    { q: "What three-digit number summarizes your creditworthiness?", answer: "Credit score", accept: ["credit score", "score", "fico score"] },
    { q: "What is the most widely used type of credit score, by Fair Isaac?", answer: "FICO", accept: ["fico", "fico score"] },
    { q: "What interest earns on both principal and prior interest?", answer: "Compound", accept: ["compound", "compound interest", "compounding"] },
    { q: "What savings buffer covers unexpected expenses like job loss?", answer: "Emergency fund", accept: ["emergency fund", "rainy day fund", "savings"] },
    { q: "What promise from a maker repairs or replaces a faulty product?", answer: "Warranty", accept: ["warranty", "the warranty"] },
    { q: "What legal document directs how your assets are distributed after death?", answer: "Will", accept: ["will", "a will", "last will"] },
    { q: "What person is named to receive an account or policy after your death?", answer: "Beneficiary", accept: ["beneficiary", "the beneficiary"] },
    { q: "What court process handles an estate when there is no will?", answer: "Probate", accept: ["probate", "the probate process"] }
  ];
  c.questions = c.questions.concat(moreExplain);
  c.shout = c.shout.concat(moreShout);
})();
