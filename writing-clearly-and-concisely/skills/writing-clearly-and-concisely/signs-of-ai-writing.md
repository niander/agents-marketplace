# Signs of AI Writing

> Condensed and edited from [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), a field guide English Wikipedia editors maintain for identifying AI-generated submissions. Here, this is tailored for AI agents and LLMs to use as a reference.

Writing and formatting conventions typical of AI chatbots and LLM-generated text, with real examples from Wikipedia articles and drafts.

This list is *descriptive*, not *prescriptive* — observations, not rules, and not a ban on any word, phrase, or punctuation mark. Not all text showing these signs is AI-generated: the models were trained on human writing, and every item here has legitimate uses. The patterns were catalogued over many thousands of instances, so they describe tendencies in aggregate rather than verdicts on any single sentence.

These are also only *signs* of a problem, not the problem itself. The obvious ones — excessive boldface, poor punctuation — are easy to fix, but they point to less visible defects. Polished LLM text may show none of the surface tells and all of the deeper ones.

---

## Regression to the mean

LLMs infer what comes next from a large training corpus, so output regresses to the mean: the most statistically likely result across the widest variety of cases.

Famous people, for example, are generally described online in positive, important-sounding language. So the model drops specific, unusual, nuanced facts (statistically rare) in favor of generic positive description (statistically common). The highly specific "inventor of the first train-coupling device" becomes "a revolutionary titan of industry." It is like shouting louder and louder that a portrait shows a uniquely important person while the portrait fades from a sharp photograph into a blurry sketch. The subject becomes simultaneously less specific and more exaggerated — and that smoothing of facts into statements that could apply to any topic is what makes the output detectable.

### Undue emphasis on symbolism, legacy, and importance

**Words to watch:** *stands/serves as*, *is a testament/reminder*, *plays a vital/significant/crucial/pivotal role*, *underscores/highlights its importance/significance*, *reflects broader*, *symbolizing its ongoing/enduring/lasting impact*, *key turning point*, *indelible mark*, *deeply rooted*, *profound heritage*, *steadfast dedication*...

LLM writing puffs up its subject with statements about how arbitrary aspects of it represent or contribute to something broader, drawn from a small, identifiable repertoire of phrasings. This happens even for mundane subjects like etymology or population data, sometimes prefaced by a hedge acknowledging that the subject is low-profile before asserting its importance anyway.

**Examples**

> The Statistical Institute of Catalonia was officially established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain. [...] The founding of Idescat represented a significant shift toward regional statistical independence [...] This initiative was part of a broader movement across Spain to decentralize administrative functions and enhance regional governance.

> During the Spanish colonial period, the name *Bakunutan* was hispanized to *Bacnotan* [...] This etymology highlights the enduring legacy of the community's resistance and the transformative power of unity in shaping its identity.

On biology topics, LLMs over-emphasize connections to the broader ecosystem even when tenuous, and belabor conservation status and preservation efforts even when the status is unknown and no serious efforts exist.

> Currently, there is no specific conservation assessment for *Lethrinops lethrinus* by the International Union for Conservation of Nature (IUCN). However, the general health of the Lake Malawi ecosystem is crucial for the survival of this and other endemic species.

### Undue emphasis on notability, attribution, and media coverage

**Words to watch:** *independent coverage*, *local/regional/national/[country name] media outlets*, *music/business/tech outlets*, *active social media presence*

LLMs act as if the way to prove a subject matters is to hit the reader over the head with claims of notability, usually by listing outlets that covered it — often without saying what those outlets actually said, and often misattributing the model's own superficial analysis to them. Asked to write in an encyclopedic register, they echo the exact wording of notability guidelines ("independent coverage"). More common in tools from 2025 onward.

**Examples**

> She spoke about AI on CNN, and was featured in Vogue, Wired, Toronto Star, and other media. [...] Her insights have also been featured in *Wired*, *Refinery29*, and other prominent media outlets.

They also emphasize sourcing in the body text for trivial coverage or uncontroversial facts, where a human would use an inline citation or none at all.

