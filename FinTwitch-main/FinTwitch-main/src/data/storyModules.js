export const STORY_MODULES = {
    1: {
        id: 1,
        title: "The Paycheck Paradox",
        stages: [
            {
                type: "story",
                content: `
# Welcome to the Real World!
You just landed your first job as a Graphic Designer. Congratulations! 
The offer letter says **₹40,000/month**. You feel rich! 
            
But then... *ding* 📱. Your first salary credit SMS arrives.
It's **₹36,500**. (Taxes and PF, remember?)
            
Your friends are calling to celebrate tonight at a fancy club. Your landlord just texted about rent. 
And that generic phone you have? It's looking really old compared to your colleague's Pro Max.
            
**Meaning:** Money flows out faster than it flows in. 
This level is about mastering the *Flow*.
`
            },
            {
                type: "quiz",
                question: "What is the '50-30-20' rule basically saying?",
                options: [
                    "50% Savings, 30% Needs, 20% Wants",
                    "50% Needs, 30% Wants, 20% Savings",
                    "50% Rent, 30% Food, 20% Party"
                ],
                answer: 1,
                feedback: "Correct! Needs comes first (50%), then enjoy your Wants (30%), but NEVER forget to Pay Yourself (20% Savings)."
            },
            {
                type: "activity",
                activityType: "budget_balancer",
                title: "Balance Your Budget",
                description: "Allocate your ₹36,500 salary to fit the 50/30/20 rule."
            },
            {
                type: "decision",
                scenario: "Your friends are planning a trip to Goa next month. It will cost ₹15,000 (almost 40% of your take-home). You have ₹5,000 in your bank account right now.",
                options: [
                    {
                        text: "YOLO! Book it on Credit Card",
                        consequence: "bad",
                        feedback: "You enjoyed the trip, but now you have high-interest debt dragging you down for months. Not a smart start."
                    },
                    {
                        text: "Say 'No' for now, save for the next one",
                        consequence: "good",
                        feedback: "Hard choice, but smart. You kept your financial peace and can plan a better, debt-free trip later."
                    }
                ]
            }
        ]
    },
    2: {
        id: 2,
        title: "The Rainy Day",
        stages: [
            {
                type: "story",
                content: `
# Life Happens...
You are cruising along. Budget is okay. Life is good.
            
Suddenly, **CRASH!** 🚗
Your bike skids on a wet road. You are fine, but the bike... not so much.
The mechanic quotes **₹12,000** for repairs.
            
At the same time, your laptop charger dies (₹2,500).
            
Total unexpected expense: **₹14,500**.
Do you have a cushion? Or will you fall flat on the concrete?
`
            },
            {
                type: "quiz",
                question: "What is an 'Emergency Fund'?",
                options: [
                    "Money kept hidden under the mattress",
                    "3-6 months of expenses kept safe for crisis",
                    "A fund to buy latest gadgets quickly"
                ],
                answer: 1,
                feedback: "Exactly. It's not for investing, it's for insurance against life's surprises."
            },
            {
                type: "activity",
                activityType: "emergency_builder",
                title: "Fill the Emergency Pot",
                description: "Tap to fill your emergency fund while avoiding 'Lifestyle Creep' obstacles."
            },
            {
                type: "decision",
                scenario: "You don't have enough saved for the bike repair yet. What do you do?",
                options: [
                    {
                        text: "Take a Personal Loan @ 18%",
                        consequence: "bad",
                        feedback: "Ouch. Personal loans are expensive. You'll be paying for that skid for a long time."
                    },
                    {
                        text: "Use bus/metro for a month & fix basics first",
                        consequence: "good",
                        feedback: "Resilient! You adapted your lifestyle to handle the crisis without debt."
                    }
                ]
            }
        ]
    },
    3: {
        id: 3,
        title: "The Debt Trap",
        stages: [
            {
                type: "story",
                content: `
# Minimum Due, Maximum Pain
You got a Credit Card! Limit: ₹1,00,000.
It feels like free money. You bought a new console, some clothes, and treated your family.
            
Bill arrives: **₹40,000**.
"Minimum Due": **₹2,000**.
            
You think: *'Wow, I only have to pay ₹2k? Sweet!'*
            
STOP. 🛑
That is the trap. The 40% interest trap.
`
            },
            {
                type: "quiz",
                question: "If you only pay the 'Minimum Due' on credit cards...",
                options: [
                    "The bank thanks you",
                    "You pay huge interest on the balance",
                    "Your credit score increases fast"
                ],
                answer: 1,
                feedback: "Correct. Revolving credit debt is one of the worst financial products. Always pay in full."
            },
            {
                type: "activity",
                activityType: "debt_destroyer",
                title: "Snowball vs Avalanche",
                description: "Choose the best order to pay off these 3 debts to save maximum money."
            },
            {
                type: "decision",
                scenario: "A bank calls: 'Sir/Ma'am, you are eligible for a Pre-Approved Jumbo Loan of ₹5 Lakhs! No paperwork!'",
                options: [
                    {
                        text: "Take it! I can invest it in stocks.",
                        consequence: "bad",
                        feedback: "Terrible idea. Loan interest (15%) > Guaranteed stock returns (0%). You are taking huge risk."
                    },
                    {
                        text: "Block the number.",
                        consequence: "good",
                        feedback: "Peace of mind preserved. Unless you have a specific need, debt is not a casual accessory."
                    }
                ]
            }
        ]
    },
    4: {
        id: 4,
        title: "The Silent Killer",
        stages: [
            {
                type: "story",
                content: `
# The Invisible Thief
You have learnt to save. You have ₹2 Lakhs sitting in your Savings Account.
You feel safe.
            
But wait.
A Burger cost ₹50 five years ago. Now it's ₹100.
Your ₹2 Lakhs staying in the bank (earning 3%) is actually **SHRINKING** because inflation is 6%.
            
This is the silent killer: **Inflation**.
To beat it, you cannot just Save. You must **Invest**.
`
            },
            {
                type: "quiz",
                question: "To beat 6% inflation, your investment must return:",
                options: [
                    "Exactly 6%",
                    "Less than 6% is fine (safety first)",
                    "More than 6% (post-tax)"
                ],
                answer: 2,
                feedback: "Spot on. Real Return = Return - Inflation. If it's negative, you are losing purchasing power."
            },
            {
                type: "activity",
                activityType: "inflation_visualizer",
                title: "Time Travel Shopper",
                description: "Drag the year slider to see how much a basket of goods costs over time."
            },
            {
                type: "decision",
                scenario: "Your uncle suggests: 'Put all money in Fixed Deposits (FDs). It's safe.' FDs are giving 6% returns. Inflation is 6%.",
                options: [
                    {
                        text: "Listen to Uncle (100% FD)",
                        consequence: "bad",
                        feedback: "You preserved capital but lost value. In 10 years, that money buys less than today."
                    },
                    {
                        text: "Diversify (FD + Equity/Gold)",
                        consequence: "good",
                        feedback: "Smart. Equity gives growth to beat inflation; FDs give stability."
                    }
                ]
            }
        ]
    },
    5: {
        id: 5,
        title: "The Magic of Compounding",
        stages: [
            {
                type: "story",
                content: `
# The Eighth Wonder
You start a SIP (Systematic Investment Plan) of ₹5,000/month.
After 1 year, you have ~₹63,000.
After 5 years, ~₹4 Lakhs.
            
Boring right?
            
But wait... do nothing different. Just keep going.
After 20 years? **~₹50 Lakhs**.
After 30 years? **~₹1.7 Crores**.
            
Your money starts making money for you. That is **Compounding**.
But it needs one ingredient: **TIME**.
`
            },
            {
                type: "quiz",
                question: "When is the best time to start investing?",
                options: [
                    "When I earn more money",
                    "Yesterday (or Today!)",
                    "When the market crashes"
                ],
                answer: 1,
                feedback: "Time in the market beats timing the market. Start small, but start NOW."
            },
            {
                type: "activity",
                activityType: "compounding_curve",
                title: "Grow Your Tree",
                description: "Water your money tree regularly and watch the exponential growth."
            },
            {
                type: "decision",
                scenario: "The market crashes 20% due to global news! Your portfolio shows red (-₹50,000).",
                options: [
                    {
                        text: "Panic Sell! Save what's left!",
                        consequence: "bad",
                        feedback: "You just made a temporary loss permanent. Buy low, sell high... remember?"
                    },
                    {
                        text: "Stay Calm & Continue SIP",
                        consequence: "good",
                        feedback: "Champion mindset! You are buying more units at lower prices. This will pay off huge later."
                    }
                ]
            }
        ]
    },
    6: {
        id: 6,
        title: "The Freedom Goal",
        stages: [
            {
                type: "story",
                content: `
# Is this it?
Work, Earn, Spend. Work, Earn, Spend.
            
Is that the loop for the next 40 years?
            
Level 6 is about **F.I.R.E.** (Financial Independence, Retire Early).
It's not about not working. It's about working because you *want* to, not because you *have* to.
            
When your investments pay for your lifestyle, you are Free.
`
            },
            {
                type: "quiz",
                question: "What is the 'corpus' requirement for Financial Independence (Rule of 25)?",
                options: [
                    "10x Annual Expenses",
                    "25x Annual Expenses",
                    "₹10 Crores (Fixed)"
                ],
                answer: 1,
                feedback: "A common thumb rule. If you spend ₹10L/year, you need ₹2.5 Crores invested properly."
            },
            {
                type: "activity",
                activityType: "freedom_calculator",
                title: "Design Your Dream Life",
                description: "Select your lifestyle goals and see when you can achieve Financial Freedom."
            },
            {
                type: "decision",
                scenario: "You got a big bonus! You can upgrade to a luxury car (higher EMI) or put it in your Freedom Fund.",
                options: [
                    {
                        text: "Buy the Car (Life is short)",
                        consequence: "bad",
                        feedback: "Instant gratification is the enemy of freedom. You just added 3 more working years to your life."
                    },
                    {
                        text: "Invest for Freedom",
                        consequence: "good",
                        feedback: "You just bought your future self time and freedom. That is the ultimate luxury."
                    }
                ]
            }
        ]
    }
};