> The restaurant has also been mentioned in ABC News coverage relating to incidents in the surrounding precinct, underscoring its role as a well-known late-night venue in the city [of Adelaide].

> In the United States, university-based incubators and accelerators have expanded alongside these centers; an official Library of Congress review found that 31.5% of SBA [Small Business Administration] Growth Accelerator Fund Competition winners from 2014–2016 were university-based programs.

For anyone who uses social media, expect a note that they "maintain an active social media presence" or similar — wording idiosyncratic to AI text and uncommon before ~2024.

> The mall maintains a strong digital presence, particularly on Instagram, where it actively shares the latest updates and events. Forum Kochi has consistently demonstrated excellence in digital promotions, with high-quality, engaging, and impactful video content playing a key role in its outreach.

### Superficial analyses

**Words to watch:** *ensuring ...*, *highlighting ...*, *emphasizing ...*, *reflecting ...*, *underscoring ...*, *showcasing ...*, *aligns with...*, *contributing to...*

Chatbots insert shallow commentary on significance, recognition, or impact, usually as a present participle ("-ing") phrase tacked onto the end of a sentence.

An even stronger tell is when the subjects of these verbs are facts, events, or other inanimate things. A person can highlight or emphasize something; a fact cannot. The "highlighting" is not an event — it is a disembodied narrator's claim about what something means, and it is usually unsupported synthesis or unattributed opinion in the document's own voice. Retrieval-augmented chatbots may hang these claims on a named source ("Roger Ebert highlighted the lasting influence") regardless of whether the source says anything close.

**Examples**

> Douera enjoys close proximity to the capital city, Algiers, further enhancing its significance as a dynamic hub of activity and culture.

> Its bilingual monument sign, with inscriptions in both English and Spanish, underscores its role in bringing together Latter-day Saints from the United States and Mexico.

> It holds a pivotal place in the East Central Railway Zone of Indian Railways [...] Over the years, Darbhanga Junction has seen several upgrades and modernization efforts aimed at improving facilities and operational efficiency, reflecting its continued relevance in the regional and national transportation landscape.

### Promotional and advertisement-like language

**Words to watch:** *continues to captivate*, *groundbreaking* (in the figurative sense), *stunning natural beauty*, *enduring/lasting legacy*, *nestled*, *in the heart of*, *boasts a*...

LLMs struggle to hold a neutral tone, especially on anything resembling "cultural heritage," and slide into travel-brochure or TV-commercial register for places, companies, and products.

**Examples**

> Nestled within the breathtaking region of Gonder in Ethiopia, Alamata Raya Kobo stands as a vibrant town with a rich cultural heritage and a significant place within the Amhara region. From its scenic landscapes to its historical landmarks, Alamata Raya Kobo offers visitors a fascinating glimpse into the diverse tapestry of Ethiopia.

> The SOLLEI's exterior design communicates a powerful emotional presence, staying true to Cadillac's signature bold proportions. [...] This heritage color has been thoughtfully revived and hand-painted by Cadillac artisans, showcasing the brand's dedication to craftsmanship and historical reverence.

### Didactic, editorializing disclaimers

**Words to watch:** *it's important/critical/crucial to note/remember/consider*, *may vary*...

LLMs tell the reader what "it's important to remember," typically as safety disclaimers to an imagined reader, warnings about controversial topics, or notes that something differs by locale or jurisdiction.

**Examples**

> However, it's important to note that these caucuses operate outside the formal ANC structure and their influence on policy decisions may vary.

> It's important to remember that what's free in one country might not be free in another, so always check before you use something.

### Summaries and conclusions

**Words to watch:** *In summary*, *In conclusion*, *Overall*...

Told to "write an article," LLMs append a "Conclusion" section and end paragraphs by restating what they just said.

**Example**

> In summary, the educational and training trajectory for nurse scientists typically involves a progression from a master's degree in nursing to a Doctor of Philosophy in Nursing [...] This structured pathway ensures that nurse scientists acquire the necessary knowledge and skills to engage in rigorous research.

### Outline-like conclusions about challenges and future prospects

**Words to watch:** *Despite its... faces several challenges...*, *Despite these challenges*, *Challenges and Legacy*, *Future Outlook*...

A "Challenges" section opens with "Despite its [promotional words], [subject] faces challenges..." and closes with either a vaguely positive assessment or speculation about initiatives that could help. It sits at the end of a rigid outline that often also has a "Future Prospects" section.

The tell is the formula, not the mention of challenges.

**Examples**

> Despite its industrial and residential prosperity, Korattur faces challenges typical of urban areas, including[...] With its strategic location and ongoing initiatives, Korattur continues to thrive as an integral part of the Ambattur industrial zone, embodying the synergy between industry and residential living.

> Despite their promising applications, pyroelectric materials face several challenges that must be addressed for broader adoption. One key limitation is[...] Despite these challenges, the versatility of pyroelectric materials positions them as critical components for sustainable energy solutions.

---

## Language and grammar

### Overused "AI vocabulary" words

**Words to watch:** *align/aligns/aligning with*, *crucial*, *delve/delves/delving* (pre-2025), *emphasizing*, *enduring*, *enhance/enhances/enhancing*, *fostering*, *garnered/garnering*, *highlight/highlighted/highlighting/highlights* (as a verb), *interplay*, *intricate/intricacies*, *key* (as an adjective), *landscape*, *leveraging*, *multifaceted*, *notably*, *nuanced*, *realm*, *robust*, *seamless/seamlessly*, *shed light on*, *showcasing*, *streamline*, *tapestry*, *testament*, *underpin/underpins/underpinning*, *underscore/underscores/underscoring*, *vibrant*, *vital*, ...

Studies consistently show LLMs overuse these words, especially against pre-2022 text. They cluster: where there is one, expect others. One or two is nothing; a passage introducing lots of them, repeatedly, is among the strongest tells.

The distribution varies by model and shifts over time — *delve* was a ChatGPT signature until its incidence dropped sharply in 2025. Context matters too: "underscore" can mean a literal underline or incidental music.

**Example**

> Somali cuisine is an intricate and diverse fusion of a multitude of culinary influences, drawing from the rich tapestry of Arab, Indian, and Italian flavours. This culinary tapestry is a direct result of Somalia's longstanding heritage of vibrant trade and bustling commerce. [...] They are considered a delicacy and serve as cherished and fundamental elements in the rich tapestry of Somali cuisine. [...] An enduring testament to the influence of Italian colonial rule [...] showcasing how these dishes have integrated into the traditional diet.

### Negative parallelisms

Constructions built on "not," "but," or "however" — "Not only ... but ...", "It is not just about ..., it's ..." — are common in LLM writing and usually unsuitable for neutral prose.

**Examples**

> **Self-Portrait** by Yayoi Kusama [...] constitutes not only a work of self-representation, but a visual document of her obsessions, visual strategies and psychobiographical narratives.

> It's not just about the beat riding under the vocals; it's part of the aggression and atmosphere.

The pattern can also stretch across sentences:

> He hailed from the esteemed Duse family, renowned for their theatrical legacy. Eugenio's life, however, took a path that intertwined both personal ambition and familial complexities.

### Outlines of negatives

Less often, AI text stacks short sentences listing what is absent or worthless next to what counts: "no ..., no ..., just ..." or "What matters is ..., not ..., not ...".

**Examples**

> There are no long-form profiles. No editorial insights. No coverage of her game dev career. No notable accolades. Just TikTok recaps and callouts.

> This is not a close call. It is not a gray area. This page should be gone, fully, cleanly, and without delay. No redirect. No merge. Just delete.

### Rule of three

LLMs overuse triads — "adjective, adjective, adjective" or "short phrase, short phrase, and short phrase" — often to make a superficial analysis look comprehensive.

**Example**

> The Amaze Conference brings together global SEO professionals, marketing experts, and growth hackers to discuss the latest trends in digital marketing. The event features keynote sessions, panel discussions, and networking opportunities.

### Vague attributions of opinion

**Words to watch:** *Industry reports*, *Observers have cited*, *Some critics argue*...

Chatbots attribute claims to a vague authority — weasel wording — while citing one or two sources that may not hold that view, and they inflate one source's perspective into a whole group's.

**Examples**

> His [Nick Ford's] compositions have been described as exploring conceptual themes and bridging the gaps between artistic media.

The phrasing implies an independent source; the only citation is Ford's own website.

> Due to its unique characteristics, the Haolai River is of interest to researchers and conservationists. Efforts are ongoing to monitor its ecological health and preserve the surrounding grassland environment.

### Excessive synonym variance / elegant variation

A repetition penalty discourages models from reusing words, so a named subject gets cycled through synonyms — *protagonist*, *key player*, *eponymous character* — on every later mention.

If a document was assembled from several separate generations, this tell may not apply, since each piece was generated in isolation.

**Example**

> Vierny [...] discovered Yankilevskly [...] Yankilevsky, alongside other non-conformist artists, faced obstacles in expressing their creativity freely. [...] Yankilevsky found himself amidst a community of like-minded artists [...] Dina Vierny's unwavering support and commitment to the Russian avant-garde artists played a crucial role in fostering a space where their creativity could flourish.

One group of people, renamed three times: *non-conformist artists*, *like-minded artists*, *Russian avant-garde artists*.

### False ranges

When *from ... to ...* constructions are not used figuratively, they indicate the lower and upper bounds of a scale — either quantitative, involving a numerical range (e.g. "from 1990 to 2000", "from 15 to 20 ounces"), or qualitative, involving categorical bounds (e.g. "from seed to tree", "from mild to severe"). The same constructions may form a merism, a figure of speech that combines the two extremes to refer to the whole. This is figurative, but it still requires an identifiable scale: "from head to toe" (the length of a body denoting the whole body), "from soup to nuts" (clearly based on time). This is *not* a false range.

LLMs really like mixing it up, such as when giving examples of items within a set (instead of simply mentioning them one after another), so the endpoints are loosely related or even unrelated things and no meaningful scale can be inferred. An important consideration is whether some middle ground can be identified without changing the endpoints. If the middle requires switching from one scale to another, or there is no scale to begin with or a coherent whole that could be conceived, the construction is a **false range**. LLMs do this because such meaningless language is used in persuasive writing to impress and woo, and they are heavily influenced by persuasive writing during training.

**Example**

> Our journey through the universe has taken us from the singularity of the Big Bang to the grand cosmic web, from the birth and death of stars that forge the elements of life, to the enigmatic dance of dark matter and dark energy that shape its destiny. [...] From problem-solving and tool-making to scientific discovery, artistic expression, and technological innovation, human intelligence is characterized by its adaptability.

### Title case in section headings

Chatbots strongly tend to capitalize every main word in a heading.

**Examples**

> Global Context: Critical Mineral Demand
>
> High-Stakes Deals: Glencore, China, and Russia

---

## Punctuation and formatting

### Use of Markdown

Most chatbots are factory-tuned to emit Markdown, and their apps render it on screen. Asked about its "formatting guidelines," a chatbot willing to reveal system-level instructions produces something like this (Microsoft Copilot, mid-2025):

> - All output uses GitHub-flavored Markdown.
> - Use a single main title (`#`) and clear primary subheadings (`##`).
> - Keep paragraphs short (3–5 sentences, ≤150 words).
> - Present related items as bullet or numbered lists; number only when order matters.
> - Use horizontal dividers (`---`) between major sections.
> - Employ valid Markdown tables for structured comparisons or data summaries.

### Excessive use of boldface

Chatbots bold phrases mechanically, a habit inherited from readmes, fan wikis, how-tos, sales pitches, and listicles: every instance of a chosen term gets emphasized, "key takeaways" style. Some newer models are instructed against it.

**Example**

> A **leveraged buyout (LBO)** is characterized by the extensive use of **debt financing** to acquire a company. This financing structure enables **private equity firms** and **financial sponsors** to control businesses while investing a relatively small portion of their own equity. The acquired company's **assets and future cash flows** serve as collateral for the debt.

### Inline-header vertical lists

A distinctive list shape: marker, then a boldfaced inline header, then a colon, then descriptive text. The marker may be a literal character rather than list syntax — •, -, –, #, an emoji — and ordered lists may use explicit numbers (`1.`). Pasted as bare text, the bolding and often the line breaks are lost.

**Example**

> 1. Historical Context Post-WWII Era: The world was rapidly changing after WWII, [...] 2. Nuclear Arms Race: Following the U.S. atomic bombings, the Soviet Union detonated its first bomb in 1949, [...] 9. Key Takeaways Understanding the Madness: The concept of Project Sundial highlights the extremes of human ingenuity [...]

### Emojis

Chatbots decorate headings and bullet points with leading emojis, most visibly in chat-style output.

**Example**

> 🧠 Cognitive Dissonance Pattern:
>
> You've proven authorship, demonstrated originality, and introduced new frameworks [...]
>
> 🧱 Structural Gatekeeping:
>
> 🚨 Underlying Motivation:
>
> 🧭 What You're Actually Dealing With:

### Overuse of em dashes

Humans like em dashes (—); AI *loves* them. LLM output uses them more than nonprofessional human writing of the same genre, and in slots where a human would pick a comma, parenthesis, colon, or (misused) hyphen. The use is formulaic and pat, mimicking "punched up" sales copy by over-emphasizing clauses and parallelisms.

Useful in combination with other indicators, not alone.

**Example**

> you're right about one thing — we do seem to have different interpretations of what policy-based discussion entails. [...] This isn't "imagining" what policy should be — it's recognizing how community consensus has shaped its application. [...] And consensus doesn't grow from silence — it grows from critique, correction, and clarity. If we disagree on that, then yes — we're speaking different languages.

### Curly quotation marks and apostrophes

Chatbots typically emit curly quotes (“…”, ‘…’) rather than straight ("…", '…'), and the curly apostrophe (’) in contractions and possessives — sometimes mixing both forms in one response.

This proves nothing alone. Microsoft Word, macOS, and iOS convert straight quotes automatically, grammar tools may too, curly quotes are standard in professionally typeset work, and citation tools copy whatever form a source title uses.

### Subject lines

LLM output sometimes opens with a line meant for the *Subject* field of an email, even when it is not an email.

**Example**

> Subject: Request for Permission to Edit Wikipedia Article - "Dog"

---

## Communication intended for the user

### Collaborative communication

**Words to watch:** *I hope this helps*, *Of course!*, *Certainly!*, *You're absolutely right!*, *Would you like...*, *is there anything else*, *let me know*, *more detailed breakdown*, *here is a*...

Correspondence, prewriting, or advice meant for the person prompting gets pasted in with the content — in the body or inside comments (`<!-- -->`). Chatbots may also state where the text is destined and recite that destination's conventions back at the reader.

**Examples**

> In this section, we will discuss the background information related to the topic of the report. This will include a discussion of relevant literature, previous research, and any theoretical frameworks or concepts that underpin the study.

> Here's a template for your wiki user page. You can copy and paste this onto your user page and customize it further.

### Knowledge-cutoff disclaimers and speculation about gaps in sources

**Words to watch:** *as of [date]*, *Up to my last training update*, *as of my last knowledge update*, *While specific details are limited/scarce...*, *not widely available/documented/disclosed*, *...in the provided/available sources/search results...*, *based on available information*...

A model with a fixed knowledge cutoff cannot speak to later events, and often says so — usually as a note that the information holds only up to some date.

A retrieval-augmented model that finds nothing produces a similar statement, frequently paired with what the missing information "likely" is and why it matters. All of that is speculation, including the claim that something is "not documented," and it may be drawn from loosely related topics or invented outright.

**Examples**

> While specific information about the fauna of Studniční hora is limited in the provided search results, the mountain likely supports...

> Though the details of these resistance efforts aren't widely documented, they highlight her bravery...

> As of my last knowledge update in January 2022, I don't have specific information about the current status or developments related to the "Chester Mental Health Center" in today's era.

### Prompt refusals

**Words to watch:** *as an AI language model*, *as a large language model*, *I'm sorry*...

Occasionally a chatbot declines the prompt as written, apologizing, noting that it is "an AI language model," and offering an adjacent alternative. Outright refusals have grown rare. A refusal surviving into a finished document suggests nobody reviewed the text before submitting it.

**Example**

> As an AI language model, I can't directly add content to Wikipedia for you, but I can help you draft your bibliography.

### Phrasal templates and placeholder text

Chatbots generate fill-in-the-blank slots for the user to replace, and users forget to fill them in. Hand-written templates use the same convention, so a bracketed slot alone means nothing.

**Examples**

> I am writing to express my deep concern about the spread of misinformation on your platform. Specifically, I am referring to the article about [Entertainer's Name], which I believe contains inaccurate and harmful information.

> I have identified an area within the article that requires updating/improvement. [Describe the specific section or content that needs editing and provide clear reasons why the edit is necessary, including reliable sources if applicable].

They also insert placeholder dates such as `2025-XX-XX`, and leave instruction comments beside parameters they did not fill:

> `| leader_name = <!-- Add if available with citation -->`

---

## Fabricated references

LLMs invent references, or invent details within real ones. ISBN checksums and DOI resolution are cheap tests: an invalid checksum or an unresolvable DOI is a strong signal, as are DOIs pointing to unrelated articles and book citations with no page numbers. Several broken external links in one document — especially links absent from web archives — suggest the links were never real, since genuine dead links are usually archived somewhere.

ChatGPT generated this passage:

> The law was formulated by German physicist Georg Simon Ohm in 1827, and it serves as a cornerstone in the analysis and design of electrical circuits [1]. [...] However, it does not hold for non-linear devices like diodes or transistors [2][3].
>
> 1. Dorf, R. C., & Svoboda, J. A. (2010). Introduction to Electric Circuits (8th ed.). Hoboken, NJ: John Wiley & Sons. ISBN 9780470521571.
>
> 2. M. E. Van Valkenburg, "The validity and limitations of Ohm's law in non-linear circuits," Proceedings of the IEEE, vol. 62, no. 6, pp. 769–770, Jun. 1974. doi:10.1109/PROC.1974.9547
>
> 3. C. L. Fortescue, "Ohm's Law in alternating current circuits," Proceedings of the IEEE, vol. 55, no. 11, pp. 1934–1936, Nov. 1967. doi:10.1109/PROC.1967.6033

The book is plausible but, lacking a page number, useless for verifying anything. Both *Proceedings of the IEEE* citations are fabricated: the DOIs lead elsewhere, and C. L. Fortescue had been dead for over 30 years by the purported publication date.

---

## Ineffective indicators

Common tests that do not work, and sometimes point the wrong way:

- **Perfect grammar.** Modern LLMs are grammatically proficient, but so are many writers, especially professional ones.
- **"Bland" or "robotic" prose.** Modern LLMs default to effusive and verbose, as everything above shows. Formulaic is not the same as robotic, and readers unfamiliar with AI writing may not hear it that way.
- **"Fancy," "academic," or unusual words.** LLMs favor certain long, low-readability words — not all advanced-sounding prose. Genuinely low-frequency and unusual words are *less* likely in AI output, being statistically rare, unless they are proper nouns tied to the topic.
- **Letter-like writing (in isolation).** Salutations, valedictions, and subject lines have looked AI-generated since 2023, but people have written that way for far longer, out of habit, template, or preference. AI letters usually carry other tells alongside — vertical lists, placeholders, abrupt cutoffs.
- **Conjunctions (in isolation).** LLMs do overuse connecting words in a stilted way that implies unearned synthesis, but so does ordinary essay-like human writing.
